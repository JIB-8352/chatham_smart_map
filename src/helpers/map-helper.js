import store from "@/store";
import Vue from "vue";
import PopupContent from "@/components/PopupContent";
import {
  ACCESS_TOKEN,
  FPS,
  INITIAL_OPACITY,
  INITIAL_RADIUS,
  MAX_RADIUS,
  sensors
} from "@/helpers/constants";

export const addGeocoder = map => {
  const geocoder = new MapboxGeocoder({
    accessToken: ACCESS_TOKEN,
    trackProximity: true
  });
  map.addControl(geocoder, "top-left");

  const marker = new mapboxgl.Marker({
    color: "crimson"
  });

  geocoder.on("result", ev => {
    marker.remove(); // remove any previously added marker
    unselectSensor(map); // unselect any previously selected sensor
    // check if the result is a sensor:
    if (sensors.has(ev.result.id)) {
      // ev.result is the entire GeoJSON for the selected sensor
      selectSensor(ev.result.id, map, geocoder);
    } else {
      // if not, just add a marker to that place
      marker.setLngLat(ev.result.geometry.coordinates).addTo(map);
    }
  });
  geocoder.on("clear", () => {
    // the text in the geocoder will be removed implicitly here
    marker.remove();
    unselectSensor(map);
  });
  // return the geocoder object so that a localGeocoder can be added later:
  return geocoder;
};

export const addSensorInteractions = (map, geocoder) => {
  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  let vuePopup;

  map.on("mouseenter", "outer_point", e => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    const id = e.features[0].id;
    const sensor = sensors.get(id);
    const coordinates = sensor.coordinates;
    const name = sensor.name;
    // Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
    // the popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const html = `
        <h4>${name}</h4>
        <div id="vue-popup-content"></div>
        `;
    // Populate the popup and set its coordinates.
    popup
      .setLngLat(coordinates)
      .setHTML(html)
      .addTo(map);
    // this allows the popup to be a reactive Vue component
    vuePopup = new Vue({
      render: h => h(PopupContent, { props: { sensor } })
    }).$mount("#vue-popup-content");
  });

  map.on("mouseleave", "outer_point", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
    vuePopup.$destroy(); // destroy the Vue object since the popup isn't visible anymore
  });

  map.on("click", "outer_point", e => {
    popup.remove();
    // Beware that this isn't the entire sensor GeoJSON but a simpler representation of it returned as part of the event object
    const sensorFeature = e.features[0];
    // Check if this sensor is currently unselected
    const select =
      sensorFeature.layer.paint["circle-color"][1][2] !== sensorFeature.id;

    if (select) {
      const marker = document.getElementsByClassName("mapboxgl-marker")[0];
      if (marker) {
        // if a marker exists on the map, remove it before selecting the sensor
        marker.parentNode.removeChild(marker);
      }
      selectSensor(sensorFeature.id, map, geocoder);
    } else {
      // clear the text in the geocoder explicitly when a sensor is unselected via click
      unselectSensor(map);
      clearGeocoder(geocoder);
    }
  });
};

/* Assumes that no sensor has an id of -99. This is a Mapbox filter that gives a green color
  to features with the specified id and a blue color to all other features. Ensure that even
  when the sensor layer is first added, paint property follows this format so that detecting if
  a sensor has been selected or not becomes easier. */
const getPaintProperty = (id = -99) => [
  "case",
  ["==", ["id"], id],
  "#008000",
  "#007cbf"
];

const selectSensor = (id, map, geocoder) => {
  /* This method should not do anything if fetching sensor data failed. A way to check this is
    to see if the sensor layers were added or not. */
  if (!map.getLayer("outer_point") || !map.getLayer("inner_point")) {
    return;
  }
  const paintProperty = getPaintProperty(id);
  const sensor = sensors.get(id);
  store.commit("cons/setSensor", { sensor }); // select this sensor
  store.commit("app/sensorSelected", { sensorIsSelected: true });
  geocoder.setInput(sensor.placeName);
  map.setPaintProperty("outer_point", "circle-color", paintProperty);
  map.setPaintProperty("inner_point", "circle-color", paintProperty);
};

const unselectSensor = map => {
  /* This method should not do anything if fetching sensor data failed. A way to check this is
    to see if the sensor layers were added or not. */
  if (!map.getLayer("outer_point") || !map.getLayer("inner_point")) {
    return;
  }
  const paintProperty = getPaintProperty();
  store.commit("cons/setSensor", { undefined });
  store.commit("app/sensorSelected", { sensorIsSelected: false });
  map.setPaintProperty("outer_point", "circle-color", paintProperty);
  map.setPaintProperty("inner_point", "circle-color", paintProperty);
};

const clearGeocoder = geocoder => {
  // Remove any text and the cross icon from the geocoder search box
  document.getElementsByClassName(
    "geocoder-icon geocoder-icon-close"
  )[0].style.display = "none";
  geocoder.setInput("");
};

export const addSensorLayer = (map, sensorGeoJSON) => {
  let radius = INITIAL_RADIUS;
  let opacity = INITIAL_OPACITY;
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
      "circle-radius": INITIAL_RADIUS,
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
      "circle-radius": INITIAL_RADIUS,
      "circle-color": getPaintProperty()
    }
  });

  const animateMarker = () => {
    setTimeout(() => {
      requestAnimationFrame(animateMarker);
      radius += (MAX_RADIUS - radius) / FPS;
      opacity -= 0.9 / FPS;
      if (opacity <= 0) {
        radius = INITIAL_RADIUS;
        opacity = INITIAL_OPACITY;
      }
      map.setPaintProperty("outer_point", "circle-radius", radius);
      map.setPaintProperty("outer_point", "circle-opacity", opacity);
    }, 1000 / FPS);
  };
  animateMarker();
};

export const addInundationLayer = map => {
  map.addLayer({
    id: "inundation_heat",
    type: "heatmap",
    source: "outer_point",
    layout: {
      visibility: "none"
    },
    paint: {
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "inundation"],
        0,
        0,
        30,
        2
      ],
      "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0, 6, 1],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(33,102,172,0)",
        0.1,
        "#40E0D0",
        0.2,
        "#00BFFF",
        0.6,
        "#1E90FF",
        1,
        "#000080"
      ],
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 10, 22, 200],
      "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0.4, 22, 1]
    }
  });
};

export const updateSensorGeoJSON = map => {
  const updatedSensorGeoJSON = [];
  for (const sensor of sensors.values()) {
    updatedSensorGeoJSON.push(sensor.geoJSON);
  }
  map.getSource("outer_point").setData({
    type: "FeatureCollection",
    features: updatedSensorGeoJSON
  });
};
