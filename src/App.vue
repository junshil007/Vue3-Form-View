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
import { deepClone } from "@/utils/index";
import { onMounted } from "@vue/runtime-core";

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

let tempActiveData;

const drag = ref<boolean>(false);
/**
 * 右边组件属性tab值
 */
const editableTabsValue = ref("first");

/**
 * 需要绘制的组件集
 */
const oDrawingList = reactive(drawingList);
const activeData = ref({});
const activeId = ref(0);


const addComponent = (element: any) => {
  console.log(element, "element");
};

const onMoveCallback = (evt: any) => {
  console.log("拖动前的索引 :" + evt);
  console.log("拖动后的索引 :" + evt);
};


onMounted(() => {
  activeFormItem(oDrawingList[0])
})

/**
 * 选择中的当前的组件
 * @param element 
 */
const activeFormItem = (element: any) => {
  activeData.value = element;
  activeId.value = element.__config__.formId;
};

/**
 * 拖拽左边组件
 * @param origin 组件配置项
 */
const cloneComponent = (origin) => {
  const clone = deepClone(origin);
  const config = clone.__config__
  createIdAndKey(clone)
  clone.placeholder !== undefined && (clone.placeholder += config.label)
  tempActiveData = clone
  console.log(clone, 'clone+++++++++');
  return clone;
};

const createIdAndKey = (item) => {
  const config = item.__config__
  config.formId = `components_${new Date().getTime()}`

  config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
  if (config.layout === 'colFormItem') {
    item.__vModel__ = `field${config.formId}`
  } else if (config.layout === 'rowFormItem') {
    config.componentName = `row${config.formId}`
    !Array.isArray(config.children) && (config.children = [])
    delete config.label // rowFormItem无需配置label属性
  }
  if (Array.isArray(config.children)) {
    config.children = config.children.map(childItem => createIdAndKey(childItem))
  }
  return item
}

const onEnd = (obj) => {
  console.log(obj, "obj++++++");
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
                  <el-icon>
                    <Guide />
                  </el-icon>
                  {{ item.title }}
                </div>
                <draggable class="components-draggable" :clone="cloneComponent" draggable=".components-item"
                  :sort="false" @end="onEnd" v-model="item.list" :group="{
                    name: 'componentsGroup',
                    pull: 'clone',
                    put: false,
                  }" :item-key="`draggable_components_${item.title}`">
                  <template #item="{ element }">
                    <div class="components-item">
                      <div class="components-body">
                        <el-icon>
                          <Promotion />
                        </el-icon>
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
        <el-main class="center-scrollbar-view">
          <el-scrollbar class="center-scrollbar">
            <draggable class="drawing-board" draggable=".components-item" :list="oDrawingList" :animation="340" :group="{
              name: 'componentsGroup',
              pull: 'clone',
              put: true,
            }" :item-key="`draggable_components_${new Date().getTime()}`">
              <template #item="{ element }">
                <div class="components-item" :class="{ active: activeId == element.__config__.formId }">
                  <DraggableItem :element="element" @activeItem="activeFormItem"></DraggableItem>
                </div>
              </template>
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              从左侧拖入或点选组件进行表单设计
            </div>
          </el-scrollbar>

          <h1 v-if="oDrawingList.length === 0" class="tagline">
            The Progressive<br />JavaScript Framework
          </h1>
        </el-main>
        <!-- <el-main>
          <router-view></router-view>
        </el-main> -->
      </el-container>
      <el-aside width="300px">
        <!-- 组件属性模块 -->
        <el-tabs class="project-tabs" stretch type="border-card" v-model="editableTabsValue">
          <el-tab-pane label="组件属性" name="first" v-if="activeId !== 0">
            <el-form :inline="true" :model="activeData" class="demo-form-inline">
              <el-form-item label="组件id">
                <el-input v-model="activeData.__config__.formId" readonly disabled />
                <!-- <el-color-picker v-model="activeData.__config__.formId" /> -->
              </el-form-item>
              <el-form-item label="组件名">
                <el-input v-model="activeData.__config__.label" :placeholder="activeData.placeholder" />
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

  .center-scrollbar-view {
    position: relative;

    .tagline {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 76px;
      line-height: 1.25;
      font-weight: 900;
      letter-spacing: -1.5px;
      max-width: 960px;
      margin: 0 auto;
      z-index: -1;
    }

    .components-item+.components-item {
      margin-top: 15px;
    }
  }

  .drawing-board {
    height: 100%;
    position: relative;
  }

  .components-item {
    flex: 1;
  }


  .active {
    border: 1px dashed var(--vue-color-green-active);
  }
}
</style>

