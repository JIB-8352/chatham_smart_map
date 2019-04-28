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
  addSensorLayer,
  addInundationLayer,
  updateSensorGeoJSON
} from "@/helpers/map-helper";

import {
  ACCESS_TOKEN,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  DATA_FETCH_ERROR_TEXT,
  GEOLOCATE_ERROR_TEXT
} from "@/helpers/constants";

export default {
  components: {
    Mapbox
  },
  data() {
    return {
      accessToken: ACCESS_TOKEN,
      mapOptions: {
        container: "map",
        style: "mapbox://styles/mapbox/streets-v10",
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
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
          /* The sensor GeoJSON can be created without fetching any observations. Once we have the
            GeoJSON, we can add the map layers and interactions we want to support. */
          const sensorGeoJSON = parseSensorInformation(responses.data.value);
          addSensorLayer(map, sensorGeoJSON);
          addInundationLayer(map);
          geocoder.options.localGeocoder = query =>
            sensorGeocoder(query, sensorGeoJSON);
          addSensorInteractions(map, geocoder);

          this.$store.watch(
            ({ timelapse }) => timelapse.sliderVal,
            () => {
              // We have to manually update the GeoJSON since currently, it's not a reactive Vue property.
              updateSensorGeoJSON(map);
            }
          );
          this.$store.watch(
            ({ app }) => app.updatingData,
            updatingData => {
              if (!updatingData) {
                /* We need to update the GeoJSON whenever we finish updating data for the selected
                  dates. sliderVal doesn't change when data has updated, so this watch is required. */
                updateSensorGeoJSON(map);
              }
            }
          );
          this.$store.watch(
            ({ app }) => app.layerSelected,
            layerSelected => {
              const visibilityStr = layerSelected === 1 ? "visible" : "none";
              map.setLayoutProperty(
                "inundation_heat",
                "visibility",
                visibilityStr
              );
            }
          );
          /* We can fetch observations now; return the Promise object so that any errors can be caught in the catch block. */
          return getSensorData().finally(() => {
            this.$store.commit("app/updatingData", {
              updatingData: false
            });
          });
        })
        .catch(() => {
          // This will catch ALL errors
          this.$store.commit("app/showWarning", {
            warningText: DATA_FETCH_ERROR_TEXT
          });
          /* We may optionally choose to set updatingData to false here to allow the user to interact
            with the timelapse components but there is no point since the initial data fetch failed. */
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
        warningText: GEOLOCATE_ERROR_TEXT
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
