import { shallowMount } from "@vue/test-utils";
import TheTimelapse from "@/components/timelapse/TheTimelapse";
import PlayButton from "@/components/timelapse/PlayButton";
import DatePicker from "@/components/timelapse/DatePicker";
import TimelapseBar from "@/components/timelapse/TimelapseBar";

describe("TheTimelapse", () => {
  const wrapper = shallowMount(TheTimelapse);

  it("has PlayButton, DatePicker and TimelapseBar", () => {
    expect(wrapper.contains(PlayButton)).toBe(true);
    expect(wrapper.contains(DatePicker)).toBe(true);
    expect(wrapper.contains(TimelapseBar)).toBe(true);
  });
});
