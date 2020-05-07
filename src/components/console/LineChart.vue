<template>
  <!-- Since we can't add mouseover and mouseout events to <highcharts />, add them to a container div -->
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

// Use Highstock to automatically perform data grouping; useful when chartData.length is large
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
    // Currently used to show the danger line on the water level charts
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
  data: () => ({
    index: undefined, // index of data point currently having a crosshair
    userControls: false // whether or not the user currently controls the position of the crosshair
  }),
  methods: {
    checkAndAddCrosshair(chart) {
      /* Use the lookupArray to find the index of the data point corresponding to the current
        sliderVal. If this index is undefined, we cannot add a crosshair. */
      const newIndex = this.lookupArray[this.$store.state.timelapse.sliderVal];
      if (newIndex !== undefined) {
        // newIndex maybe 0, so don't refactor the predicate to if (newIndex)
        /* Since data points maybe sometimes grouped, we can't just set this.index = newIndex.
          The logic of adding the crosshair and figuring out the grouped data index from newIndex
          is handled by addCrosshair method. */
        this.index = addCrosshair(chart, newIndex);
        return true; // a crosshair was added
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
        () => {
          /* If the chart wasn't initialized with its series yet, or there is no data, or 
            if the user is controlling the crosshair position, do nothing. */
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
            // crosshair should disappear when isPlaying changes to false
            this.checkAndRemoveCrosshair(chart);
          } else {
            /* crosshair should appear when isPlaying changes to true; though the position of the 
              crosshair will soon change after 1 second (since the timelapse is playing), we want to 
              show the crosshair for the time the timelapse started at. */
            this.checkAndAddCrosshair(chart);
          }
        }
      );
      this.$watch("chartData", chartData => {
        /* If a user clicks on another sensor, chartData will change and the chart object will 
          refer to the new chart. */
        if (!chart.series || !chartData.length) {
          /* Hide the tooltip, which takes care of hiding other elements of the crosshair like the
           halo point, when the new chart has no data to display. */
          chart.tooltip.hide();
          this.index = undefined;
          return;
        }
        /* If a crosshair was showing on the old chart and corresponding to the same sliderVal a
          crosshair can be shown on the new chart, add it. */
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
        /* Disable some default features of a Highstock chart - we neither have space for them nor 
          require them. */
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
          height:
            "65%" /* height is 65% of the width - it's a weird aspect ratio but we want to make
            sure that the first chart (of water level) is always visible in its entirety on even low
            resolution screens */
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
            useHTML: true // since unitHtml is a decimal corresponding to a UTF-8 symbol
          },
          plotLines: this.plotLines
        },
        tooltip: {
          split: false, // we don't want the Highstock split tooltip
          useHTML: true, // allows us to have finer control over the tooltip UI
          padding: 0,
          formatter: function() {
            return tooltipFormatter(this);
          }
        },
        legend: {
          enabled: false // saves horizontal space
        },
        series: [{ data: this.chartData }],
        plotOptions: {
          series: {
            color: this.color,
            name: this.name,
            dataGrouping: {
              groupPixelWidth: 4 // change this value to control how close together data groups can be
            },
            marker: {
              enabledThreshold: 5, // when data is sparse, we want to display points on the line chart
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
/* Make as much horizontal space as possible for the charts */
div.chart-container {
  margin: 0px;
}
</style>
