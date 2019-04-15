import Vuex from "vuex";
import app from "@/store/modules/app";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import App from "@/App";
import TheProgressCircle from "@/components/TheProgressCircle";
import TheWarningAlert from "@/components/TheWarningAlert";
import TheErrorModal from "@/components/TheErrorModal";
import TheMap from "@/components/TheMap";
import TheConsole from "@/components/console/TheConsole";
import TheTimelapse from "@/components/timelapse/TheTimelapse";

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app
  }
});

describe("App", () => {
  const wrapper = shallowMount(App, { store, localVue });

  it("has the expected elements in the default state", () => {
    expect(wrapper.contains(TheProgressCircle)).toBe(true);
    expect(wrapper.contains(TheWarningAlert)).toBe(false);
    expect(wrapper.find(TheErrorModal).props("display")).toBe(false);
    expect(wrapper.contains(TheMap)).toBe(true);
    expect(wrapper.contains(TheConsole)).toBe(false);
    expect(wrapper.contains(TheTimelapse)).toBe(false);
  });

  it("TheConsole and TheTimelapse appear when map has loaded", () => {
    store.commit("app/showConsole");
    expect(wrapper.contains(TheConsole)).toBe(true);
    expect(wrapper.contains(TheTimelapse)).toBe(true);
  });

  it("TheErrorModal's display changes on an error", () => {
    store.commit("app/mapError");
    expect(wrapper.find(TheErrorModal).props("display")).toBe(true);
  });

  it("TheWarningAlert appears on a warning", () => {
    store.commit("app/showWarning", { warningText: "" });
    expect(wrapper.contains(TheWarningAlert)).toBe(true);
  });

  it("TheProgressCircle disappears when not loading", () => {
    store.commit("app/stopLoading");
    expect(wrapper.contains(TheProgressCircle)).toBe(false);
  });
});
