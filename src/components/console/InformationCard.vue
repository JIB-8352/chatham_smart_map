<template>
  <console-card scrollable :heading="sensor.name.toUpperCase()">
    <PopupContent :sensor="sensor" />
    <LineChart
      v-for="({ name, color, data, unitHtml, lookupArray },
      index) in chartDatastreams"
      :key="index"
      :name="name"
      :color="color"
      :unitHtml="unitHtml"
      :chartData="data"
      :plotLines="sensor.plotLines[name]"
      :lookupArray="lookupArray"
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
