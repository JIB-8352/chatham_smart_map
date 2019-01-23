<template>
    <div class='card'>
        <h2 class='card_heading'>MAP LAYERS</h2>

        <ul id='layers_list'>
            <li id='layer_default' data-color='steelblue' v-on:click="changeColors('layer_default', 'steelblue')">
                <i class='material-icons'>bubble_chart</i>
                <div>
                    <h2 class='no_margin_heading'>Sensors</h2>
                    <s1>A description of this layer goes here</s1>
                </div>

            </li>
            <li id='layer_alt_1' data-color='dodgerblue' v-on:click="changeColors('layer_alt_1', 'dodgerblue')">
                <i class='material-icons'>waves</i>
                <div>
                    <h2 class='no_margin_heading'>Inundation</h2>
                    <s1>A description of this layer goes here</s1>
                </div>

            </li>
            <li id='layer_alt_2' data-color='firebrick' v-on:click="changeColors('layer_alt_2', 'firebrick')">
                <i class='material-icons'>graphic_eq</i>
                <div>
                    <h2 class='no_margin_heading'>Predicted risk</h2>
                    <s1>A description of this layer goes here</s1>
                </div>

            </li>
        </ul>
    </div>
</template>

<script>

export default {
	name: 'LayerSelectionIndex',
	methods: {
		changeColors: function(id, color) {
			var ul = document.getElementById("layers_list");
			var items = ul.getElementsByTagName("li");
			for (var i = 0; i < items.length; ++i) {
              items[i].style.color = 'black'
			}
            document.getElementById(id).style.color = color;
		}
	}
}

</script>

<style scoped>

    h2 {
      font-size: 14px;
      line-height: 20px;
    }

    s1 {
        font-size: 12px;
        line-height: 16px;
        color: #a9a9a9;
    }

    a {
      text-decoration: none;
      color: #2dc4b2;
    }

    .card {
      background-color: white;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      border-radius: 3px;
      padding: 5px;
    }

    .card:hover {
      box-shadow: 0 10px 18px 0 rgba(0,0,0,0.2);
    }

    .card_heading {
      margin: 5px;
      margin-left: 0.7em;
    }

    #layers_list {
      list-style: none;
      padding-left: 5px;
    }

    #layers_list > li {
      padding-bottom: 8px;
      cursor: pointer; 
    }

    #layers_list > li > * {
      display: inline-block;
      vertical-align: text-top;
    }

    .no_margin_heading {
      margin: 0.1em;
    }

    .colors {
      height: 12px;
    }

    .label {
      display: inline-block;
      text-align: center;
      font-size: 14px;
    }
</style>