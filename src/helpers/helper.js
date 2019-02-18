import axios from "axios";
import encodeUrl from "encodeurl";
import stringSimilarity from "string-similarity";
import { eventBus } from "../main";

const addGeocoder = (map, accessToken) => {
  const geocoder = new MapboxGeocoder({ accessToken, trackProximity: true });
  map.addControl(geocoder, "top-left");

  const marker = new mapboxgl.Marker({
    color: "crimson"
  });

  geocoder.on("result", ev => {
    marker.remove();
    const temp = ev.result.place_name.toLowerCase();
    const matches = temp.includes("sensor");
    if (!matches) {
      marker.setLngLat(ev.result.geometry.coordinates).addTo(map);
    } else {
      // ev.result is the entire GeoJSON for the selected sensor
      selectSensor(ev.result.id, ev.result.place_name, map, geocoder);
    }
  });
  geocoder.on("clear", () => {
    marker.remove();
    unselectSensor(map, geocoder);
  });
  // return the geocoder object so that a localGeocoder can be added later:
  return geocoder;
};

const sensorGeocoder = (query, sensorGeoJSON) => {
  const temp = query.toLowerCase();
  const matches = temp.includes("sensor");
  if (!matches) {
    return null;
  }
  return sensorGeoJSON.sort(
    (el1, el2) =>
      stringSimilarity.compareTwoStrings(temp, el2.properties.description) -
      stringSimilarity.compareTwoStrings(temp, el1.properties.description)
  );
};

const getPlaceName = name => `${name} Sensor, Chatham, GA`;
// Follows Carmen GeoJSON format:
const createGeoJSON = (id, coordinates, name, description, observation) => ({
  id,
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates
  },
  properties: {
    name,
    description,
    observation
  },
  place_name: getPlaceName(name),
  place_type: ["place"],
  center: coordinates
});

const parseSensorData = responses =>
  responses.map(el => {
    const location = el.data.Locations[0];
    const description = el.data.description.toLowerCase();
    const observation = el.data.Datastreams[0].Observations[0];
    const id = el.data["@iot.id"];

    return createGeoJSON(
      id,
      location.location.coordinates,
      location.name,
      description,
      observation || {
        resultTime: "N/A",
        result: "No reading"
      }
    );
  });

const onSensorInteraction = (map, geocoder) => {
  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  map.on("mouseenter", "outer_point", e => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";
    const coordinates = e.features[0].geometry.coordinates.slice();
    const { name, observation } = e.features[0].properties;
    const reading = JSON.parse(observation);
    // Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
    // the popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    const d = new Date(reading.resultTime)
    const date_string = d ? d.toUTCString() : "N/A"

    let html = `
        <h4>${name} Sensor</h4>
        <div>Reading: ${reading.result}</div>
        <div>Time: ${date_string}</div>
        `;

    if (reading.result == "No reading") {
        html = `
          <h4>${name} Sensor</h4>
          <div>Sea Level: ${reading.result}</div>
          <div>Last Measured At: ${reading.resultTime}</div>
          `;
    }

    // Populate the popup and set its coordinates.
    popup
      .setLngLat(coordinates)
      .setHTML(html)
      .addTo(map);
  });

  map.on("mouseleave", "outer_point", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

  map.on("click", "outer_point", function(e) {
    popup.remove();
    // Beware that this isn't the entire sensor GeoJSON but a simpler representation of it returned as part of the event object
    const sensor = e.features[0];
    const select = sensor.layer.paint["circle-color"][1][2] !== sensor.id;

    if (select) {
      const place_name = getPlaceName(sensor.properties.name);
      selectSensor(sensor.id, place_name, map, geocoder);
    } else {
      unselectSensor(map, geocoder);
    }
  });
};

// Assumes that no sensor has an id of -99
const getPaintProperty = (id = -99) => [
  "case",
  ["==", ["id"], id],
  "#008000",
  "#007cbf"
];

const selectSensor = (id, place_name, map, geocoder) => {
  const paintProperty = getPaintProperty(id);
  eventBus.$emit("sensor-clicked", true, id);
  geocoder.setInput(place_name);
  map.setPaintProperty("outer_point", "circle-color", paintProperty);
  map.setPaintProperty("inner_point", "circle-color", paintProperty);
};

const unselectSensor = (map, geocoder) => {
  const paintProperty = getPaintProperty();
  eventBus.$emit("sensor-clicked", false);
  geocoder.setInput("");
  map.setPaintProperty("outer_point", "circle-color", paintProperty);
  map.setPaintProperty("inner_point", "circle-color", paintProperty);
};

const getSensorData = () => {
  // URL to get ids of all Things:
  const thingsUrl =
    "https://api.sealevelsensors.org/v1.0/Things?$select=@iot.id";
  // URL to get the 'Water Level' Datastream and Location data of a particular Thing; we expand the Datastream Observation to obtain the latest reading ('result') using certain query parameters.
  const liveDataUrl = id =>
    encodeUrl(
      `https://api.sealevelsensors.org/v1.0/Things(${id})?
  $expand=Datastreams($filter=name eq 'Water Level';
  $expand=Observations($select=resultTime,result;$orderBy=resultTime desc;$top=1)),
  Locations($select=name,location)`
    );

  return axios.get(thingsUrl).then(response => {
    const urlArr = response.data.value.map(el => liveDataUrl(el["@iot.id"]));
    const axiosArr = urlArr.map(el => axios.get(el));
    return axios.all(axiosArr);
  });
};

const addSensorLayer = (map, sensorGeoJSON) => {
  const framesPerSecond = 15;
  const initialOpacity = 1;
  const initialRadius = 8;
  const maxRadius = 17;

  let radius = initialRadius;
  let opacity = initialOpacity;

  map.addSource("outer_point", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: sensorGeoJSON
    }
  });

  map.addLayer({
    id: "outer_point",
    source: "outer_point",
    type: "circle",
    paint: {
      "circle-radius": initialRadius,
      "circle-radius-transition": { duration: 0 },
      "circle-opacity-transition": { duration: 0 },
      "circle-color": getPaintProperty()
    }
  });
  map.addLayer({
    id: "inner_point",
    source: "outer_point",
    type: "circle",
    paint: {
      "circle-radius": initialRadius,
      "circle-color": getPaintProperty()
    }
  });

  function animateMarker() {
    setTimeout(() => {
      requestAnimationFrame(animateMarker);
      radius += (maxRadius - radius) / framesPerSecond;
      opacity -= 0.9 / framesPerSecond;
      if (opacity <= 0) {
        radius = initialRadius;
        opacity = initialOpacity;
      }
      map.setPaintProperty("outer_point", "circle-radius", radius);
      map.setPaintProperty("outer_point", "circle-opacity", opacity);
    }, 1000 / framesPerSecond);
  }
  animateMarker(0);
};

export {
  addGeocoder,
  getSensorData,
  parseSensorData,
  sensorGeocoder,
  addSensorLayer,
  onSensorInteraction
};
