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
  DATA_FETCH_ERROR_TEXT
} from "@/helpers/constants";

const geocoderMatches = query => {
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
  const matches = geocoderMatches(query);
  if (!matches) {
    return null;
  }
  return sensorGeoJSON.sort(
    (el1, el2) =>
      stringSimilarity.compareTwoStrings(query, el2.properties.description) -
      stringSimilarity.compareTwoStrings(query, el1.properties.description)
  );
};

export const parseSensorInformation = responses =>
  responses.map(el => {
    const location = el.Locations[0];
    const coordinates = location.location.coordinates;
    const name = location.name;
    const id = el["@iot.id"];
    const description = el.description.toLowerCase();
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
    sensors.set(id, sensor);
    return sensor.geoJSON;
  });

export const getSensorInformation = () => {
  // Get relevant information about all sensors that report a water level datastream.
  // The information we are looking for involves, sensor ids, locations, names and ids of datastreams they report, elevation etc. See parseSensorInformation() for details.
  // While this information is enough to set-up our Sensor and Datastream objects, and to plot the sensors on the map, we don't actually fetch their observations yet.
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
  // datastream.observations.push(...observations);
  if (!observations.length) {
    return;
  }
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
    // matchingIndex may be zero, so don't do !matchingIndex
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
    return axios
      .get(nextLink)
      .then(res =>
        parseSensorData(
          res.data.value,
          res.data["@iot.nextLink"],
          { data, offset, lookupArray },
          times,
          index,
          indexOffset + 100
        )
      );
  } else {
    while (index < times.length) {
      const diff = Math.abs(
        differenceInMinutes(times[index], observations[i - 1].resultTime)
      );
      if (diff <= store.getters["timelapse/threshold"]) {
        lookupArray.push(i - 1 + indexOffset);
      } else {
        lookupArray.push(...Array(times.length - index).fill(undefined));
        break;
      }
      index++;
    }
  }
  return Promise.resolve();
};

export const getSensorData = () => {
  const times = store.getters["timelapse/times"];
  const axiosArr = [];
  const datastreamArr = [];
  for (const sensor of sensors.values()) {
    // For each datastream of a sensor, get a URL to start off parsing observations from.
    axiosArr.push(
      ...sensor.datastreams.map(datastream => {
        datastream.reset();
        datastreamArr.push(datastream); // will help us keep track of which URL corresponds to which datastream object when the axios request completes.
        // Check if the cache has a URL corresponding to a date >= the last date in the time intervals array
        const url = datastreamObservationsLink(
          datastream.id,
          times[0],
          times[times.length - 1]
        );
        return axios.get(encodeUrl(url));
      })
    );
  }
  // Use axios.all to perform requests in parallel
  return axios
    .all(axiosArr)
    .then(responses =>
      axios.all(
        responses.map((res, i) =>
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
  const startDateWithThreshold = addMinutes(
    startDate,
    -store.getters["timelapse/threshold"]
  ).toISOString();
  const endDateWithThreshold = addMinutes(
    endDate,
    store.getters["timelapse/threshold"]
  ).toISOString();
  return `https://api.sealevelsensors.org/v1.0/Datastreams(${id})/Observations?$select=result,resultTime&$orderby=resultTime asc&$filter=((resultTime ge ${startDateWithThreshold}) and (resultTime le ${endDateWithThreshold}))`;
};

store.watch(
  (state, getters) => getters["timelapse/times"],
  // eslint-disable-next-line no-unused-vars
  _ => {
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
      store.commit("timelapse/resetState");
      store.commit("picker/resetState");
    }
  }
);
