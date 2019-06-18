<template lang="html">
  <div
    class="node-base" :class="[customClass, {
        'hide-footer': hideFooter,
      }]">
    <header class="node-name">
      {{nodeName}}
    </header>
    <p class="node-name-sub">
      <slot name="sub" />
    </p>
    <slot />

    <footer class="base-footer" v-if="!hideFooter">
      <el-button type="primary" :disabled="disabledSubmit" @click="submit">保存节点</el-button>
      <span class="icon" @click="$refs.wh.show()">&#xe602;</span>
    </footer>
    <WxHelp ref="wh" />
  </div>
</template>

<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
import pick from 'lodash/pick'
import WxHelp from '../dialogs/WxHelp.vue'

// @TODO useless

const Cpt = Vue.extend({
  components: {
    WxHelp
  },
  props: {
    disabledSubmit: Boolean,
    nodeName: String,
    hideFooter: Boolean,
    customClass: String
  },
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    submit () {
      this.$emit('submit')
    }
  }
})

export default Cpt
</script>

<style lang="less" type="text/less" >
.node-base {
  padding: 18px 15px 65px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;

  &.hide-footer {
    padding-bottom: 15px;
  }

  .node-name {
    color: rgba(155, 155, 155, 1);
    font-size: 14px;
    margin-bottom: 8px;
  }
  .node-name-sub {
    color: rgba(155, 155, 155, 1);
    font-size: 12px;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
  > .base-footer {
    background-color: #fff;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    padding: 10px;
    border-top: 1px solid #CACACA;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    .el-button {
      padding-left: 10px;
      padding-right: 10px;
      vertical-align: top;
    }
    .icon {
      float: right;
      font-size: 20px;
      vertical-align: middle;
      position: relative;
      top: 5px;
      font-family: 'iconfont';
      color: #9B9B9B;
      cursor: default;
    }
  }
}
</style>
