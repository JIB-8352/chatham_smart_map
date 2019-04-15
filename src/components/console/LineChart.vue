<template>
  <highcharts :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";

export default {
  components: {
    highcharts: Chart
  },
  props: {
    title: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  computed: {
    chartOptions() {
      return {
        title: {
          text: `${this.title} Data`
        },
        xAxis: {
          type: "datetime"
        },
        yAxis: {
          title: {
            text: this.title
          }
        },
        legend: {
          enabled: false
        },
        series: [
          {
            data: this.data,
            color: this.color
          }
        ]
      };
    }
  }
};
</script>
