<template>
  <v-btn color="white" @click="toggleIsPlaying">
    <v-icon v-if="isPlaying">pause</v-icon>
    <v-icon v-else>play_arrow</v-icon>
  </v-btn>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations("timelapse", ["toggleIsPlaying"])
  },
  computed: {
    ...mapState("timelapse", ["isPlaying"])
  }
};
</script>
<style scoped>
.v-btn {
  min-width: 0px; /* had to override some properties of v-btn to make it square */
  height: 40px;
  width: 40px;
  border-radius: 3px;
  padding: 0px;
  margin-left: 25px;
}
</style>
