<template>
  <console-card scrollable :heading="sensor.name.toUpperCase()">
    <PopupContent :sensor="sensor" />
    <LineChart
      v-for="(datastream, index) in chartDatastreams"
      :key="index"
      :title="datastream.name"
      :color="datastream.color"
      :data="datastream.data"
    />
  </console-card>
</template>

<script>
import ConsoleCard from "./ConsoleCard";
import PopupContent from "@/components/PopupContent";
import LineChart from "./LineChart";

export default {
  components: {
    ConsoleCard,
    PopupContent,
    LineChart
  },
  props: {
    sensor: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartDatastreams() {
      const datastreams = this.sensor.chartDatastreams;
      const waterlevelIndex = datastreams.findIndex(
        datastream => datastream.name === "Water Level"
      );
      const el = datastreams.splice(waterlevelIndex, 1);
      datastreams.unshift(el[0]); // ensure that water level is the first graph
      return datastreams;
    }
  }
};
</script>
