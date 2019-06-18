<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import moment from 'moment';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';
import cloneDeep from 'lodash/cloneDeep';
import ConditionDialog from './dialogs/ConditionDialog.vue'

const RELATIONSHIPS = {
  any: 0, // 任何条件
  all: 1, // 全部满足
};

function getDays (day) {
  return Number(day) - Number(moment(new Date().getTime()).format('YYYYMMDD'));
}

function setDays (day) {
  return Number(day) + Number(moment(new Date().getTime()).format('YYYYMMDD'));
}
/*
  数据化成利于操作的格式 处理之后的rules
  {
    rulesName: '条件111',
    order: {
      startTime: 1534278427731,
      endTime: 1554298427731,
      startDate: 2,
      endDate: 9,
      mode: 1
    },
    pay: {
      startTime: 1534278427731,
      endTime: 1554298427731,
      startDate: 2,
      endDate: 9,
      mode: 0
    },
    order_amount: {
      low: 110,
      high: 330,
    },
    order_status: null,
    product_rule: {
      type: '',
      values: [],
    },
  }
*/
function setData (obj) {
  const rules = obj.tradeRules.map(r => ({ rulesName: r.rulesName, ...r.rules }));
  const retRules = rules.map(r => {
    const rules = {
      rulesName: '',
      order: {},
      pay: {},
      order_amount: {},
      order_status: null,
      product_rule: {}
    };
    if (r.rulesName) rules.rulesName = r.rulesName;

    if (r.order_date) {
      const orderData = {
        startDate: getDays(r.order_date.startDate),
        endDate: getDays(r.order_date.endDate),
      }
      Object.assign(rules.order, orderData, { mode: 1 });
    }
    if (r.order_time) Object.assign(rules.order, r.order_time, { mode: 0 });
    if (!Object.keys(rules.order).length) rules.order = null;

    if (r.pay_date) {
      const payData = {
        startDate: getDays(r.pay_date.startDate),
        endDate: getDays(r.pay_date.endDate),
      }
      Object.assign(rules.pay, payData, { mode: 1 });
    }
    if (r.pay_time) Object.assign(rules.pay, r.pay_time, { mode: 0 });
    if (!Object.keys(rules.pay).length) rules.pay = null;

    if (r.order_amount) Object.assign(rules.order_amount, r.order_amount);
    else rules.order_amount = null;

    if (r.order_status !== undefined) rules.order_status = 0;
    if (r.product_rule) Object.assign(rules.product_rule, r.product_rule);

    return rules;
  });
  obj.tradeRules = retRules;
  return obj;
}
const isAbsoluteTime = (mode) => mode === 0;

const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(NODE_COLLECTION.orderResponse.name, NODE_COLLECTION.orderResponse.type, () => ({
    ...NODE_COLLECTION.orderResponse.data(),
  }), setData)],
  props: {
  },
  data () {
    return {
      RELATIONSHIPS,

      conditionDialog: {
        display: false,
        setting: null
      },
    };
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    // checkData (arg) {
    //   // 条件不能没有属性
    //   const fTradeRules = arg.tradeRules.filter(i => Object.keys(i).length);
    //   if (!fTradeRules.length) {
    //     this.$message('响应条件不能为空', 'warning');
    //     return false;
    //   }
    //   arg.tradeRules = fTradeRules;
    // },
    isModeAbsolute (mode) { // 是否绝对时间
      return mode === 0;
    },
    getModeLabel (mode) {
      return mode === 0 ? '绝对' : '相对';
    },
    handleOpenDialog (index, isEdit) {
      const c = cloneDeep(this.tradeRules[index]);
      Object.keys(c).forEach(k => {
        if (c[k] && ['order', 'pay'].includes(k)) {
          Object.assign(c[k], {
            startTime: moment(c[k].startTime).format('YYYY-MM-DD'),
            endTime: moment(c[k].endTime).format('YYYY-MM-DD'),
          });
        }
      });
      c.index = index
      Object.assign(this.conditionDialog, {
        display: true,
        setting: isEdit ? c : { rulesName: null, pay: null, order: null, order_amount: null, order_status: null, product_rule: null, index },
      });
    },
    handleAddCondition () {
      this.tradeRules.push({});
    },
    handleDelete (index) {
      this.tradeRules.splice(index, 1);
    },
    handleSubmit (val) {
      const index = val.index;
      if (index === undefined) {
        this.tradeRules.push(val);
      } else {
        delete val.index;
        this.tradeRules[index] = val;
      }
    },
    handleClose () {
      Object.assign(this.conditionDialog, {
        display: false,
        setting: null,
      });
    },
    // 转成原来的格式...
    transformSubmitData () {
      const data = {
        type: this.type,
        relation: this.relation,
        tradeRules: this.tradeRules,
      }
      const rules = data.tradeRules.map(r => {
        const ret = {};
        const name = {};
        if (r.rulesName) name.rulesName = r.rulesName;
        if (r.order && isAbsoluteTime(r.order.mode)) {
          ret.order_time = {
            type: 'time',
            startTime: r.order.startTime,
            endTime: r.order.endTime,
          };
        }
        if (r.pay && isAbsoluteTime(r.pay.mode)) {
          ret.pay_time = {
            type: 'time',
            startTime: r.pay.startTime,
            endTime: r.pay.endTime,
          };
        }
        if (r.order && !isAbsoluteTime(r.order.mode)) {
          ret.order_date = {
            type: 'data',
            startDate: setDays(r.order.startDate),
            endDate: setDays(r.order.endDate),
          };
        }
        if (r.pay && !isAbsoluteTime(r.pay.mode)) {
          ret.pay_date = {
            type: 'data',
            startDate: setDays(r.pay.startDate),
            endDate: setDays(r.pay.endDate),
          };
        }
        if (r.order_amount) {
          ret.order_amount = {};
          ret.order_amount.low = r.order_amount.low;
          ret.order_amount.high = r.order_amount.high;
          ret.order_amount.type = 'long';
        }
        if (r.order_status) {
          ret.order_status = {};
          ret.order_status.values = r.order_status.values;
          ret.order_status.type = 'enum';
        }
        if (r.product_rule) {
          ret.product_rule = {};
          ret.product_rule.values = r.product_rule.values;
          ret.product_rule.type = 'complex_enum';
        }

        return {
          ...name,
          rules: ret,
        }
      });
      data.tradeRules = rules;

      return cloneDeep(data);
    },
  },
  components: {
    ConditionDialog,
  },
});

