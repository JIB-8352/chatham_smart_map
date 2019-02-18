<template>
  <div id = "button">
    <v-btn
      color='teal'
      dark
      depressed
      fab
      @click="toggle"
    >
      <v-icon 
        v-if="isPlaying"
        large
      >pause</v-icon>
      <v-icon
        v-else
        large
      >play_arrow</v-icon>
    </v-btn>
  </div>
</template>
<script>
import { eventBus } from "../main";
export default {
  data () {
    return {
      isPlaying: false
    }
  },

  methods: {
    toggle () {
      this.isPlaying = !this.isPlaying
      isPlaying = this.isPlaying
    }
  },

  created () {
    setInterval(function(){
      if(isPlaying) { //if the play button has been hit, emit the timelapse pulse every second
        eventBus.$emit("timelapse-pulse")
      }
    }, 1000);
  }
}
var isPlaying = false
</script>
<style scoped>
#button {
  position: fixed;
  bottom: 20px;
  right: 1120px;
  margin: 10px;
  padding: 8px 8px;
  border-radius: 3px;
  z-index: 0;
}
</style>
