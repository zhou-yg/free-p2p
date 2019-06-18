<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';

const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(
    NODE_COLLECTION.saveAsCrowd.name,
    NODE_COLLECTION.saveAsCrowd.type,
    () => (
    {
    ...NODE_COLLECTION.saveAsCrowd.data()
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

<template lang="html">
  <NodeBase
    :nodeName="name"
    className="sava-crowd" >
    <p class="node-label-sub">另存为人群名称：</p>
    <el-input v-model="crowdName" v-if="!disabledEdit" />
    <span v-else>{{ crowdName }}</span>
  </NodeBase>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';
</style>
