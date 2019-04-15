<template>
  <div id="console">
    <div style="min-height: 48px;"></div>
    <ConsoleLayersList />
    <div style="min-height: 6px;"></div>
    <ConsoleLegend />
    <div style="min-height: 6px;"></div>
    <InformationCard :sensor="sensor" v-if="sensor" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import ConsoleLayersList from "./ConsoleLayersList";
import ConsoleLegend from "./ConsoleLegend";
import InformationCard from "./InformationCard";

export default {
  components: {
    ConsoleLayersList,
    ConsoleLegend,
    InformationCard
  },
  computed: {
    ...mapState("cons", ["sensor"])
  }
};
</script>

<style scoped>
#console {
  position: absolute;
  width: 325px;
  margin: 10px;
  padding: 8px 8px;
  background-color: rgb(225, 225, 225);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-radius: 3px;
  z-index: 0;
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 110px);
}
</style>
