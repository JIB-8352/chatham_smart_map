import { shallowMount } from "@vue/test-utils";
import ConsoleCard from "@/components/console/ConsoleCard";

describe("ConsoleCard", () => {
  const wrapper = shallowMount(ConsoleCard, {
    propsData: {
      heading: "Test"
    }
  });

  it("has a h2", () => {
    expect(wrapper.contains("h2")).toBe(true);
  });

  it("renders the correct markup", () => {
    expect(wrapper.html()).toContain("<h2>Test</h2>");
  });

  it("has the correct CSS class", () => {
    expect(wrapper.find(".card").exists()).toBe(true);
    expect(wrapper.find(".scroll").exists()).toBe(false);

    const scrollableWrapper = shallowMount(ConsoleCard, {
      propsData: {
        heading: "Test",
        scrollable: true
      }
    });

    expect(scrollableWrapper.find(".card").exists()).toBe(true);
    expect(scrollableWrapper.find(".scroll").exists()).toBe(true);
  });
});
