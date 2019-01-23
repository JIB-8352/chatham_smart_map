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
    <console>
    </console>
  </div>
</template>


<script>
import Mapbox from 'mapbox-gl-vue';
import Console from './components/Console.vue';

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
#console {
  position: absolute;
  width: 270px;
  margin: 10px;
  padding: 8px 8px;
  background-color: rgb(225,225,225);
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  border-radius: 3px;
  z-index: 0;
}
</style>
