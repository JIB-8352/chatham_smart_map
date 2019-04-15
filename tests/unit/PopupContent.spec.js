import { shallowMount } from "@vue/test-utils";
import PopupContent from "@/components/PopupContent";

describe("PopupContent", () => {
  const wrapper = shallowMount(PopupContent, {
    propsData: {
      sensor: {
        waterLevelReading: {
          result: "Test",
          resultTime: "Test time"
        }
      }
    }
  });

  it("renders the correct text", () => {
    expect(wrapper.find("p:first-of-type").text()).toMatch("Water Level: Test");
    expect(wrapper.find("p:last-of-type").text()).toMatch(
      "Last Measured: Test time"
    );
  });
});
