/*
 * @Descripttion: 项目入口
 * @Author: junshi junshi@ssc-hn.com
 * @Date: 2022-12-14 15:22:52
 * @LastEditors: junshi junshi@ssc-hn.com
 * @LastEditTime: 2022-12-22
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "element-plus/theme-chalk/dark/css-vars.css";
import "./styles/base.scss";

import DraggableItem from "@/components/DraggableItem.vue";

const app = createApp(App);
app.component("DraggableItem", DraggableItem);

// 引入icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);

app.mount("#app");
