import axios from "axios";
import encodeUrl from "encodeurl";
import stringSimilarity from "string-similarity";

const addGeocoder = (map, accessToken) => {
  const geocoder = new MapboxGeocoder({ accessToken, trackProximity: true });
  map.addControl(geocoder, "top-left");

  const marker = new mapboxgl.Marker({
    color: "crimson"
  });
  geocoder.on("result", ev => {
    marker.remove();
    marker.setLngLat(ev.result.geometry.coordinates).addTo(map);
  });
  geocoder.on("clear", () => {
    marker.remove();
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

// Follows Carmen GeoJSON format:
const createGeoJSON = (coordinates, name, description, observation) => ({
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
  place_name: `${name} Sensor, Chatham, GA`,
  place_type: ["place"],
  center: coordinates
});

const parseSensorData = responses =>
  responses.map(el => {
    const location = el.data.Locations[0];
    const description = el.data.description.toLowerCase();
    const observation = el.data.Datastreams[0].Observations[0];

    return createGeoJSON(
      location.location.coordinates,
      location.name,
      description,
      observation || {
        resultTime: "N/A",
        result: "No reading"
      }
    );
  });

const addPopupOnHover = map => {
  let timer;
  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  map.on("mouseenter", "inner_point", e => {
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

    const html = `
        <h4>${name} Sensor</h4>
        <div>Reading: ${reading.result}</div>
        <div>Time: ${date_string}</div>
        `;

    // Populate the popup and set its coordinates. Adds a slight delay to the popup.
    timer = setTimeout(() => {
      popup
        .setLngLat(coordinates)
        .setHTML(html)
        .addTo(map);
    }, 700);
  });

  map.on("mouseleave", "inner_point", () => {
    clearTimeout(timer);
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
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
  const initialRadius = 6;
  const maxRadius = 15;

  let radius = initialRadius;
  let opacity = initialOpacity;

  map.addSource("inner_point", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: sensorGeoJSON
    }
  });

  map.addLayer({
    id: "inner_point",
    source: "inner_point",
    type: "circle",
    paint: {
      "circle-radius": initialRadius,
      "circle-radius-transition": { duration: 0 },
      "circle-opacity-transition": { duration: 0 },
      "circle-color": "#007cbf"
    }
  });
  map.addLayer({
    id: "outer_point",
    source: "inner_point",
    type: "circle",
    paint: {
      "circle-radius": initialRadius,
      "circle-color": "#007cbf"
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
      map.setPaintProperty("inner_point", "circle-radius", radius);
      map.setPaintProperty("inner_point", "circle-opacity", opacity);
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
  addPopupOnHover
};
