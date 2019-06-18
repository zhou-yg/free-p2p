<template lang="html">
  <NodeBase
    :nodeName="name"
    className="operator-except" >
    <div class="operator-except-box">
      从
      <el-select v-model="from" placeholder="请选择人群" v-if="!disabledEdit">
        <el-option
          v-for="item in crowdList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span v-else>{{ getCrowdLabel(from) || '--' }}</span>
      排除
      <el-select v-model="to" placeholder="请选择人群" v-if="!disabledEdit">
        <el-option
          v-for="item in crowdList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span v-else>{{ getCrowdLabel(to) || '--' }}</span>
    </div>
    <!-- <div class="operator-except-box" v-else>
      暂未选择
    </div> -->
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
  mixins: [nodeBaseMixin(NODE_COLLECTION.crowdExcept.name, NODE_COLLECTION.crowdExcept.type, () => ({
    ...NODE_COLLECTION.crowdExcept.data()
  }))],
  props: {
  },
  data () {
    return {
      prevCrowd: [],
      from: null,
      to: null,
    };
  },
  computed: {
    crowdList () {
      return this.prevCrowd;
    },
  },
  mounted () {
    this.getPrevCrowds();
  },
  methods: {
    getCrowdLabel (value) {
      return this.crowdList.find(i => i.value === value).label;
    },
    beforeSubmit () {
      this.preNodeIds = [this.from, this.to].map(crowdId => {
        let crowd = this.prevCrowd.filter(o => o.value === crowdId)[0]
        return crowd ? crowd.id : null;
      });
    },
    getPrevCrowds () {
      let prevLinks = this.nextLinks.getNext(this.id, true);
      let preNodeIds = prevLinks.map(obj => obj.id)
      let prevNodes = this.$store.state.processOn.allNodes.filter(imNode => {
        return preNodeIds.includes(imNode.id)
      })
      this.prevCrowd = prevNodes
      .filter(o => o.formData.crowdId && o.formData.crowdName)
      .map(o => ({
        id: o.id,
        value: o.formData.crowdId, label: o.formData.crowdName}))

      let fromObj = this.prevCrowd.filter(o => o.id === this.preNodeIds[0])[0];
      let toObj = this.prevCrowd.filter(o => o.id === this.preNodeIds[1])[0];

      this.from = fromObj ? fromObj.value : null;
      this.to = toObj ? toObj.value : null;
    },
  },
});

export default Cpt;
</script>

<style lang="css">
@import 'src/assets/styles/var.css';
@b operator-except-box {
  display: flex;
  line-height: 28px;

  .el-select {
    width: 110px;
    margin: auto;
  }
}
</style>
