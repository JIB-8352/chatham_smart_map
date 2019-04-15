import { shallowMount } from "@vue/test-utils";
import ConsoleLayersListItem from "@/components/console/ConsoleLayersListItem";

describe("ConsoleLayersListItem", () => {
  const wrapper = shallowMount(ConsoleLayersListItem, {
    propsData: {
      layer: {
        name: "name_test",
        description: "description_test",
        icon: "icon_test",
        color: "red",
        selected: true
      }
    }
  });

  it("has the expected elements", () => {
    expect(wrapper.contains("li")).toBe(true);
    expect(wrapper.find("i").text()).toBe("icon_test");
    expect(wrapper.find("h2").text()).toBe("name_test");
    expect(wrapper.find("small").text()).toBe("description_test");
  });

  it("conditionally renders li color", () => {
    expect(wrapper.element.style.color).toBe("red");

    const layer = {
      color: "red",
      selected: false
    };
    wrapper.setProps({ layer });
    expect(wrapper.element.style.color).toBe("black");
  });
});
