<template lang="html">
  <div
    class="node-base" :class="className">
    <div class="node-container">
      <header
        class="node-name"
        :class="{ disabledEditStyle: disabledEdit }"
      >
        <p class="title">
          节点名称：
        </p>

        <el-input v-if="!disabledEdit" v-model="myNodeName" />
        <span v-else class="node-view-name">{{ myNodeName }}</span>
      </header>

      <slot />
    </div>

    <footer class="base-footer" v-if="!hideFooter">
      <div class="button-wrapper">
        <el-button :disabled="disabledSubmit" type="primary" @click="submit">保存节点</el-button>
        <el-button @click="delSubmit">删除节点</el-button>
      </div>
      <span class="icon">
        <i class="icon-yiwen"></i>
      </span>
    </footer>
  </div>
</template>

<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
import pick from 'lodash/pick'
// @TODO useless

const Cpt = Vue.extend({
  props: {
    nodeName: String,
    hideFooter: Boolean,
    className: String,
    disabledSubmit: Boolean,
  },
  data () {
    return {
      myNodeName: this.nodeName,
      disabledEdit: false,
    }
  },
  watch: {
  },
  computed: {
  },
  mounted () {
    this.disabledEdit = this.$parent.disabledEdit;
  },
  methods: {
    submit () {
      this.$emit('submit', this.myNodeName);
    },
    delSubmit () {
      this.$emit('delSubmit');
    },
  },
  components: {
  },
})

export default Cpt
</script>

<style lang="css" >
@import 'src/assets/styles/var.css';

.node-base {
  background-color: #fff;
  width: 312px;
  padding: 18px 0 85px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(47, 137, 220, 0.1);
  border-radius: 4px;
  box-shadow: 0 4px 7px 0 rgba(47, 137, 220, 0.2);

  .node-name {
    color: rgba(155, 155, 155, 1);
    font-size: 14px;
    margin-bottom: 8px;

    >p {
      margin-bottom: 8px;
    }
  }

  .node-view-name {
    color: var(--text-color);
  }

  .node-container {
    max-height: 440px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 15px;
    box-sizing: border-box;

    .title {
      color: rgba(155, 155, 155, 1);
    }
  }

  .node-label-sub {
    font-size: 12px;
    color: rgba(155, 155, 155, 1);
    margin-bottom: 8px;
    > .title {
      color: #999;
      font-size: 14px;
      margin-bottom: 8px;
    }
  }

  .node-name-sub {
    color: rgba(155, 155, 155, 1);
    font-size: 12px;
    padding-bottom: 16px;
  }

  > .base-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    box-sizing: border-box;
    height: 50px;
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    .el-button {
      flex-shrink: 0;
      padding-left: 10px;
      padding-right: 10px;
      vertical-align: top;
    }
    .icon {
      color: #9ba8bd;
      > .icon-yiwen {
        font-size: 20px;
      }
    }
  }
}
</style>
