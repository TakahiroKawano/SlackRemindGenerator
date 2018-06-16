/* eslint-disable */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

Vue.config.productionTip = false;

// navigator.serviceWorker
//   .register("./service-worker.js")
//   .catch(console.error.bind(console));

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
