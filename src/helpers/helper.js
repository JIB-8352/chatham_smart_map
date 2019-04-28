import axios from "axios";
import encodeUrl from "encodeurl";
import Sensor from "./sensor";
import Datastream from "./datastream";
import stringSimilarity from "string-similarity";
import store from "@/store";
import {
  compareAsc,
  closestIndexTo,
  differenceInMinutes,
  addMinutes
} from "date-fns";
import {
  sensors,
  GEOCODER_MATCHING_THRESHOLD,
  DATA_FETCH_ERROR_TEXT,
  API_SKIP_COUNT
} from "@/helpers/constants";

const geocoderMatches = query => {
  /* Returns a boolean to represent if any word of query matches the keyword "sensor" to some
   degree as determined by the threshold. */
  const temp = query.toLowerCase();
  return temp
    .split(" ")
    .some(
      el =>
        stringSimilarity.compareTwoStrings(el, "sensor") >
        GEOCODER_MATCHING_THRESHOLD
    );
};

export const sensorGeocoder = (query, sensorGeoJSON) => {
  /* The custom geocoder that allows searching for sensors by name. Essentially, the user must type
  a word close enough to "sensor" in the search box for the geocoder to display sensor names in its results. */
  const matches = geocoderMatches(query);
  if (!matches) {
    return null;
  }
  /* Results are presented in order of the sensor's location description matching the query.
    Using description as opposed to name makes sense here as query and description are lowercase,
    while name is not and compareTwoStrings is case-sensitive. We also added description to each sensor's
    GeoJSON so that it can be accessed here. */
  return sensorGeoJSON.sort(
    (el1, el2) =>
      stringSimilarity.compareTwoStrings(query, el2.properties.description) -
      stringSimilarity.compareTwoStrings(query, el1.properties.description)
  );
};

export const parseSensorInformation = responses =>
  responses.map(el => {
    /* Grab all the fields we want from each response to initialize a sensor object and datastream
     objects for all the datastreams the sensor reports. */
    const location = el.Locations[0];
    const coordinates = location.location.coordinates;
    const name = location.name;
    const id = el["@iot.id"];
    const description = el.description.toLowerCase(); // make description lowercase
    const elevation = Number(el.properties.elevationNAVD88);

    const datastreams = el.Datastreams.map(datastream => {
      const id = datastream["@iot.id"];
      const name = datastream.name;
      const unitSymbol = datastream.unitOfMeasurement.symbol;
      return new Datastream(id, name, unitSymbol);
    });
    // Ensure that water level datastream is the first element, so that it appears first in the graphs
    const waterlevelIndex = datastreams.findIndex(
      datastream => datastream.name === "Water Level"
    );
    const waterlevelDatastream = datastreams.splice(waterlevelIndex, 1)[0];
    // Sensor elevation is used as an offset on water level observations
    waterlevelDatastream.offset = elevation;
    datastreams.unshift(waterlevelDatastream);

    const sensor = new Sensor(id, coordinates, name, description, datastreams);
    sensors.set(id, sensor); // add the sensor object to the Map
    return sensor.geoJSON;
  });

export const getSensorInformation = () => {
  /* Get relevant information about all sensors that report a water level datastream.
    The information we are looking for involves sensor ids, locations, names and ids of datastreams
    they report, elevation etc. See parseSensorInformation() for details.
    While this information is enough to set-up our sensor and datastream objects, and to add the
    sensors to the map, we don't fetch their observations yet */
  const url = encodeUrl(`https://api.sealevelsensors.org/v1.0/Things?$select=@iot.id,description,properties&$filter=Datastreams/name eq 'Water Level'&$expand=Datastreams($select=unitOfMeasurement,name,@iot.id),
Locations($select=name,location)`);
  return axios.get(url);
};

