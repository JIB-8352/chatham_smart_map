import { YESTERDAY, TODAY, PICKER_FORMAT } from "@/helpers/constants";
import { format } from "date-fns";

const getDefaultState = () => ({
  dateOne: format(YESTERDAY, PICKER_FORMAT),
  dateTwo: format(TODAY, PICKER_FORMAT),
  // endDate represents the date beyond which the picker won't let the user pick a date.
  endDate: format(TODAY, PICKER_FORMAT)
});

const state = getDefaultState();

const mutations = {
  setDateOne(state, { val }) {
    state.dateOne = val;
  },
  setDateTwo(state, { val }) {
    state.dateTwo = val;
  },
  resetState(state) {
    Object.assign(state, getDefaultState());
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
