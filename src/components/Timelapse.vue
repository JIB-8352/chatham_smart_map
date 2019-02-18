<template>
  <div id = "timelape">
    <PlayButton v-if = "timelapseMode" />
    <TimelapseBar v-if = "timelapseMode" />
  </div>
</template>

<script>
import TimelapseBar from "./TimelapseBar"
import PlayButton from "./PlayButton"

export default {
  data () {
    return {
      timelapseMode: true //whether or not the map is in timelapse mode
    }
  },
  components: {
    TimelapseBar,
    PlayButton
  }
}
</script>