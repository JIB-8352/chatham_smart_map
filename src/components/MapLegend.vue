<template>
    <div class='card'>
        <h2 class='card_heading'>MAP LEGEND</h2>

        <div class='legend_row' data-layer='layer_default'>
            <div class = 'label' id='sensor'></div>
            <div class='label'>Sea-level sensors</div>
        </div>

        <div class='legend_row' data-layer='layer_alt_1'>
            <div class='colors'></div>
            <div class='legend_text'>
                <div class='label third'>5ft</div>
                <div class='label third'>10ft</div>
                <div class='label third'>15ft</div>
            </div>
        </div>

        <div class='legend_row' data-layer='layer_alt_2'>
            <div class='colors'></div>
            <div class='legend_text'>
                <div id='low_risk_label' class='label'>Low risk</div>
                <div id='high_risk_label' class='label'>High risk</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
	name: 'MapLegend',
}

</script>

<style scoped>

    h2 {
      font-size: 14px;
      line-height: 20px;
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

    .legend_row {
      margin: 5px;
    }

    .legend_text {
      overflow: hidden;
    }

    [data-layer^="layer_alt"] {
      display: none;
    }

    [data-layer="layer_alt_1"] > .colors {
      background: linear-gradient(to right, turquoise, deepskyblue , dodgerblue, navy);
    }

    [data-layer="layer_alt_2"] > .colors {
      background: linear-gradient(to right, coral, tomato, red, darkred);
    }

    .label {
      display: inline-block;
      text-align: center;
      font-size: 14px;
    }

    #sensor {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #007cbf;
      opacity: 0.8;
      margin-right: 6px;
    }

    #low_risk_label {
      float: left;
    }

    #high_risk_label{
      float: right;
    }

    .third {
      width: 32%;
    }

</style>