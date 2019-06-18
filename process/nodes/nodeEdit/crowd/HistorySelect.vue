<template lang="html">
  <NodeBase
    :nodeName="name"
    className="crowd-select-top2">
    <div class="crowd-select" v-if="!disabledEdit">
      <div class="form-item" v-if="!crowdName" >
        <div class="crowd-select-btn"  @click="startSelect">
          +添加活动
        </div>
      </div>
      <div class="crowd-select-result" v-if="crowdName" >
        <div class="result-title">
          营销活动：

          <span class="fr" @click="startSelect">
            更换活动
          </span>
        </div>
        <div class="result-crowd">
          {{crowdName}}
        </div>
        <div class="result-select">
          <el-select v-model="mode" >
            <el-option
              v-for="obj in options"
              :value="obj.value"
              :key="obj.label"
              :label="obj.label"
              ></el-option>
          </el-select>
        </div>
      </div>

      <el-dialog
        title="选择历史发送记录"
        v-model="isShowCrowdPool" >
        <market-dialog
          v-model="isShowCrowdPool"
          @submit="setCrowd"
          ></market-dialog>
      </el-dialog>
    </div>

    <div v-else class="crowd-select">
      <div class="crowd-select-result" v-if="crowdName" >
        <div class="result-title">
          营销活动：
        </div>
        <div class="result-crowd">
          {{crowdName}}
        </div>
        <div class="result-select">
          {{ selectedCrowdLabel }}
        </div>
      </div>
    </div>
  </NodeBase>
</template>
<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import NodeBase from '../../NodeBase.vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import MarketDialog from 'cc/components/marketing/cpts/MarketDialog.vue';

import CrowdPool from 'cc/components/crowd/pool/main.vue';
import Enumerator from 'src/tools/vueFilter/enumerator-format.js';
import DateTimeFormat from 'src/tools/vueFilter/date-time-format.js';

import {NODE_COLLECTION} from '../../../data';

const Cpt = Vue.extend({
  components: {
    NodeBase,
    CrowdPool,
    MarketDialog,
  },
  mixins: [nodeBaseMixin(
    NODE_COLLECTION.historyCrowd.name,
    NODE_COLLECTION.historyCrowd.type, () => {
    return {
      ...NODE_COLLECTION.historyCrowd.data(),
    };
  })],
  props: {
  },
  data () {
    return {
      isShowCrowdPool: false,

      data: {
      },
      options: [],
    };
  },
  computed: {
    selectedCrowdLabel () {
      return this.options[this.mode] ? this.options[this.mode].label : '暂未选择';
    }
  },
  mounted () {
    this.getDetail();
  },
  methods: {
    async getDetail () {
      if (this.lastActivity) {
        let res = await this.$apiAuto.ecrm.activity.getSecondMarketCrowdDetail({
          actId: this.lastActivity,
          crowdInstId: this.crowdInstId,
        });
        this.setOptions(res);
      }
    },
    startSelect () {
      this.isShowCrowdPool = true;
    },
    setOptions (data) {
      this.data = data;
      this.options = [
        `全部客户(${data.crowdUv || 0})`,
        `未下单客户(${data.crowdUv - data.ordUv})`,
        `付款客户(${data.payUv})`,
        `下单客户(${data.ordUv})`,
        `下单未付款客户(${data.ordUv - data.payUv})`,
      ].map((v, i) => {
        return { value: i, label: v };
      });
    },
    setCrowd (v) {
      this.lastActivity = v.actId;
      this.crowdInstId = v.crowdInstId;
      this.crowdName = v.actName;
      // this.type = v.crowdType;
      this.setOptions(v);
    },
  },
});

export default Cpt;
</script>

<style lang="css">
@b crowd-select-btn {
  border: 1px dashed #d9d9d9;
  line-height: 28px;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;

  &:hover {
    border-color: #2f89dc;
    cursor: pointer;
  }
}
@b crowd-select-result {
  background-color: #f5f9ff;
  padding: 16px;
  font-size: 12px;
  .result-title {
    color: #666666;
    line-height: 20px;
    margin-bottom: 8px;

    .fr{
      color: #2f89dc;
      cursor: pointer;
    }
  }
  .result-row {
    color: #333;
    line-height: 20px;
  }
  .result-crowd {
    color: #212121;
    margin: 16px 0 8px;
  }
  .result-select {
    > .el-select {
      width: 100%;
    }
  }
}
@b crowd-select-top2{
  .el-dialog__body {
  }
}
</style>
