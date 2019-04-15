<template>
  <div>
    <p>Water Level: {{ waterLevelReading.result }}</p>
    <p>Last Measured: {{ waterLevelReading.resultTime }}</p>
  </div>
</template>

<script>
export default {
  props: {
    sensor: {
      type: Object,
      required: true
    }
  },
  computed: {
    waterLevelReading() {
      return this.sensor.waterLevelReading;
    }
  }
};
</script>
