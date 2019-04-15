<template>
  <div id="timelapse">
    <DatePicker />
    <PlayButton />
    <TimelapseBar />
  </div>
</template>

<script>
import DatePicker from "./DatePicker";
import PlayButton from "./PlayButton";
import TimelapseBar from "./TimelapseBar";

export default {
  components: {
    DatePicker,
    PlayButton,
    TimelapseBar
  }
};
</script>

<style scoped>
#timelapse {
  position: absolute;
  display: flex;
  bottom: 10px;
  left: 0px;
  margin: 10px;
  right: 80px;
  align-items: center;
}
</style>
