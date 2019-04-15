<template>
  <console-card heading="MAP LEGEND">
    <div class="legend_row" v-for="(layer, index) in layers" :key="index">
      <span
        :style="{ display: layer.legend_displayed ? 'block' : 'none' }"
        v-html="layer.legend_html"
      ></span>
    </div>
  </console-card>
</template>

<script>
import { mapState } from "vuex";
import ConsoleCard from "./ConsoleCard";

export default {
  components: { ConsoleCard },
  computed: {
    ...mapState("cons", ["layers"])
  }
};
</script>

<style scoped>
.legend_row >>> .label {
  display: inline-block;
  text-align: center;
}

.legend_row >>> .third {
  width: 32%;
}

.legend_row >>> #sensor {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #007cbf;
  opacity: 0.8;
  margin-right: 6px;
}

.legend_row >>> .colors {
  height: 12px;
  background: linear-gradient(
    to right,
    turquoise,
    deepskyblue,
    dodgerblue,
    navy
  );
}
</style>
