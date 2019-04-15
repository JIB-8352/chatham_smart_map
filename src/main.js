import AirbnbStyleDatepicker from "vue-airbnb-style-datepicker";
import App from "./App";
import store from "@/store";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(AirbnbStyleDatepicker, {
  colors: {
    selected: "teal",
    inRange: "#02a9a7",
    selectedText: "#fff",
    text: "teal",
    inRangeBorder: "#33dacd",
    disabled: "#fff"
  }
});

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
