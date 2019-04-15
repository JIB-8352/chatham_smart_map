import Vuex from "vuex";
import app from "@/store/modules/app";
import timelapse from "@/store/modules/timelapse";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import DatePicker from "@/components/timelapse/DatePicker";

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    timelapse
  }
});

describe("DatePicker", () => {
  const wrapper = shallowMount(DatePicker, { store, localVue });

  it("has the expected elements", () => {
    expect(wrapper.find("div.datepicker-trigger").exists()).toBe(true);
    expect(wrapper.contains(".first")).toBe(true);
    expect(wrapper.contains("div.vertical-line")).toBe(true);
    expect(wrapper.contains(".second")).toBe(true);
    expect(wrapper.find("i").text()).toEqual("calendar_today");
    expect(wrapper.contains("airbnbstyledatepicker")).toBe(true);
  });

  it("div is disabled by default", () => {
    expect(wrapper.find("div.datepicker-trigger").hasClass("disabled")).toBe(
      true
    );
  });

  it("input is enabled when updatingData = false", () => {
    store.commit("app/updatingData", { updatingData: false });
    expect(wrapper.find("div.datepicker-trigger").hasClass("disabled")).toBe(
      false
    );
  });
});
