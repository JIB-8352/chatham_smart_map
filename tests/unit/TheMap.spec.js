import { shallowMount } from "@vue/test-utils";
import TheMap from "@/components/TheMap";

describe("TheMap", () => {
  const wrapper = shallowMount(TheMap);

  it("has a mapbox map", () => {
    expect(wrapper.contains("mapbox-stub")).toBe(true);
  });
});