export default Cpt;
</script>

<template lang="html">
  <NodeBase
    :nodeName="name"
    className="response-order" >
    <div class="response-order-wrapper"></div>
      <p class="node-label-sub">条件关系：</p>
      <div class="response-order__mode">
        <span v-if="!disabledEdit">
          <el-radio v-model="relation" :label="RELATIONSHIPS.any">满足下列任一条件</el-radio>
          <el-radio v-model="relation" :label="RELATIONSHIPS.all">满足下列全部条件</el-radio>
        </span>
        <span v-else>{{ relation === 0 ? '满足下列任一条件' : '满足下列全部条件' }}</span>
      </div>

      <div class="condition-wrapper" v-if="tradeRules.length">
        <div
          class="response-order__condition"
          v-for="(item, index) in tradeRules"
          :key="index"
        >
          <div class="response-order__condition--header">
            <span class="title">条件 {{ index + 1 }}</span>
            <span class="operate" v-if="!disabledEdit">
              <span
                v-if="Object.values(item).filter(i => i).length"
                @click="handleOpenDialog(index, true)"
              >编辑</span>
              <span
                v-else
                @click="handleOpenDialog(index, false)"
              >设置条件</span>

              <span
                v-if="tradeRules.length > 1"
                @click="handleDelete(index)"
              >删除</span>
            </span>
          </div>

          <div class="content-wrapper">
            <div class="response-order__condition--content" v-if="Object.keys(item).length">
              <p v-if="item.rulesName">条件名称：{{ item.rulesName }}</p>

              <p v-if="item.order &&  isModeAbsolute(item.order.mode) && [item.order.startTime, item.order.endTime].every(i => i)">
                下单时间：{{ getModeLabel(item.order.mode) }} {{ item.order.startTime | formatTime('YYYY/MM/DD') }} - {{ item.order.endTime | formatTime('YYYY/MM/DD') }}
              </p>
              <p v-if="item.order &&  !isModeAbsolute(item.order.mode) && [item.order.startDate, item.order.endDate].every(i => i)">
                下单时间：{{ getModeLabel(item.order.mode) }} 距今天 {{ item.order.startDate }} - {{ item.order.endDate }} 天
              </p>

              <p v-if="item.pay &&  isModeAbsolute(item.pay.mode) && [item.pay.startTime, item.pay.endTime].every(i => i)">
                付款时间：{{ getModeLabel(item.pay.mode) }} {{ item.pay.startTime | formatTime('YYYY/MM/DD') }} - {{ item.pay.endTime | formatTime('YYYY/MM/DD') }}
              </p>
              <p v-if="item.pay &&  !isModeAbsolute(item.pay.mode) && [item.pay.startDate, item.pay.endDate].every(i => i)">
                付款时间：{{ getModeLabel(item.pay.mode) }} 距今天 {{ item.pay.startDate }} - {{ item.pay.endDate }} 天
              </p>

              <p v-if="item.order_amount">
                订单金额：{{ item.order_amount.low + '-' + item.order_amount.high }}
              </p>

              <p v-if="item.order_status !== null">订单状态：{{ item.order_status ? '交易成功' : '交易失败' }}</p>

              <p v-if="item.product_rule && item.product_rule.values">
                订单状态：{{ item.product_rule.values && `已选择${item.product_rule.values.length}件商品` }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="response-order__select-area" @click="handleAddCondition" v-if="!disabledEdit">
        +新增条件
      </div>

      <ConditionDialog
        v-model="conditionDialog.display"
        @submit="handleSubmit"
        @close="handleClose"
        :setting="conditionDialog.setting"
      />
    </div>
  </NodeBase>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';

@b response-order {
  @e condition {
    padding: 12px 16px;
		border-radius: 4px;
		background-color: #f5f9ff;
		font-size: 12px;
		margin: 8px 0;

    @m header {
      display: flex;
			align-items: center;
			justify-content: space-between;

      .title {
        color: rgba(155, 155, 155, 1);
      }

      .operate {
        >span {
          color: #2f89dc;
			    cursor: pointer;
        }
      }
    }

    @m content {
      margin-top: 16px;
      p {
        margin: 6px 0;
      }
    }
  }

  @e select-area {
    border: 1px dashed var(--dark-border-color);
    border-radius: 4px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
    margin-top: 16px;
    cursor: pointer;

    &:hover {
      border-color: #999fa5;
    }
  }

  @e mode {
    .el-radio__label {
      font-size: 12px;
      color: var(--text-color);
    }
  }
}
</style>
