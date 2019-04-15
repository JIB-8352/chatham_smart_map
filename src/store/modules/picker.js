import { yesterday, today } from "@/helpers/constants";
import { format } from "date-fns";

const getDefaultState = () => ({
  dateOne: format(yesterday, "YYYY-MM-DD"),
  dateTwo: format(today, "YYYY-MM-DD"),
  endDate: format(today, "YYYY-MM-DD")
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
