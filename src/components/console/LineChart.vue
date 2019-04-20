<template>
  <highcharts :options="chartOptions" :callback="chartLoaded"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";
import { format } from "date-fns";
import { removeCrosshair, addCrosshair } from "@/helpers/helper";

export default {
  components: {
    highcharts: Chart
  },
  props: {
    title: {
      type: String,
      required: true
    },
    unitHtml: {
      type: String,
      required: false,
      default: ""
    },
    series: {
      type: Array,
      required: false,
      default: () => []
    },
    plotLines: {
      type: Array,
      required: false,
      default: () => []
    },
    dataMapping: {
      type: Array,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      index: undefined,
      movingLine: []
    };
  },
  methods: {
    chartLoaded(chart) {
      this.$store.watch(
        ({ timelapse }) => timelapse.sliderVal,
        sliderVal => {
          if (!chart.series || !this.series.length) {
            return;
          }
          if (this.index) {
            this.movingLine = removeCrosshair(chart, this.index);
            this.index = undefined;
          }
          const newIndex = this.dataMapping[sliderVal];
          if (newIndex) {
            this.movingLine = addCrosshair(chart, newIndex);
            this.index = newIndex;
          }
        }
      );
      this.$store.watch(
        ({ timelapse }) => timelapse.isPlaying,
        isPlaying => {
          if (!chart.series || !this.series.length) {
            return;
          }
          if (!isPlaying) {
            if (this.index) {
              this.movingLine = removeCrosshair(chart, this.index);
            }
          } else {
            const newIndex = this.dataMapping[
              this.$store.state.timelapse.sliderVal
            ];
            if (newIndex) {
              this.movingLine = addCrosshair(chart, newIndex);
              this.index = newIndex;
            }
          }
        }
      );
      this.$watch("series", series => {
        if (!chart.series || !series.length) {
          chart.tooltip.hide();
          this.index = undefined;
          this.movingLine = [];
          return;
        }
        if (this.index) {
          const newIndex = this.dataMapping[
            this.$store.state.timelapse.sliderVal
          ];
          if (newIndex) {
            this.movingLine = addCrosshair(chart, newIndex);
            this.index = newIndex;
          }
        }
      });
    }
  },
  computed: {
    chartOptions() {
      return {
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
              if (this.isFirst || this.isLast) {
                return format(this.value, "MMM D h:mm a");
              }
            }
          },
          plotLines: this.movingLine
        },
        yAxis: {
          title: {
            text: null
          },
          labels: {
            align: "left",
            x: 0,
            y: -2,
            format: `{value}${this.unitHtml}`,
            useHTML: true
          },
          plotLines: this.plotLines
        },
        tooltip: {
          xDateFormat: "%a, %b %e, %l:%M %P"
        },
        legend: {
          enabled: false
        },
        series: this.series,
        plotOptions: {
          series: {
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
div[data-highcharts-chart] {
  margin: 0px;
}
</style>
