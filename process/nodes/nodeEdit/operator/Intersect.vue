<template lang="html">
  <NodeBase
    :nodeName="name"
    className="operator-intersect" >
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
  mixins: [nodeBaseMixin(NODE_COLLECTION.crowdIntersect.name, NODE_COLLECTION.crowdIntersect.type, () => ({
    ...NODE_COLLECTION.crowdIntersect.data()
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
