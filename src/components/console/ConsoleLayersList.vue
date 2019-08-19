<template>
  <console-card heading="MAP LAYERS">
    <ul>
      <!-- We receive the toggleLayers event from ConsoleLayersListItem, then call this component's
        toggleLayers(index) with the index parameter to determine which ConsoleLayersListItem was
        clicked -->
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
      // hack! display but disable 'Inundation' layer
      if (index === 0) {
        this.$store.commit("cons/toggleLayers", { index });
        this.$store.commit("app/layerSelected", { layerSelected: index });
      }
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
