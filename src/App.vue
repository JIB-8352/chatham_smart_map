<template>
  <div id="app">
    <mapbox
      :access-token="accessToken"
      :map-options="mapOptions"
      :nav-control="navControl"
      :geolocate-control="geoControl"
      @map-init="mapInitialized"
    >
    </mapbox>
    <Console></Console>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';
import Console from './components/Console.vue'

export default {
  name: "app",
  components: { 
    Mapbox,
    Console
   },
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoicGNoYXdsYTgiLCJhIjoiY2pvb2IxeHhjMGFpbzNwcXJzbjkxenphbCJ9.PLLJazTRjDbljE9IniyWpg",
      mapOptions: {
        container: "map",
        style: "mapbox://styles/mapbox/streets-v10",
        center: { lon: -81.2, lat: 32 },
        zoom: 9.6,
        hash: true
      },
      navControl: {
        show: true,
        position: 'bottom-right'
      },
      geoControl: {
        show: true,
        position: 'bottom-right'
      }
    };
  },
  methods: {
    mapInitialized(map) {
      const geocoder = new MapboxGeocoder({
        accessToken: this.accessToken
      });
      map.addControl(geocoder, "top-left");

      let marker;
      geocoder.on("result", function(ev) {
        if (marker) {
          marker.remove();
        }
        marker = new mapboxgl.Marker( {
          color: 'crimson'
        })
          .setLngLat(ev.result.geometry.coordinates)
          .addTo(map);
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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