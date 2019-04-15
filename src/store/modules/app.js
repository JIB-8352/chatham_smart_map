const state = {
  loading: true,
  mapError: false,
  mapLoaded: false,
  showWarning: false,
  layerSelected: 0,
  sensorIsSelected: false,
  warningText: "",
  updatingData: true
};

const mutations = {
  mapError(state) {
    state.mapError = true;
  },

  showConsole(state) {
    state.mapLoaded = true;
  },

  startLoading(state) {
    state.loading = true;
  },

  stopLoading(state) {
    state.loading = false;
  },

  showWarning(state, { warningText }) {
    state.showWarning = true;
    state.warningText = warningText;
  },

  layerSelected(state, { layerSelected }) {
    state.layerSelected = layerSelected;
  },

  sensorSelected(state, { sensorIsSelected }) {
    state.sensorIsSelected = sensorIsSelected;
  },

  updatingData(state, { updatingData }) {
    state.updatingData = updatingData;
  }
};

const getters = {
  timelapseMode({ layerSelected, sensorIsSelected }) {
    return layerSelected !== 0 || sensorIsSelected;
  },
  reset({ updatingData }, { timelapseMode }) {
    return !timelapseMode && !updatingData;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