const parseSensorData = (
  observations,
  nextLink,
  { data, offset, lookupArray },
  times,
  index,
  indexOffset
) => {
  if (!observations.length) {
    return;
  }
  // index represents the current entry in the times array for which we are trying to find a match.
  /* Since matches are added to the lookupArray on the fly, that is, a 100 observations at a time,
    indexOffset lets us track how many observations we have already seen.
  */
  let i = 0;
  while (index < times.length && i < observations.length - 1) {
    const leftComp = compareAsc(times[index], observations[i].resultTime);
    const rightComp = compareAsc(times[index], observations[i + 1].resultTime);
    let matchingIndex = undefined;

    if (!leftComp || (leftComp < 0 && rightComp < 0)) {
      // times[index] equals observations[i].resultTime, or is lesser than both observations[i].resultTime and observations[i + 1].resultTime
      matchingIndex = i;
    } else if (!rightComp) {
      // times[index] equals observations[i + 1].resultTime but is greater than observations[i].resultTime
      matchingIndex = i + 1;
    } else if (rightComp < 0) {
      // observations[i + 1].resultTime > times[index] > observations[i].resultTime
      matchingIndex =
        i +
        closestIndexTo(times[index], [
          observations[i].resultTime,
          observations[i + 1].resultTime
        ]);
    }
    // matchingIndex may be zero, so don't refactor the predicate to if (matchingIndex)
    if (matchingIndex !== undefined) {
      const diff = Math.abs(
        differenceInMinutes(
          times[index],
          observations[matchingIndex].resultTime
        )
      );
      if (diff <= store.getters["timelapse/threshold"]) {
        lookupArray.push(matchingIndex + indexOffset);
      } else {
        lookupArray.push(undefined);
      }
      index++;
    } else {
      const { result, resultTime } = observations[i];
      const x = new Date(resultTime).getTime();
      const y = +(result + offset).toFixed(3);
      data.push([x, y]);
      i++; // times[index] is greater than both
    }
  }

  while (i < observations.length) {
    const { result, resultTime } = observations[i];
    const x = new Date(resultTime).getTime();
    const y = +(result + offset).toFixed(3);
    data.push([x, y]);
    i++;
  }

  if (nextLink) {
    // a nextLink is present, so there are more observations to be fetched, regardless of what index is.
    // return the promise
    return axios
      .get(nextLink)
      .then(res =>
        parseSensorData(
          res.data.value,
          res.data["@iot.nextLink"],
          { data, offset, lookupArray },
          times,
          index,
          indexOffset + API_SKIP_COUNT
        )
      );
  } else {
    // No more observations, try to match the remaining entries in times array with the last observation.
    while (index < times.length) {
      const diff = Math.abs(
        differenceInMinutes(times[index], observations[i - 1].resultTime)
      );
      if (diff <= store.getters["timelapse/threshold"]) {
        lookupArray.push(i - 1 + indexOffset);
      } else {
        lookupArray.push(undefined);
      }
      index++;
    }
  }
  return Promise.resolve(); // this method must return a promise
};

export const getSensorData = () => {
  const times = store.getters["timelapse/times"];
  const axiosArr = [];
  const datastreamArr = [];
  for (const sensor of sensors.values()) {
    // For each datastream of a sensor, get a URL to start parsing observations from.
    axiosArr.push(
      ...sensor.datastreams.map(datastream => {
        datastream.reset();
        /* datastreamArr will help us keep track of which URL corresponds to which datastream object
          when the axios requests complete and we have to parse the data. */
        datastreamArr.push(datastream);
        const url = datastreamObservationsLink(
          datastream.id,
          times[0],
          times[times.length - 1]
        );
        return axios.get(encodeUrl(url));
      })
    );
  }
  /* The first axios.all allows us to perform requests in parallel. The second axios.all allows us to
   wait for all the requests to end. */
  return axios.all(axiosArr).then(responses =>
    axios.all(
      responses.map((res, i) =>
        // Each response holds observations corresponding to a datastream
        parseSensorData(
          res.data.value,
          res.data["@iot.nextLink"],
          datastreamArr[i],
          times,
          0,
          0
        )
      )
    )
  );
};

const datastreamObservationsLink = (id, startDate, endDate) => {
  /* The threshold is taken into account even while fetching data so that we don't miss observations
    in the threshold windows corresponding to startDate and endDate. */
  const startDateWithThreshold = addMinutes(
    startDate,
    -store.getters["timelapse/threshold"]
  ).toISOString();
  const endDateWithThreshold = addMinutes(
    endDate,
    store.getters["timelapse/threshold"]
  ).toISOString();
  // Get observations for a datastream filtered and ordered by resultTime
  return `https://api.sealevelsensors.org/v1.0/Datastreams(${id})/Observations?$select=result,resultTime&$orderby=resultTime asc&$filter=((resultTime ge ${startDateWithThreshold}) and (resultTime le ${endDateWithThreshold}))`;
};

store.watch(
  (state, getters) => getters["timelapse/times"],
  // eslint-disable-next-line no-unused-vars
  _ => {
    // Fetch observations for each datastream again when store.getters["timelapse/times"] array updates.
    store.commit("app/updatingData", {
      updatingData: true
    });
    store.commit("app/startLoading");
    getSensorData()
      .catch(() => {
        // This will catch ALL errors
        store.commit("app/showWarning", {
          warningText: DATA_FETCH_ERROR_TEXT
        });
      })
      .finally(() => {
        store.commit("app/updatingData", {
          updatingData: false
        });
        store.commit("app/stopLoading");
      });
  }
);

store.watch(
  (state, getters) => getters["app/reset"],
  reset => {
    if (reset) {
      /* Before the timelapse components disappear, reset their state to their default start state
        so that there aren't any anomalies when the components appear again. */
      store.commit("timelapse/resetState");
      store.commit("picker/resetState");
    }
  }
);
