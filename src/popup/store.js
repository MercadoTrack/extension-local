import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let state = {
  size: "",
  items: [],
  showing: [],
};

let mutations = {
  UPDATE_SIZE(state, size) {
    state.size = size;
  },
  UPDATE_ITEMS(state, items) {
    state.items = items || [];
  },
  TOGGLE_HISTORY(state, id) {
    const i = state.showing.indexOf(id);
    if (i > -1) state.showing.splice(i, 1);
    else state.showing.push(id);
  },
};

export default new Vuex.Store({ state, mutations });
