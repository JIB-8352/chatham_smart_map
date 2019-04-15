import axios from "axios";
import encodeUrl from "encodeurl";
import Sensor from "./sensor";
import Datastream from "./datastream";
import stringSimilarity from "string-similarity";
import store from "@/store";
import { compareAsc, closestIndexTo, differenceInMinutes } from "date-fns";

let sensors = new Map();

const geocoderMatches = query => {
  const temp = query.toLowerCase();
  return temp
    .split(" ")
    .some(el => stringSimilarity.compareTwoStrings(el, "sensor") > 0.65);
};

const sensorGeocoder = (query, sensorGeoJSON) => {
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

const parseSensorInformation = responses =>
  responses.map(el => {
    const location = el.Locations[0];
    const coordinates = location.location.coordinates;
    const name = location.name;
    const id = el["@iot.id"];
    const description = el.description.toLowerCase();
    const elevation = Number(el.properties.elevationNAVD88);
    // const observation = el.Datastreams[0].Observations[0];
    const datastreams = el.Datastreams.map(datastream => {
      const id = datastream["@iot.id"];
      const name = datastream.name;
      const unitSymbol = datastream.unitOfMeasurement.symbol;
      return new Datastream(id, name, unitSymbol);
    });

    const sensor = new Sensor(
      id,
      coordinates,
      name,
      description,
      elevation,
      datastreams
    );
    sensors.set(id, sensor);

    return sensor.geoJSON;
  });

// Assumes that no sensor has an id of -99
const getPaintProperty = (id = -99) => [
  "case",
  ["==", ["id"], id],
  "#008000",
  "#007cbf"
];

const getSensorInformation = () => {
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
  datastream,
  index,
  times,
  curLink
) => {
  if (!observations) {
    return;
  }

  let i = 0;
  while (index >= 0 && i < observations.length - 1) {
    const leftComp = compareAsc(times[index], observations[i].resultTime);
    const rightComp = compareAsc(times[index], observations[i + 1].resultTime);
    let matchingIndex = undefined;

    if (!leftComp || (leftComp > 0 && rightComp > 0)) {
      // times[index] equals observations[i].resultTime, or is greater than both observations[i].resultTime and observations[i + 1].resultTime
      matchingIndex = i;
    } else if (!rightComp) {
      // times[index] equals observations[i + 1].resultTime but is less than observations[i].resultTime
      matchingIndex = i + 1;
    } else if (rightComp > 0) {
      // observations[i + 1].resultTime < times[index] < observations[i].resultTime
      matchingIndex =
        i +
        closestIndexTo(times[index], [
          observations[i].resultTime,
          observations[i + 1].resultTime
        ]);
    }
    // matchingIndex may be zero, so don't do !matchingIndex
    if (matchingIndex !== undefined) {
      pushToDatastream(
        datastream,
        times[index],
        curLink,
        observations[matchingIndex]
      );
      index--;
    } else {
      i++; // times[index] is less than both
    }
  }

  if (index >= 0) {
    if (nextLink) {
      // if there is a next link to get more observations
      const url = datastream.closestUrlFromCache(times[index], nextLink);
      return axios
        .get(url)
        .then(res =>
          parseSensorData(
            res.data.value,
            res.data["@iot.nextLink"],
            datastream,
            index,
            times,
            url
          )
        );
    } else {
      // No more observations, try to match all the remaining time intervals with the last observation
      while (index >= 0) {
        if (
          !pushToDatastream(datastream, times[index], curLink, observations[i])
        ) {
          // Since times[index] was not in threshold, remaining entries in times won't be as well, so
          // fill datastream with undefined observations and break.
          datastream.observations.push(...Array(index).fill(undefined));
          break;
        }
        index--;
      }
    }
    return Promise.resolve();
  }
};

const pushToDatastream = (
  datastream,
  time,
  curLink,
  { result, resultTime }
) => {
  const diff = Math.abs(differenceInMinutes(time, resultTime));
  if (diff <= store.getters["timelapse/threshold"]) {
    datastream.observations.push({ result, resultTime });
    datastream.addToCache(resultTime, curLink); // curLink represents the URL of the page where this observation was obtained
    return true; // the observation was pushed
  } else {
    datastream.observations.push(undefined);
    return false; // couldn't push the observation
  }
};

const getSensorData = () => {
  const times = store.getters["timelapse/times"];
  const index = times.length - 1;
  const axiosArr = [];
  const datastreamArr = [];
  for (let sensor of sensors.values()) {
    // For each datastream of a sensor, get a URL to start off parsing observations from.
    axiosArr.push(
      ...sensor.datastreams.map(datastream => {
        datastream.observations = [];
        datastreamArr.push(datastream); // will help us keep track of which URL corresponds to which datastream object when the axios request completes.
        // Check if the cache has a URL corresponding to a date >= the last date in the time intervals array
        const url = datastream.closestUrlFromCache(times[times.length - 1]);
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
            index,
            times,
            res.config.url
          )
        )
      )
    );
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
          warningText:
            "We encountered an error while fetching sensor data. You may still use the map."
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

export {
  getPaintProperty,
  getSensorInformation,
  getSensorData,
  parseSensorInformation,
  sensorGeocoder,
  sensors
};
