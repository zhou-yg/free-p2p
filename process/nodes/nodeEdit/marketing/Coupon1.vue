<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';
import CouponDialog from '../../../../cpts/CouponDialog.vue';
import CouponCard from '../../../../cpts/CouponCard.vue';

const COUPON_INFO = [
  { 
    label: '发送会员',
    valueKey: 'memberCount',
  },
  {
    label: '成功人数',
    valueKey: 'successCount',
  },
  {
    label: '未使用人数',
    valueKey: 'couponUnUseCount',
  },
  {
    label: '使用中人数',
    valueKey: 'couponUsingCount',
  },
  {
    label: '已使用人数',
    valueKey: 'couponUsedCount',
  },
]

const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(NODE_COLLECTION.coupon.name, NODE_COLLECTION.coupon.type, () => ({
    ...NODE_COLLECTION.coupon.data(),
  }))],
  props: {
  },
  data () {
    return {
      COUPON_INFO,

      detail: null,
      isTipShow: true,
      isDialogShow: false,
      remainCouponQuota: 0,
      isLoading: false,

      memberCount: '',
      successCount: '',
      couponUnUseCount: '',
      couponUsingCount: '',
      couponUsedCount: '',
    };
  },
  watch: {
    couponId (val) {
      if (val) {
        this.getCouponDetail(val);
      }
    },
  },
  computed: {
    setting () {
      return { uuid: this.couponId }
    },
  },
  mounted () {
    this.fetchAmount();
    if (this.couponId) {
      if (this.disabledEdit) this.getMessageInfo();

      this.getCouponDetail(this.couponId);
    }
  },
  methods: {
    getMessageInfo () {
      this.$api.ecrm.activity.nodeInstStatusByNodeId({
        activityId: this.$route.query.aid,
        nodeId: this.id,
      }).then(res => {
        Object.assign(this, res.data);
      }).catch(e => {
        console.log(e);
      });
    },
    async fetchAmount () {
      try {
        const res = await this.$api.ecrm.coupon.queryCouponQuotaInfo();
        if (res.success) {
          this.remainCouponQuota = res.data.remainCouponQuota;
        } else {
          throw res.message;
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    getCouponDetail (couponId) {
      this.isLoading = true;
      this.$store.dispatch('getCouponDetail', {uuid: this.couponId}).then((res) => {
        this.isLoading = false;
        if (res && res.length > 0) {
          this.detail = {
            ...res[0],
            amount: res[0].amount / 100,
          };
        }
      });
    },
    handleTipClose () {
      this.isTipShow = false;
    },
    handleSelect (val) {
      this.couponId = val.uuid
    },
    openDialog () {
      this.isDialogShow = true;
    },
    getCouponCount (k) {
      return this[k] || '--';
    }
  },
  components: {
    CouponDialog,
    CouponCard,
  },
});

export default Cpt;
</script>

<template lang="html">
  <NodeBase
    :nodeName="name"
    className="marketing-coupon" >
    <div v-loading="isLoading">
      <div>
        <div class="node-label-sub marketing-coupon__setting">
          <span>
            优惠券设置：
          </span>
          <span
            v-if="detail && !disabledEdit"
            class="reselect"
            @click="openDialog"
          >重新选择</span>
        </div>

        <div
          v-if="detail && !disabledEdit"
          class="marketing-coupon__card"
        >
          <CouponCard :data="detail" />
          <div class="coupon-text">优惠券剩余额度：<em>{{ remainCouponQuota }}张</em></div>
        </div>
        <div v-if="!detail && disabledEdit" style="margin-bottom: 8px">未选择</div>

        <div v-if="detail && disabledEdit" style="margin-bottom: 8px">
          <div class="marketing-coupon__info">
            <el-col
              v-for="c in COUPON_INFO"
              :key="c.key"
              :span="8"
            >
              <p>{{ c.label }}</p>
              <span>{{ getCouponCount(c.valueKey) }}</span>
            </el-col>
          </div>

          <p class="node-label-sub">优惠券：</p>
          <span>{{ this.detail.title }}</span>
        </div>

        <div
          v-if="!detail && !disabledEdit"
          class="coupon-wrapper"
          style="margin-bottom: 16px"
        >
          <p class="marketing-coupon__tip" v-if="isTipShow">
            <i class="el-icon-information"></i>
            <i class="el-icon-close" @click="handleTipClose"></i>
            请根据人群规模设定优惠券数量，优惠券每天发送总量为50000张。
          </p>

          <div class="marketing-coupon__select-area" @click="openDialog">
            选择优惠券
          </div>
        </div>
      </div>
    </div>

    <div class="sms-test">
      <p class="node-label-sub">
        测试旺旺：
      </p>
      <el-input v-model="testWw" v-if="!disabledEdit"/>
      <span v-else>{{ testWw }}</span>
    </div>

    <coupon-dialog
      v-model="isDialogShow"
      :current-data="setting"
      @submit="handleSelect"
    />
    </el-dialog>
  </NodeBase>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';

@b marketing-coupon {
  @e setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;

    .reselect {
      color: #2f89dc;
      cursor: pointer;
    }
  }

  @e info {
    height: 136px;
    border-radius: 4px;
    background-color: #f5f9ff;
    padding: 18px 0;
    box-sizing: border-box;
    margin-bottom: 8px;

    p {
      font-size: 12px;
      margin-bottom: 8px;
      color: #666;
    }

    .el-col {
      text-align: center;
      margin: 4px 0;
    }
  }

  @e tip {
    position: relative;
    height: 64px;
    border-radius: 4px;
    border: solid 1px #91d5ff;
    background-color: #e6f7ff;
    font-size: 12px;
    padding: 8px 38px;
    line-height: 1.8;
    box-sizing: border-box;
    margin-bottom: 16px;

    .el-icon-information {
      position: absolute;
      top: 14px;
      left: 16px;
      font-size: 14px;
      color: var(--theme-color);
    }

    .el-icon-close {
      position: absolute;
      top: 14px;
      right: 16px;
      color: rgba(155, 155, 155, 1);
      cursor: pointer;
    }
  }

  @e card {
    margin: 8px 0;

    .coupon-text {
      font-size: 12px;
      color: rgba(155, 155, 155, 1);
      margin: 16px 0;

      >em {
        font-style: normal;
        color: #444444;
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
    cursor: pointer;

    &:hover {
      border-color: #999fa5;
    }
  }
}
</style>
