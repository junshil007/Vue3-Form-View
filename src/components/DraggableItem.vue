<!--
 * @Descripttion: 
 * @Author: junshi junshi@ssc-hn.com
 * @Date: 2022-12-16 11:32:05
 * @LastEditors: junshi junshi@ssc-hn.com
 * @LastEditTime: 2022-12-16 15:10:57
-->
<script setup lang="ts">
  const props = defineProps(["element"]);
  const emit = defineEmits(["activeItem"]);

  function domClick(element: any) {
    emit("activeItem", element);
  }
  console.log(props.element);

  const RandomColor = () => {
    let r, g, b;
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
  };
</script>

<template>
  <div @click="domClick(props.element)">
    <div>{{ props.element.__config__.label }}</div>
    <div
      class="color-dom"
      :style="{ background: props.element.__config__.color || RandomColor() }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.color-dom {
  width: 100px;
  height: 100px;
}
</style>