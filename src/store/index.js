import Vue from "vue";
import Vuex from "vuex";
import app from "@/store/modules/app";
import cons from "@/store/modules/console";
import picker from "@/store/modules/picker";
import timelapse from "@/store/modules/timelapse";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    cons,
    picker,
    timelapse
  }
});
