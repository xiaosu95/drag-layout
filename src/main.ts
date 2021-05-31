import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import hljs from "highlight.js";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.directive("highlight", function(el) {
  const blocks = el.querySelectorAll("pre code");
  blocks.forEach((block: any) => {
    hljs.highlightBlock(block);
  });
});
new Vue({
  render: h => h(App)
}).$mount("#app");
