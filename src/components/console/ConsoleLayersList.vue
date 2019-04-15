<template>
  <console-card heading="MAP LAYERS">
    <ul>
      <ConsoleLayersListItem
        v-for="(layer, index) in layers"
        :key="index"
        :layer="layer"
        @toggleLayers="toggleLayers(index)"
      />
    </ul>
  </console-card>
</template>

<script>
import { mapState } from "vuex";
import ConsoleCard from "./ConsoleCard";
import ConsoleLayersListItem from "./ConsoleLayersListItem";

export default {
  components: { ConsoleCard, ConsoleLayersListItem },
  computed: {
    ...mapState("cons", ["layers"])
  },
  methods: {
    toggleLayers(index) {
      this.$store.commit("cons/toggleLayers", { index });
      this.$store.commit("app/layerSelected", { layerSelected: index });
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0px;
}
</style>
