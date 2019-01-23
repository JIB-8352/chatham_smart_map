<template>
    <div id='console'>
        <div style='height: 48px;'> </div>
        <LayerSelectionIndex></LayerSelectionIndex>
        <div style='height: 6px;'> </div>
        <MapLegend></MapLegend>
	</div>
</template>

<script>

import LayerSelectionIndex from './LayerSelectionIndex.vue';
import MapLegend from './MapLegend.vue';

export default {
	name: 'Console',
	components: {
        LayerSelectionIndex,
        MapLegend
    }
}

</script>

<style scoped>

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