import { shallowMount } from "@vue/test-utils";
import TheProgressCircle from "@/components/TheProgressCircle";

describe("TheProgressCircle", () => {
  const wrapper = shallowMount(TheProgressCircle);

  it("has a v-progress-circular", () => {
    expect(wrapper.contains("v-progress-circular")).toBe(true);
  });
});
