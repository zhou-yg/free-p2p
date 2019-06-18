<template lang="html">
  <NodeBase
    :nodeName="name"
    className="process-wait" >

    <div class="process-wait-content" v-if="!disabledEdit">
      <p>
        <el-radio-group v-model="mode">
          <el-radio :label="0">等待至指定日期</el-radio>
          <el-radio :label="1">等待时间天数</el-radio>
        </el-radio-group>
      </p>
      <div v-if="mode === 0" class="time1">
        <el-date-picker
          type="datetime"
          :value="timeDate" @input="changeTime"  />
      </div>
      <div v-if="mode === 1" class="time2">
        <div class="days">
          <el-input type="number" :value="waitDays" @input="changeWaitDays"/>
        </div>
        <span class="unit">天</span>
        <el-time-picker type="time"
          :value="timeDate" @input="changeTime" />
      </div>
    </div>
    <div v-else class="process-wait-content">
      <p class="node-label-sub">
        {{ mode === 0 ? `等待至指定日期：${getData(time)}` : `等待时间天数${waitDays}天` }}
      </p>
    </div>
  </NodeBase>
</template>
<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';
import moment from 'moment';

const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(NODE_COLLECTION.wait.name, NODE_COLLECTION.wait.type, () => ({
    ...NODE_COLLECTION.wait.data()
  }))],
  props: {
  },
  data () {
    return {
    };
  },
  computed: {
    timeDate () {
      return this.time ? new Date(this.time) : '';
    },
  },
  mounted () {
    this.$nextTick(() => {

    });
  },
  methods: {
    changeWaitDays (v) {
      if (!v) {
        v = 0;
      }
      this.waitDays = Math.abs(parseInt(v));
    },
    changeTime (dateObj) {
      if (!dateObj) this.time = null
      else this.time = dateObj.getTime();
    },
    getData () {
      return moment(this.time).format('YYYY-MM-DD');
    },
  },
});

export default Cpt;
</script>

<style lang="css">
@import 'src/assets/styles/var.css';
@b process-wait {

}
@b process-wait-content {
  .time1,.time2 {
    margin-top: 8px;
    display: flex;

  }
  .time1 {
    .el-date-editor-top {
      flex: 1;
      .next-date-picker-medium {
        width: 100%;
      }
    }
  }
  .time2 {
    .days {
    }
    .unit {
      margin: 0 8px;
      line-height: 28px;
    }
  }
}
</style>
