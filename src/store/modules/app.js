const state = {
  /* loading is only used once - in the beginning when we are waiting for the map to load and the 
  getSensorInformation promise to resolve. updatingData is used whenever observations are being fetched. */
  loading: true,
  mapError: false,
  mapLoaded: false,
  showWarning: false,
  /* The app needs to know which layer has been selected and if a sensor has been selected to make
  significant UI changes, like showing or hiding the timelapse components. */
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
  /* When the app is no longer in timelapseMode, wait for any previously issued data requests to finish
    before the timelapse components can reset - see the watcher in helper.js */
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
