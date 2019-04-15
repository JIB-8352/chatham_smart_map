import Vuex from "vuex";
import cons from "@/store/modules/console";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import ConsoleLegend from "@/components/console/ConsoleLegend";

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    cons
  }
});

describe("ConsoleLegend", () => {
  const wrapper = shallowMount(ConsoleLegend, { store, localVue });

  it("renders a legend row for each layer", () => {
    expect(wrapper.findAll("div.legend_row")).toHaveLength(2);
  });

  it("updates the displayed legends on click events", () => {
    const [one, two] = wrapper.findAll("div.legend_row").wrappers;
    const get_display = el => el.find("span").element.style.display;

    expect(get_display(one)).toBe("block");
    expect(get_display(two)).toBe("none");

    store.commit("cons/toggleLayers", { index: 1 });
    expect(get_display(one)).toBe("block"); // always display the first legend
    expect(get_display(two)).toBe("block");
  });
});
