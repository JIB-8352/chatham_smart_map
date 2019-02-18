<template>
  <div id = "bar">
    <v-slider
      v-model="sliderVal"
      :tick-labels="ticksLabels"
      :max="12"
      step="1"
      ticks="always"
      tick-size="3"
      color='teal'
      always-dirty
    ></v-slider>
  </div>
</template>

<script>
import { eventBus } from "../main";
export default {
  data () {
    return {
      sliderVal: 0,
      ticksLabels: [
        '12 am',
        '2 am',
        '4 am',
        '6 am',
        '8 am',
        '10 am',
        '12 pm',
        '2 pm',
        '4 pm',
        '6 pm',
        '8 pm',
        '10 pm',
        '12 am'
      ]
    }
  },

  created() {
    eventBus.$on("timelapse-pulse", () => { //on the timelapse pulse, advance the slider
      if(this.sliderVal < 12) {
        this.sliderVal++
      } else {
        this.sliderVal = 0 //restart the timelapse after two seconds
      }
    })
  }
}
</script>

<style scoped>
#bar {
  position: fixed;
  bottom: 10px;
  right: 100px;
  width: 1000px;
  margin: 10px;
  padding: 8px 8px;
  border-radius: 3px;
  z-index: 0;
}
</style>