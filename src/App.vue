<template>
  <div id="app">
    <v-app>
      <TheProgressCircle v-if="loading" />
      <TheWarningAlert :text="warningText" v-if="showWarning" />
      <TheErrorModal :display="mapError" />
      <TheMap />
      <TheConsole v-if="mapLoaded" />
      <TheTimelapse v-if="mapLoaded" v-show="timelapseMode" />
    </v-app>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import TheConsole from "@/components/console/TheConsole";
import TheErrorModal from "@/components/TheErrorModal";
import TheMap from "@/components/TheMap";
import TheProgressCircle from "@/components/TheProgressCircle";
import TheWarningAlert from "@/components/TheWarningAlert";
import TheTimelapse from "@/components/timelapse/TheTimelapse";

export default {
  name: "app",
  components: {
    TheConsole,
    TheErrorModal,
    TheMap,
    TheProgressCircle,
    TheWarningAlert,
    TheTimelapse
  },
  computed: {
    ...mapState("app", [
      "loading",
      "mapError",
      "mapLoaded",
      "showWarning",
      "timelapseMode",
      "warningText"
    ]),
    ...mapGetters("app", ["timelapseMode"])
  }
};
</script>

<style>
#app {
  font-family: Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Override this property set by Vuetify */
p {
  margin-bottom: 0px;
  font-size: 14px;
}

/* Card popup for sensors */
.mapboxgl-popup-tip {
  border: 0px;
}

/* Pushes the popup away from sensor */
.mapboxgl-popup-anchor-bottom {
  top: -12px;
}

.mapboxgl-popup-anchor-top {
  top: 12px;
}

.mapboxgl-popup-anchor-right {
  left: -12px;
}

.mapboxgl-popup-anchor-left {
  left: 12px;
}

/* Override default CSS for search box */
.mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  margin: 20px 0 0 18px;
  width: 309px;
}

/* Override default CSS for text in search box */
.mapboxgl-ctrl-geocoder input[type="text"] {
  font-size: 13px;
  padding-left: 35px;
}

/* Override default CSS for popup */
.mapboxgl-popup {
  z-index: 1;
}

/* Override default CSS for slider's thumb label */
.v-slider__thumb-label {
  transform: translate(-70px, -18px);
  border-radius: 20px;
  z-index: 2;
  width: 145px !important;
}

/* Override default CSS for the span element containing the thumb label text */
.v-slider__thumb-label > span {
  transform: none;
}

/* CSS for the downward arrow located at the bottom of the thumb label */
.arrow-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  transform: translate(-5px, -18px);
  border-top: 5px solid #9e9e9e;
}

.v-slider {
  cursor: pointer;
}

.v-slider input {
  cursor: pointer;
}
</style>
