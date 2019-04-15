import Vuex from "vuex";
import cons from "@/store/modules/console";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import TheConsole from "@/components/console/TheConsole";
import ConsoleLayersList from "@/components/console/ConsoleLayersList";
import ConsoleLegend from "@/components/console/ConsoleLegend";
import InformationCard from "@/components/console/InformationCard";

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    cons
  }
});

describe("TheConsole", () => {
  const wrapper = shallowMount(TheConsole, { store, localVue });

  it("has ConsoleLayersList and ConsoleLegend", () => {
    expect(wrapper.contains(ConsoleLayersList)).toBe(true);
    expect(wrapper.contains(ConsoleLegend)).toBe(true);
  });

  it("does not initially have InformationCard", () => {
    expect(wrapper.contains(InformationCard)).toBe(false);
  });

  it("has a InformationCard when sensor is defined", () => {
    store.commit("cons/setSensor", { sensor: {} });
    expect(wrapper.contains(InformationCard)).toBe(true);
  });
});
