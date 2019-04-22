<template>
  <console-card scrollable :heading="sensor.name.toUpperCase()">
    <PopupContent :sensor="sensor" />
    <LineChart
      v-for="({ title, series, unitHtml, plotLines, dataMapping },
      index) in chartDatastreams"
      :key="index"
      :title="title"
      :unitHtml="unitHtml"
      :series="series"
      :plotLines="plotLines"
      :dataMapping="dataMapping"
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
      return this.sensor.chartDatastreams;
    }
  }
};
</script>
