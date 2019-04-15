import { shallowMount } from "@vue/test-utils";
import TheWarningAlert from "@/components/TheWarningAlert";

describe("TheWarningAlert", () => {
  const wrapper = shallowMount(TheWarningAlert, {
    propsData: {
      text: "Test"
    }
  });

  it("has a v-alert", () => {
    expect(wrapper.contains("v-alert")).toBe(true);
  });

  it("renders the correct text", () => {
    expect(wrapper.text()).toMatch("Test");
  });
});
