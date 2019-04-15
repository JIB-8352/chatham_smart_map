<template>
  <li
    :style="{ color: layer.selected ? layer.color : 'black' }"
    @click="$emit('toggleLayers')"
  >
    <i class="material-icons">{{ layer.icon }}</i>
    <div>
      <h2>{{ layer.name }}</h2>
      <small>{{ layer.description }}</small>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    layer: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
li {
  margin-bottom: 5px;
  cursor: pointer;
}

li > * {
  display: inline-block;
  vertical-align: text-top;
}

li > div {
  margin-left: 5px;
}

h2 {
  font-size: 15px;
  line-height: 18px;
  margin: 1.4px;
}

small {
  font-size: 13px;
  line-height: 18px;
  color: #a9a9a9;
}
</style>
