<template>
  <v-alert :value="true" type="warning" :dismissible="true">
    {{ text }}
  </v-alert>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.v-alert {
  z-index: 3;
  border-radius: 3px;
  padding: 8px;
  border-style: none;
}
</style>
