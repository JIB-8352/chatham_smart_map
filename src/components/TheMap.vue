<template>
  <mapbox
    :access-token="accessToken"
    :map-options="mapOptions"
    :nav-control="navControl"
    :geolocate-control="geoControl"
    @map-load="mapLoaded"
    @map-error="mapError"
    @geolocate-error="geolocateError"
  >
  </mapbox>
</template>

<script>
import Mapbox from "mapbox-gl-vue";

import {
  getSensorInformation,
  getSensorData,
  parseSensorInformation,
  sensorGeocoder
} from "@/helpers/helper";

import {
  addSensorInteractions,
  addGeocoder,
  addSensorLayer
} from "@/helpers/map-helper";

export default {
  components: {
    Mapbox
  },
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoicGNoYXdsYTgiLCJhIjoiY2pvb2IxeHhjMGFpbzNwcXJzbjkxenphbCJ9.PLLJazTRjDbljE9IniyWpg",
      mapOptions: {
        container: "map",
        style: "mapbox://styles/mapbox/streets-v10",
        center: { lon: -81.2, lat: 32 },
        zoom: 9.6,
        hash: true
      },
      navControl: {
        show: true,
        position: "bottom-right"
      },
      geoControl: {
        show: true,
        position: "bottom-right"
      }
    };
  },
  methods: {
    mapLoaded(map) {
      // Expose the map object to window so that Cypress can use it.
      window.map = map;
      this.$store.commit("app/showConsole");

      const geocoder = addGeocoder(map, this.accessToken);

      getSensorInformation()
        .then(responses => {
          const sensorGeoJSON = parseSensorInformation(responses.data.value);
          addSensorLayer(map, sensorGeoJSON);
          geocoder.options.localGeocoder = query =>
            sensorGeocoder(query, sensorGeoJSON);
          addSensorInteractions(map, geocoder);

          return getSensorData().finally(() => {
            this.$store.commit("app/updatingData", {
              updatingData: false
            });
          });
        })
        .catch(() => {
          // This will catch ALL errors
          this.$store.commit("app/showWarning", {
            warningText:
              "We encountered an error while fetching sensor data. You may still use the map."
          });
        })
        .finally(() => {
          this.$store.commit("app/stopLoading");
        });
    },
    mapError() {
      this.$store.commit("app/stopLoading");
      this.$store.commit("app/mapError");
    },
    geolocateError() {
      this.$store.commit("app/showWarning", {
        warningText: "We can't seem to locate you right now."
      });
    }
  }
};
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
