<script type="text/babel">
/**
 * Created by caoyi.
 */
import Vue from 'vue';
import WkDialog from 'src/components/BasicCpt/WkDialog.vue';
import Period from 'src/components/BasicCpt/Period.vue';
import TradeSelect from 'src/components/MemberMarketing/TradeSelect.vue';
import cloneDeep from 'lodash/cloneDeep';
import api from 'src/tools/api/';

const CATEGROIES = {
  order: 'order',
  pay: 'pay',
  order_amount: 'order_amount',
  order_status: 'order_status',
  product_rule: 'product_rule',
};
const CATEGROY_MAP = {
  [CATEGROIES.pay]: '付款时间',
  [CATEGROIES.order]: '下单时间',
  [CATEGROIES.order_amount]: '付款金额',
  [CATEGROIES.order_status]: '订单状态',
  [CATEGROIES.product_rule]: '商品信息',
};

const Cpt = Vue.extend({
  props: {
    value: Boolean,
    setting: {
      type: Object,
      default: () => null,
    },
  },
  data () {
    return {
      api,

      CATEGROIES,
      CATEGROY_MAP,
      // 已选择的条件
      selectedCondition: cloneDeep(CATEGROIES),
      visible: false,
    }
  },
  computed: {
    // 未选择的条件
    unselectCondition () {
      const ret = {};
      Object.keys(CATEGROY_MAP).forEach(k => {
        if (this.setting[k] === null) ret[k] = CATEGROY_MAP[k];
      });
      return ret;
    },
  },
  watch: {
    setting (val) {
      if (val) {
        this.updateSelectedCondition();
      }
    },
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  methods: {
    submit () {
      const s = cloneDeep(this.setting);
      const errorText = this.checkData(s);

      if (errorText) {
        this.$message.error(errorText);
        return;
      }
      this.$emit('submit', s);
      this.close();
    },
    checkData (s) {
      let errorText;

      for (let k in s) {
        // 检查是否输入为数字
        if ((s[k] !== null) && k === CATEGROIES.order_amount) {
          if ([s.order_amount.low, s.order_amount.high].some(i => i === '')) return '请将下单金额填写完整';
          if ([s.order_amount.low, s.order_amount.high].some(i => isNaN(i))) return '下单金额必须为数字';

          s[k].low = Number(s[k].low);
          s[k].high = Number(s[k].high);

          if (s[k].low  > s[k].high) return '设定的下单金额必须是升序的';
        }
        // 检查处理时间
        if ((s[k] !== null) && [CATEGROIES.pay, CATEGROIES.order].includes(k)) {
          if (
            [s[k].startTime, s[k].endTime].some(i => !i) &&
            [s[k].startDate, s[k].endDate].some(i => !i)
          ) {
            return '请将时间输入完整'
          }
        }
      }
      
      return errorText;
    },
    close () {
      this.$emit('close');
    },
     handleAddCondition () {
      const unselectKeyFirst = Object.keys(this.unselectCondition)[0];
      
      if (unselectKeyFirst === CATEGROIES.order_status) this.setting[unselectKeyFirst] = 1;
      else this.setting[unselectKeyFirst] = {};

      this.updateSelectedCondition();
    },
    // 改变头选项后变更settin、SelectedCondition、unselectCondition
    handleChange (newKey, oldKey) {
      this.setting[oldKey] = null;

      if (newKey === CATEGROIES.order_status) this.setting[newKey] = 1;
      else this.setting[newKey] = {};

      this.updateSelectedCondition();
    },
    handleClose () {
      this.visible = false;
    },
    setData (val) {
      this.setting.product_rule = {};
      this.setting.product_rule.values = val;
    },
    handleItemDelete (key) {
      this.setting[key] = null;
      this.updateSelectedCondition();
    },
    // 更新已选择条件
    updateSelectedCondition () {
      Object.keys(CATEGROY_MAP).forEach(k => {
        if (this.setting[k] === null) this.selectedCondition[k] = null;
        else this.selectedCondition[k] = CATEGROY_MAP[k];
      });
    },
    changePeroidTime (type, time) {
      Object.assign(this.setting[type], time);
    },
    changeRelative (type, k, v) {
      
    },
    selectGoods () {
      this.visible = true;
    },
  },
  components: {
    WkDialog,
    Period,
    TradeSelect,
  },
});

export default Cpt;
</script>

<template lang="html">
  <wk-dialog
    :value="value"
    title="设置条件内容"
    @submit="submit"
    @close="close"
    custom-class="response-dialog"
  >
    <div class="condition-container" v-if="setting">
      <div
        v-for="value, label in setting" :key="label"
        class="condition-item-wrapper"
      >
        <div class="condition-item" v-if="label === 'rulesName'">
          <div class="condition-item__pre">条件名称：</div>
          <el-input v-model="setting.rulesName"></el-input>
        </div>

        <div class="condition-item" v-if="label === CATEGROIES.order && setting.order">
          <el-select v-model="selectedCondition[label]" @change="key => handleChange(key, label)">
            <el-option
              v-for="label, key in unselectCondition"
              :key="key"
              :label="label"
              :value="key"
            ></el-option>
          </el-select>

          <el-select v-model="setting.order.mode">
            <el-option label="绝对时间" :value="0"></el-option>
            <el-option label="相对时间" :value="1"></el-option>
          </el-select>

          <period
            v-if="setting.order.mode === 0"
            :start="setting.order.startTime"
            :end="setting.order.endTime"
            @input="v => changePeroidTime('order', v)"
          />
          <span v-if="setting.order.mode === 1" class="relative-time">
            距离今天&nbsp;&nbsp;<span><el-input v-model="setting.order.startDate" @input="(v) => changeRelative('order', 'start', v)" /></span>天~&nbsp;&nbsp;<span><el-input v-model="setting.order.endDate" @input="(v) => changeRelative('order', 'end', v)" /></span>天
          </span>

          <i
            class="el-icon-delete2"
            style="position: absolute"
            @click="handleItemDelete(label)"
          ></i>
        </div>

         <div class="condition-item" v-if="label === CATEGROIES.pay && setting.pay">
          <el-select v-model="selectedCondition[label]" @change="key => handleChange(key, label)">
            <el-option
              v-for="label, key in unselectCondition"
              :key="key"
              :label="label"
              :value="key"
            ></el-option>
          </el-select>

          <el-select v-model="setting.pay.mode">
            <el-option label="绝对时间" :value="0"></el-option>
            <el-option label="相对时间" :value="1"></el-option>
          </el-select>

          <period
            v-if="setting.pay.mode === 0"
            :start="setting.pay.startTime"
            :end="setting.pay.endTime"
            @input="v => changePeroidTime('pay', v)"
          />
          <span v-if="setting.pay.mode === 1" class="relative-time">
            距离今天&nbsp;&nbsp;<span><el-input v-model="setting.pay.startDate" @input="(v) => changeRelative('pay', 'start', v)" /></span>天~&nbsp;&nbsp;<span><el-input v-model="setting.pay.endDate" @input="(v) => changeRelative('order', 'end', v)" /></span>天
          </span>

          <i
            class="el-icon-delete2"
            style="position: absolute"
            @click="handleItemDelete(label)"
          ></i>
        </div>

        <div class="condition-item" v-if="label === CATEGROIES.order_status && setting.order_status !== null">
          <el-select v-model="selectedCondition[label]" @change="key => handleChange(key, label)">
            <el-option
              v-for="label, key in unselectCondition"
              :key="key"
              :label="label"
              :value="key"
            ></el-option>
          </el-select>

          <el-radio v-model="setting.order_status" :label="1">交易成功</el-radio>
          <el-radio v-model="setting.order_status" :label="0">交易失败</el-radio>

          <i
            class="el-icon-delete2"
            style="position: absolute"
            @click="handleItemDelete(label)"
          ></i>
        </div>

        <div class="condition-item" v-if="label === CATEGROIES.order_amount && setting.order_amount">
          <el-select v-model="selectedCondition[label]" @change="key => handleChange(key, label)">
            <el-option
              v-for="label, key in unselectCondition"
              :key="key"
              :label="label"
              :value="key"
            ></el-option>
          </el-select>

          <el-input v-model="setting.order_amount.low"></el-input>
          <el-input v-model="setting.order_amount.high"></el-input>

          <i
            class="el-icon-delete2"
            style="position: absolute"
            @click="handleItemDelete(label)"
          ></i>
        </div>

        <div class="condition-item" v-if="label === CATEGROIES.product_rule && setting.product_rule">
          <el-select v-model="selectedCondition[label]" @change="key => handleChange(key, label)">
            <el-option
              v-for="label, key in unselectCondition"
              :key="key"
              :label="label"
              :value="key"
            ></el-option>
          </el-select>

          已选择 {{ setting.product_rule.values ? setting.product_rule.values.length : 0 }} 件商品
          <span class="select-goods" @click="selectGoods">选择商品</span>

          <i
            class="el-icon-delete2"
            style="position: absolute"
            @click="handleItemDelete(label)"
          ></i>
        </div>
      </div>

      <el-button
        class="add-condition-btn"
        v-if="Object.keys(unselectCondition).length"
        @click="handleAddCondition"
      >添加条件</el-button>
    </div>

    <TradeSelect
      :value="visible"
      @input="handleClose"
      @change="setData"
      :p="api.ecrm.items.products"
      :c="api.ecrm.items.cats"
    />
  </wk-dialog>
</template>

<style lang="css">
@b response-dialog {
  > .el-dialog__body{
    width: 620px;
  }

  .condition-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 12px 0;

    &:hover {
      background-color: #f6faff;

      .el-icon-delete2 { display: inline } 
    }

    .el-icon-delete2 {
      display: none;
      position: absolete;
      right: 8px;
      font-size: 16px;
      cursor: pointer;
      color: rgba(155, 155, 155, 1);
      
      &:hover {
        color: #2f89dc;
      }
    }

    .relative-time {
      display: flex;
      align-items: center;
    }

    .el-select, .el-input {
      margin-right: 8px;
      width: 100px;
    }

    .select-goods {
      margin-left: 8px;
      color: #2f89dc;
    }
    
    .condition-item__pre {
      width: 70px;
    }
  }

  .add-condition-btn {
    margin-top: 8px;
  }
}
</style>
