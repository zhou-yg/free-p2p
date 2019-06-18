<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
const Cpt = Vue.extend({
  components: {
  },
  props: {
    activityName: String,
    disabledEdit: Boolean,
    disabledRemove: Boolean,
    disabledUndo: Boolean
  },
  data () {
    return {
    }
  },
  computed: {

  },
  mounted () {
    document.addEventListener('keydown', this.quickHandler)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.quickHandler)
  },
  methods: {
    quickHandler (e) {
      switch (e.code) {
        case 'Backspace':
          // delete
          break
        case 'KeyZ':
          if (e.ctrlKey || e.metaKey) {
            // undo
          }
          break
      }
    }
  }
})

export default Cpt
</script>

<template lang="html">
  <div class="process-operation">
    <ul :class="{
        'looklook': disabledEdit,
      }">
      <li class="l1">
        <span @click="$emit('gobackList')">
          <el-button type="text"> > </el-button>
          返回
        </span>
      </li>
      <li class="c">
        {{activityName}}
      </li>
      <li class="r2" v-if="!disabledEdit">
        <el-button size="small" @click="$emit('save')">
          保存至草稿
        </el-button>
      </li>
      <li class="r1" v-if="!disabledEdit">
        <el-button size="small" type="primary" @click="$emit('executeRightnow')">
          执行
        </el-button>
      </li>
      <li class="r1" v-if="disabledEdit">
          <span>执行中</span>
          <span class="green-dot"></span>
      </li>
      <li class="r1" v-if="disabledEdit">
        <el-button size="small" @click="$emit('stop')">
          停用
        </el-button>
      </li>
    </ul>
  </div>
</template>

<style lang="less" type="text/less" >
:root {
  --node-list-width: 160px;
}
.process-operation {
  background-color: #fff;
  color: var(--text-color);
  border: 1px solid #e6e6e6;
  border-left: 0;
  overflow: hidden;
  font-size: 14px;
  min-height: 44px;
  > ul {
    padding: 0 16px;
    white-space: nowrap;
    display: flex;

    &.looklook {

    }
  }
  .l1 {
    width: 180px;
    max-width: 180px;
  }
  .c {
    text-align: center;
  }
  .r2{
    width: 90px;
    max-width: 90px;
  }
  .r1{
    width: 60px;
    max-width: 60px;
  }
  li {
    margin-right: -5px;
    padding: 0 4px;
    line-height: 44px;
    display: inline-block;
    cursor: pointer;
    flex:1;

    &.disabled {
      color: #999;
    }

    .icon {
      font-size: 14px;
      margin: 0 4px 0 0;
    }

    &.active {
      background-color: #fff;
    }
  }

  .green-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    background-color: #7ED321;
    border-radius: 50%;
  }
}
</style>
