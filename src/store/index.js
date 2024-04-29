import { createStore } from 'vuex'
import helper from './helper'
import auth from './modules/auth'
import order from './modules/order'
import type from './modules/type'
import employees from './modules/employees'
import admin from './modules/admin'
import products from './modules/product'
import questions from './modules/question'

export default createStore({
  state: {
    url: "http://localhost:4000/api/v1",
    imgUrl: "http://localhost:4000"
  },
  getters: {
    url(state) {
      return state.url
    },
    imgUrl(state) {
      return state.imgUrl
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    helper,
    auth,
    order,
    type,
    employees,
    admin,
    products,
    questions
  }
})