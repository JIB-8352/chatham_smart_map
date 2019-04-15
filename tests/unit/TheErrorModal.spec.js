import { shallowMount } from "@vue/test-utils";
import TheErrorModal from "@/components/TheErrorModal";

describe("TheErrorModal", () => {
  const wrapper = shallowMount(TheErrorModal, {
    propsData: {
      display: true
    }
  });

  it("has useful text", () => {
    expect(wrapper.find("v-card-title").text()).toEqual("Map Error");
    expect(wrapper.contains("v-card-text")).toBe(true);
    expect(wrapper.find("v-btn").text()).toEqual("REFRESH PAGE");
  });
});
