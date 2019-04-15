<template>
  <v-progress-circular
    :size="50"
    color="#007cbf"
    indeterminate
  ></v-progress-circular>
</template>

<style scoped>
.v-progress-circular {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 2;
}
</style>
