import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const storeData = {
  state: {
    customer: "",
    cart: 0,
  },
  getters: {
    user: (state) => state.customer,
  },
  mutations: {
    TOGGLE_CUSTOMER(state, customer) {
      state.customer = customer;
      localStorage.setItem("customer", JSON.stringify(customer));
    },
    SAVE_CUSTOMER(state) {
      state.customer = JSON.parse(localStorage.getItem("customer"));
    },
    CHANGE_CART(state, cart) {
      state.cart = cart;
    },
  },
};
const store = new Vuex.Store(storeData);
export default store;
