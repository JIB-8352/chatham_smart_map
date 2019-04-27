<template>
  <div
    class="chart-container"
    @mouseover="userControls = true"
    @mouseout="userControls = false"
  >
    <highcharts
      :options="chartOptions"
      :callback="chartLoaded"
      :constructor-type="'stockChart'"
    ></highcharts>
  </div>
</template>

<script>
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import stockInit from "highcharts/modules/stock";
import {
  removeCrosshair,
  addCrosshair,
  tooltipFormatter,
  labelsFormatter
} from "@/helpers/chart-helper";

stockInit(Highcharts);
export default {
  components: {
    highcharts: Chart
  },
  props: {
    name: {
      type: String,
      required: false,
      default: ""
    },
    color: {
      type: String,
      required: false,
      default: ""
    },
    unitHtml: {
      type: String,
      required: false,
      default: ""
    },
    chartData: {
      type: Array,
      required: false,
      default: () => []
    },
    plotLines: {
      type: Array,
      required: false,
      default: () => []
    },
    lookupArray: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      index: undefined,
      userControls: false
    };
  },
  methods: {
    checkAndAddCrosshair(chart) {
      const newIndex = this.lookupArray[this.$store.state.timelapse.sliderVal];
      if (newIndex !== undefined) {
        this.index = addCrosshair(chart, newIndex);
        return true;
      }
      return false;
    },
    checkAndRemoveCrosshair(chart) {
      if (this.index !== undefined) {
        removeCrosshair(chart, this.index);
        this.index = undefined;
      }
    },
    chartLoaded(chart) {
      this.$store.watch(
        ({ timelapse }) => timelapse.sliderVal,
        // eslint-disable-next-line no-unused-vars
        _ => {
          if (!chart.series || !this.chartData.length || this.userControls) {
            return;
          }
          this.checkAndRemoveCrosshair(chart);
          this.checkAndAddCrosshair(chart);
        }
      );
      this.$store.watch(
        ({ timelapse }) => timelapse.isPlaying,
        isPlaying => {
          if (!chart.series || !this.chartData.length) {
            return;
          }
          if (!isPlaying) {
            this.checkAndRemoveCrosshair(chart);
          } else {
            this.checkAndAddCrosshair(chart);
          }
        }
      );
      this.$watch("chartData", chartData => {
        if (!chart.series || !chartData.length) {
          chart.tooltip.hide();
          this.index = undefined;
          return;
        }
        if (this.index !== undefined && !this.checkAndAddCrosshair(chart)) {
          this.index = undefined;
        }
      });
    }
  },
  computed: {
    title() {
      if (this.$store.state.app.updatingData) {
        return "Loading chart data...";
      }
      return this.chartData.length
        ? `${this.name} Data`
        : `No ${this.name} data available in selected time interval`;
    },
    chartOptions() {
      return {
        rangeSelector: {
          enabled: false
        },
        navigator: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        },
        time: {
          useUTC: false
        },
        title: {
          text: this.title,
          style: { fontSize: "14px" }
        },
        chart: {
          height: "65%"
        },
        xAxis: {
          crosshair: true,
          type: "datetime",
          labels: {
            formatter: function() {
              return labelsFormatter(this);
            },
            style: {
              "font-size": "10px"
            }
          }
        },
        yAxis: {
          title: {
            text: null
          },
          labels: {
            align: "right",
            x: 0,
            y: -2,
            format: `{value}${this.unitHtml}`,
            useHTML: true
          },
          plotLines: this.plotLines
        },
        tooltip: {
          split: false,
          useHTML: true,
          padding: 0,
          formatter: function() {
            return tooltipFormatter(this);
          }
        },
        legend: {
          enabled: false
        },
        series: [{ data: this.chartData }],
        plotOptions: {
          series: {
            color: this.color,
            name: this.name,
            dataGrouping: {
              groupPixelWidth: 4
            },
            marker: {
              enabledThreshold: 5,
              symbol: "circle"
            }
          }
        }
      };
    }
  }
};
</script>

<style scoped>
div.chart-container {
  margin: 0px;
}
</style>
