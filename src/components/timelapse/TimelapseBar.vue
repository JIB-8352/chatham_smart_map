<template>
  <v-slider
    v-model="sliderVal"
    :tick-labels="tickLabels"
    :max="maxVal"
    step="1"
    ticks="always"
    tick-size="3"
    color="grey"
    always-dirty
    :thumb-label="thumbLabel"
  >
    <template v-slot:thumb-label="props">
      <span>
        {{ getThumbLabel(sliderVal) }}
      </span>
    </template>
  </v-slider>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data: () => ({
    interval: null
  }),
  methods: {
    getThumbLabel(sliderVal) {
      return this.$store.getters["timelapse/getThumbLabel"](sliderVal);
    },
    advanceTimelapse() {
      // This code gets executed every second when the timelapse is playing.
      /* Parts of the app listen to changes in sliderVal to make UI changes or are automatically 
        updated since they are reactive and depend on sliderVal (like PopupContent). */
      if (this.sliderVal === this.maxVal) {
        this.$store.commit("timelapse/setSliderVal", { sliderVal: 0 });
      } else {
        this.$store.commit("timelapse/setSliderVal", {
          sliderVal: this.sliderVal + 1
        });
      }
    }
  },
  computed: {
    sliderVal: {
      // a computed v-model property requires a getter and a setter
      get() {
        return this.$store.state.timelapse.sliderVal;
      },
      set(sliderVal) {
        this.$store.commit("timelapse/setSliderVal", { sliderVal });
      }
    },
    ...mapState("timelapse", ["thumbLabel"]),
    ...mapGetters("timelapse", ["tickLabels", "maxVal"])
  },
  created() {
    this.$store.watch(
      ({ timelapse }) => timelapse.isPlaying,
      isPlaying => {
        if (isPlaying) {
          this.interval = setInterval(this.advanceTimelapse, 1000);
          this.$store.commit("timelapse/setThumbLabel", {
            thumbLabel: "always"
          });
        } else {
          clearInterval(this.interval);
          this.$store.commit("timelapse/setThumbLabel", { thumbLabel: true });
        }
      }
    );
  },
  mounted: () => {
    // Create an arrow below the v-slider thumb label
    const node = document.createElement("div");
    node.className = "arrow-down";
    document
      .getElementsByClassName("v-slider__thumb-label__container")[0]
      .appendChild(node);
  }
};
</script>

<style scoped>
.v-input--slider {
  margin-top: 25px;
  margin-left: 10px;
  flex-grow: 1;
}
</style>
