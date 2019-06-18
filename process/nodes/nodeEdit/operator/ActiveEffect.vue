<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';

// const DATE_OPTIONS = Array.from(new Array(31).keys()).splice(1).map(i => ({
//   label: `${i}天`,
//   value: i
// }));
const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(NODE_COLLECTION.effect.name, NODE_COLLECTION.effect.type, () => ({
    ...NODE_COLLECTION.effect.data()
  }))],
  props: {
  },
  data () {
    return {
    };
  },
  computed: {

  },
  mounted () {
    this.$nextTick(() => {
      // console.log(this);
    });
  },
  methods: {
    beforeSubmit () {
      this.afterDay = Number(this.afterDay);
    }
  },
});

export default Cpt;
</script>

<template lang="html">
  <NodeBase
    :nodeName="name"
    className="operator-send-response"
  >
    <p class="node-label-sub">分析截止时间：</p>
    <div class="node-sub-wrapper">
      <div>计划开始后</div>
      <el-input v-model="afterDay" v-if="!disabledEdit"></el-input>
      <span v-else>{{ afterDay }}</span>
      天
    </div>
  </NodeBase>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';
.node-sub-wrapper {
  display: flex;
  align-items: center;

  >div {
    width: 70px;
    /* font-size: 12px; */
    margin-right: 8px;
  }

  .el-input {
    flex-grow: 1;
  }
}
</style>
