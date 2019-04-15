import Vuex from "vuex";
import timelapse from "@/store/modules/timelapse";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import PlayButton from "@/components/timelapse/PlayButton";

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    timelapse
  }
});

describe("PlayButton", () => {
  const wrapper = shallowMount(PlayButton, { store, localVue });

  it("has the default elements", () => {
    expect(wrapper.contains("v-btn")).toBe(true);
    expect(wrapper.find("v-icon").text()).toEqual("play_arrow");
  });

  it("has the default elements", () => {
    store.commit("timelapse/toggleIsPlaying");
    expect(wrapper.find("v-icon").text()).toEqual("pause");
  });
});
