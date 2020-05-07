<template>
  <v-btn color="white" @click="toggleIsPlaying" :disabled="updatingData">
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
    ...mapState("timelapse", ["isPlaying"]),
    ...mapState("app", ["updatingData"])
  }
};
</script>

<style scoped>
/* Override some properties of v-btn */
.v-btn {
  min-width: 0px;
  height: 40px;
  width: 40px;
  border-radius: 3px;
  padding: 0px;
  margin-left: 25px;
}

.theme--light.v-btn.v-btn--disabled:not(.v-btn--icon):not(.v-btn--flat):not(.v-btn--outline) {
  background-color: #ccc !important;
}
</style>
