<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';

const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(NODE_COLLECTION.dealResponse.name, NODE_COLLECTION.dealResponse.type, () => ({
    ...NODE_COLLECTION.dealResponse.data()
  }))],
  props: {
  },
  data () {
    return {
      selectList: {
        r_cartPeriod: false,
        r_collectPeriod: false,
        r_viewPeriod: false,
      }
    };
  },
  computed: {
  },
  watch: {
    selectList (val) {
      setRules();
    },
  },
  mounted () {
    this.setRules();
  },
  methods: {
    setRules () {
      for (const k in this.selectList) {
        if (this.rules[k] !== undefined) this.selectList[k] = true;
        else this.$set(this.rules, k, true);
      }
    },
    beforeSubmit () {
      console.log(this.num);
      if (this.num) this.num = parseInt(Number(this.num));
      for (const k in this.selectList) {
        if (!this.selectList[k]) delete this.rules[k];
      }
    }
  },
});

export default Cpt;
</script>

<template lang="html">
  <NodeBase
    :nodeName="name"
    className="deal-response" >
    <p class="node-label-sub">统计时间（天）：</p>
    <el-input v-model="num" v-if="!disabledEdit"/>
    <span v-else>{{ num }}</span>

    <div class="deal-response__mode">
      <span v-if="!disabledEdit">
        <el-radio v-model="r_tradePeriod" :label="true">有成交人群</el-radio>
        <el-radio v-model="r_tradePeriod" :label="false">无成交人群</el-radio>
      </span>
      <span v-else>{{ r_tradePeriod ? '有成交人群' : '无成交人群' }}</span>
    </div>

    <div class="deal-response__shop">
      <div class="deal-response__shop--item"  v-if="!disabledEdit">
        <el-checkbox v-model="selectList.r_cartPeriod">店铺有无访问</el-checkbox>
        <span v-if="selectList.r_cartPeriod">
          <el-radio v-model="rules.r_cartPeriod" :label="true">有</el-radio>
          <el-radio v-model="rules.r_cartPeriod" :label="false">无</el-radio>
        </span>
      </div>
      <div class="deal-response__shop--item" v-else>
        <p v-if="selectList.r_cartPeriod">店铺{{ rules.r_cartPeriod ? '有' : '无' }}访问</p>
      </div>

      <div class="deal-response__shop--item" v-if="!disabledEdit">
        <el-checkbox v-model="selectList.r_collectPeriod">店铺有无收藏</el-checkbox>
        <span v-if="selectList.r_collectPeriod">
          <el-radio v-model="rules.r_collectPeriod" :label="true">有</el-radio>
          <el-radio v-model="rules.r_collectPeriod" :label="false">无</el-radio>
        </span>
      </div>
      <div class="deal-response__shop--item" v-else>
        <p v-if="selectList.r_collectPeriod">店铺{{ rules.r_collectPeriod ? '有' : '无' }}收藏</p>
      </div>

      <div class="deal-response__shop--item" v-if="!disabledEdit">
        <el-checkbox v-model="selectList.r_viewPeriod">店铺有无加购</el-checkbox>
        <span v-if="selectList.r_viewPeriod">
          <el-radio v-model="rules.r_viewPeriod" :label="true">有</el-radio>
          <el-radio v-model="rules.r_viewPeriod" :label="false">无</el-radio>
        </span>
      </div>
      <div class="deal-response__shop--item" v-else>
        <p v-if="selectList.r_viewPeriod">店铺{{ rules.r_viewPeriod ? '有' : '无' }}加购</p>
      </div>
    </div>
  </NodeBase>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';

@b deal-response {
  @e mode {
    margin-top: 16px;
  }

  @e shop {
    display: flex;
    flex-direction: column;
    height: 124px;
    justify-content: space-around;
    margin-top: 16px;
    padding: 16px;
    background-color: #f5f9ff;
    border: none;
    border-radius: 4px;

    @m item {
      display: flex;
      justify-content: space-between;

      .el-radio+.el-radio {
        margin-left: 16px;
      }
    }

    .el-checkbox {
      margin-left: 0;
    }
  }
}
</style>
