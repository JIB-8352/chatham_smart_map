<template>
  <div id="app">
      <mapbox 
      access-token="pk.eyJ1IjoicGNoYXdsYTgiLCJhIjoiY2pvb2IxeHhjMGFpbzNwcXJzbjkxenphbCJ9.PLLJazTRjDbljE9IniyWpg"
      :map-options="{
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: {lon: -81.2, lat: 32},
        zoom: 9.6,
        hash: true
      }">
    </mapbox>
  </div>
</template>
<Console>
</Console>

<script>
import Mapbox from 'mapbox-gl-vue';
import Console from './components/Console.vue'

export default {
  name: 'app',
  components: {
    Mapbox, Console
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}
</style>
