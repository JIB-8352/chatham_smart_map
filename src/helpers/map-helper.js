import store from "@/store";
import Vue from "vue";
import { getPaintProperty, sensors } from "./helper";
import PopupContent from "@/components/PopupContent";

const addGeocoder = (map, accessToken) => {
  const geocoder = new MapboxGeocoder({ accessToken, trackProximity: true });
  map.addControl(geocoder, "top-left");

  const marker = new mapboxgl.Marker({
    color: "crimson"
  });

  geocoder.on("result", ev => {
    marker.remove();
    unselectSensor(map); // if a sensor is already selected
    if (sensors.has(ev.result.id)) {
      // ev.result is the entire GeoJSON for the selected sensor
      selectSensor(ev.result.id, map, geocoder);
    } else {
      marker.setLngLat(ev.result.geometry.coordinates).addTo(map);
    }
  });
  geocoder.on("clear", () => {
    marker.remove();
    unselectSensor(map);
  });
  // return the geocoder object so that a localGeocoder can be added later:
  return geocoder;
};

const addSensorInteractions = (map, geocoder) => {
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

    vuePopup = new Vue({
      render: h => h(PopupContent, { props: { sensor } })
    }).$mount("#vue-popup-content");
  });

  map.on("mouseleave", "outer_point", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
    vuePopup.$destroy();
  });

  map.on("click", "outer_point", e => {
    popup.remove();
    // Beware that this isn't the entire sensor GeoJSON but a simpler representation of it returned as part of the event object
    const sensorFeature = e.features[0];
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
      unselectSensor(map);
      clearGeocoder(geocoder);
    }
  });
};

const selectSensor = (id, map, geocoder) => {
  // Since this method can be called even when getting sensor data fails, check if the layers were added.
  if (!map.getLayer("outer_point") || !map.getLayer("inner_point")) {
    return;
  }
  const paintProperty = getPaintProperty(id);
  const sensor = sensors.get(id);
  store.commit("cons/setSensor", { sensor });
  store.commit("app/sensorSelected", { sensorIsSelected: true });
  geocoder.setInput(sensor.placeName);
  map.setPaintProperty("outer_point", "circle-color", paintProperty);
  map.setPaintProperty("inner_point", "circle-color", paintProperty);
};

const unselectSensor = map => {
  // Since this method can be called even when getting sensor data fails, check if the layers were added.
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
  document.getElementsByClassName(
    "geocoder-icon geocoder-icon-close"
  )[0].style.display = "none";
  geocoder.setInput("");
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

  const animateMarker = () => {
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
  };
  animateMarker();
};

export { addGeocoder, addSensorLayer, addSensorInteractions };
