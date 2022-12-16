<script setup lang="ts">
  import { reactive, ref, shallowReactive } from "@vue/reactivity";
  import { RouterLink, RouterView } from "vue-router";
  import {
    inputComponents,
    layoutComponents,
    selectComponents,
    drawingList,
  } from "./components/config";

  import draggable from "vuedraggable";
  import DraggableItem from "@/components/DraggableItem.vue";

  const leftComponents = shallowReactive([
    {
      title: "输入型组件",
      list: inputComponents,
    },
    {
      title: "选择型组件",
      list: selectComponents,
    },
    {
      title: "布局型组件",
      list: layoutComponents,
    },
    {
      title: "图表型组件",
      list: [],
    },
  ]);

  const drag = ref<boolean>(false);
  const editableTabsValue = ref("first");

  const oDrawingList = reactive(drawingList);

  let activeData = ref(drawingList[0]);
  const activeId = ref(drawingList[0].formId);

  const activeFormItem = (element: any) => {
    activeData.value = element;
    activeId.value = element.formId;

    console.log(activeData, "activeData");
  };
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="250px">
        <el-container>
          <el-header class="project-header border-bottom">
            <span class="project-icon">
              <img src="@/assets/icon.svg" alt="" />
            </span>
            <span class="project-name">Vue3-Form-View</span>
          </el-header>
          <el-main class="border-right">
            <!-- 组件插件列表 -->
            <div class="components-list">
              <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
                <div class="components-title">
                  <el-icon><Guide /></el-icon>
                  {{ item.title }}
                </div>
                <draggable
                  class="components-draggable"
                  draggable=".components-item"
                  :sort="false"
                  @start="drag = true"
                  @end="drag = false"
                  v-model="item.list"
                  :group="{
                    name: 'componentsGroup',
                    pull: 'clone',
                    put: true,
                  }"
                  :item-key="`draggable_${listIndex}`"
                >
                  <template #item="{ element }">
                    <div class="components-item">
                      <div class="components-body">
                        <el-icon><Promotion /></el-icon>
                        {{ element.__config__.label }}
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-aside>
      <el-container>
        <el-header class="project-header border-bottom"></el-header>
        <!-- 组件绘制模块 -->
        <el-main>
          <el-scrollbar class="center-scrollbar">
            <el-row class="center-board-row">
              <el-form>
                <draggable
                  class="drawing-board"
                  draggable=".components-item"
                  :list="oDrawingList"
                  :animation="340"
                  :group="{
                    name: 'componentsGroup',
                    pull: 'clone',
                    put: true,
                  }"
                  :item-key="`draggable_components_1`"
                >
                  <template #item="{ element }">
                    <div class="components-item">
                      <DraggableItem
                        :element="element"
                        @activeItem="activeFormItem"
                      ></DraggableItem>
                    </div>
                  </template>
                </draggable>
                <div v-show="!drawingList.length" class="empty-info">
                  从左侧拖入或点选组件进行表单设计
                </div>
              </el-form>
            </el-row>
          </el-scrollbar>
        </el-main>
        <!-- <el-main>
          <router-view></router-view>
        </el-main> -->
      </el-container>
      <el-aside width="300px">
        <el-tabs
          class="project-tabs"
          stretch
          type="border-card"
          v-model="editableTabsValue"
        >
          <el-tab-pane label="组件属性" name="first">
            <el-form
              :inline="true"
              :model="activeData"
              class="demo-form-inline"
            >
              <el-form-item label="组件名">
                <el-input
                  v-model="activeData.__config__.label"
                  :placeholder="activeData.placeholder"
                />
              </el-form-item>
              <el-form-item label="组件颜色">
                <el-color-picker v-model="activeData.__config__.color" />
                <!-- <el-input v-model="formInline.color" placeholder="" /> -->
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="公共属性" name="second">Config</el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
  </div>
</template>


<style lang="scss" scoped>
@use "./styles/element/index.scss" as *;
.common-layout {
  width: 100%;
  height: 100%;
  .project-name {
    color: var(--vue-color-green);
  }

  .project-icon {
    width: 30px;
    height: 30px;
    padding: 0 12px;
    box-sizing: content-box;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .components-list {
    .components-title {
      font-size: 15px;
      margin: 6px 2px;
      color: var(--vue-color-green);
    }
    .components-draggable {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 12px;
      padding-bottom: 20px;
      // background: ;

      .components-body {
        font-size: var(--vt-font-size-small);
        background: var(--vt-c-black-mute);
        padding: 8px 10px;
        cursor: move;
        border-radius: 3px;
        border: 1px solid transparent;
        &:active {
          border: 1px dashed var(--vue-color-green-link-2);
        }
      }
    }
  }
}
</style>
