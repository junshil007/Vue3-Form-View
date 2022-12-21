<template>
  <div class="msg">{{ state.message }}</div>
  <div class="itxst">
    <div class="group">
      <draggable :list="state.modules.arr1" ghost-class="ghost" handle=".move" filter=".forbid" :force-fallback="true"
        chosen-class="chosenClass" animation="300" @start="onStart" @end="onEnd" :group="state.groupA"
        :fallback-class="true" :fallback-on-body="true" :touch-start-threshold="50" :fallback-tolerance="50"
        :move="onMove" :sort="false">
        <template #item="{ element }">
          <div class="item move">
            <label class="move">{{ element.name }}</label>
            <span v-html="element.name == '消息' ? 'www.itxst.com' : '内容....'"></span>
          </div>
        </template>
      </draggable>
    </div>
    <div class="group">
      <draggable :list="state.modules.arr2" ghost-class="ghost" handle=".move" filter=".forbid" :force-fallback="true"
        chosen-class="chosenClass" animation="300" @start="onStart" @end="onEnd" group="itxst" :fallback-class="true"
        :fallback-on-body="true" :touch-start-threshold="50" :fallback-tolerance="50" :move="onMove">
        <template #item="{ element }">
          <div class="item move">
            <label class="move">{{ element.name }}</label>
            <span>内容....</span>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
//导入draggable组件
import draggable from "vuedraggable";

const state = reactive({
  message: "A组只能往B组拖到一个元素",
  groupA: {
    name: "itxst",
    put: true, //允许拖入
    pull: () => {
      let res = state.modules.arr1.length > 3;
      //当A组元素小于等于3个时，不允许再拖出元素了
      state.message = res ? "只能拖出1个" : "不能再拖了";
      return res;
    },
  },
  modules: {
    arr1: [
      { name: "A组", id: 1 },
      { name: "库存", id: 2 },
      { name: "销量", id: 3 },
      { name: "日志", id: 4 },
    ],
    arr2: [
      { name: "B组", id: 5 },
      { name: "员工", id: 6 },
      { name: "报表", id: 7 },
    ],
  },
});

//拖拽开始的事件
const onStart = () => {
  console.log("开始拖拽");
};

//拖拽结束的事件
const onEnd = () => {
  console.log("结束拖拽");
};

const onMove = (e, originalEvent) => {
  //不允许停靠
  if (e.relatedContext.element.disabledPark == true) return false;

  return true;
};
</script>
<style >
body {
  padding: 0px;
  margin: 0px;
  background-color: #f1f1f1;
}

.msg {
  padding: 10px 20px 0px 20px;
}

.itxst {
  background-color: #f1f1f1;
  display: flex;
  padding: 20px;
}

.group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  width: 32%;
  margin-right: 20px;
}

.item {
  border: solid 1px #ddd;
  padding: 0px;
  text-align: left;
  background-color: #fff;
  margin-bottom: 10px;
  display: flex;
  height: 36px;
  user-select: none;
}

.item>label {
  padding: 6px 10px;
  color: #333;
}

.item>label:hover {
  cursor: move;
}

.item>span {
  padding: 6px 10px;
  color: #666;
}

.ghost {
  border: solid 1px rgb(19, 41, 239) !important;
}

.chosenClass {
  opacity: 1;
  border: solid 1px red;
}

.fallbackClass {
  background-color: aquamarine;
}
</style>