<!--
 * @Descripttion: 
 * @Author: junshi junshi@ssc-hn.com
 * @Date: 2022-12-16 11:32:05
 * @LastEditors: junshi junshi@ssc-hn.com
 * @LastEditTime: 2022-12-22
-->
<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import draggable from "vuedraggable";

const props = defineProps(["element", "activeId"]);
const emit = defineEmits(["activeItem"]);

function domClick(element: any) {
  emit("activeItem", element);
}
console.log(props.element);

const RandomColor = computed(() => {
  return setRandomColor();
});

const setRandomColor = () => {
  let r, g, b;
  r = Math.floor(Math.random() * 256);
  g = Math.floor(Math.random() * 256);
  b = Math.floor(Math.random() * 256);
  return "rgb(" + r + "," + g + "," + b + ")";
};
</script>

<template>
  <div
    @click="domClick(props.element)"
    :style="{ width: props.element.style?.width || null }"
    :class="{ active: props.activeId == element.__config__.formId }"
  >
    <template v-if="props.element.__config__.layoutTree">
      <!-- {{ props.element }} -->
      <el-row
        :type="props.element.__config__.type"
        :justify="props.element.__config__.justify"
        :align="props.element.__config__.align"
      >
        <el-col :span="props.element.__config__.span">
          <el-row
            :gutter="props.element.__config__.gutter"
            class="drawing-row-item"
          >
            <span class="component-name"
              >{{ props.element.__config__.componentName }}123</span
            >
            <draggable
              :list="props.element.__config__.children"
              :animation="340"
              draggable=".components-item"
              :sort="false"
              group="componentsGroup"
              class="drag-wrapper"
              :item-key="`draggable_components_child_${new Date().getTime()}`"
            >
              <template #item="{ element }">
                <span v-if="props.element.__config__.children.length">
                  <DraggableItem
                    :element="element"
                    :activeId="activeId"
                    @click.stop="domClick(element)"
                  ></DraggableItem>
                </span>
              </template>
            </draggable>
          </el-row>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <div>{{ props.element.__config__.label }}</div>
      <div
        class="color-dom"
        :style="{ background: props.element.__config__.color || RandomColor }"
      ></div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.color-dom {
  width: 100px;
  height: 100px;
}

.drawing-row-item {
  height: 200px;
  border: 1px solid var(--vue-color-green);

  .drag-wrapper {
    width: 100%;
    height: 100%;
  }
}

.active {
  border: 1px dashed var(--vue-color-green-active);
}
</style>
