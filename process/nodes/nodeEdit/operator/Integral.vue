<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';

const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(NODE_COLLECTION.intergral.name, NODE_COLLECTION.intergral.type, () => ({
    ...NODE_COLLECTION.intergral.data()
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

    });
  },
  methods: {
  },
});

export default Cpt;
</script>

<template lang="html">
  <NodeBase
    :nodeName="name"
    className="operator-integral" >
    <p class="node-label-sub">发送数量（积分）：</p>
    <el-input-number v-model="num" :min="1" :max="limit" v-if="!disabledEdit"></el-input-number>
    <span v-else>{{ num }}</span>
  </NodeBase>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';

.operator-integral {
  .el-input-number {
    width: 100%;
  }
}
</style>
