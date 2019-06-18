<template lang="html">
  <NodeBase
    :nodeName="name"
    className="operator-union" >
    <el-alert
      title="如果此节点对人群处理之后人数不足100人，后续流程将终止执行。"
      type="info"
      show-icon>
    </el-alert>
  </NodeBase>
</template>
<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';

const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(NODE_COLLECTION.crowdUnion.name, NODE_COLLECTION.crowdUnion.type, () => ({
    ...NODE_COLLECTION.crowdUnion.data()
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
  },
  methods: {
  },
});

export default Cpt;
</script>

<style lang="css">
@import 'src/assets/styles/var.css';
</style>
