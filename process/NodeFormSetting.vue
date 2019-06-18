<template>
  <div class="node-form-setting" v-if="isShow" @click="$emit('click')">
    <component
      v-bind:is="currentComponent"
      v-bind="componentData"
      :disabledEdit="disabledEdit"
      @submit="submit"
      @delSubmit="delSubmit"/>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

import CrowdSelect from './nodes/nodeEdit/crowd/Select.vue';
import HistoryCrowdSelect from './nodes/nodeEdit/crowd/HistorySelect.vue';
import Wait from './nodes/nodeEdit/process/Wait.vue';
import CrowdUnion from './nodes/nodeEdit/operator/Union.vue';
import Integral from './nodes/nodeEdit/operator/Integral.vue';
import ActiveEffect from './nodes/nodeEdit/operator/ActiveEffect.vue';
import SaveAsCrowd from './nodes/nodeEdit/crowd/SaveAsCrowd.vue';
import SendResponse from './nodes/nodeEdit/response/SendResponse.vue';
import DealResponse from './nodes/nodeEdit/response/DealResponse.vue';
import OrderResponse from './nodes/nodeEdit/response/OrderResponse.vue';
import Coupon1 from './nodes/nodeEdit/marketing/Coupon1.vue';
import Message1 from './nodes/nodeEdit/marketing/Message1.vue';
import CrowdIntersect from './nodes/nodeEdit/operator/Intersect.vue';
import CrowdExcept from './nodes/nodeEdit/operator/Except.vue';
import CrowdExtract from './nodes/nodeEdit/operator/Extract.vue';
import CrowdUniq from './nodes/nodeEdit/operator/Uniq.vue';

import {NODE_COLLECTION} from './data';
import checkNodeData from './svg/checkNodeData'

const m = {
  [NODE_COLLECTION.crowd.type]: CrowdSelect,
  [NODE_COLLECTION.historyCrowd.type]: HistoryCrowdSelect,

  [NODE_COLLECTION.crowdUnion.type]: CrowdUnion,
  [NODE_COLLECTION.intergral.type]: Integral,
  [NODE_COLLECTION.effect.type]: ActiveEffect,
  [NODE_COLLECTION.saveAsCrowd.type]: SaveAsCrowd,
  [NODE_COLLECTION.sendResponse.type]: SendResponse,
  [NODE_COLLECTION.dealResponse.type]: DealResponse,
  [NODE_COLLECTION.orderResponse.type]: OrderResponse,
  [NODE_COLLECTION.coupon.type]: Coupon1,
  [NODE_COLLECTION.sms.type]: Message1,

  [NODE_COLLECTION.crowdExcept.type]: CrowdExcept,
  [NODE_COLLECTION.crowdIntersect.type]: CrowdIntersect,
  [NODE_COLLECTION.crowdExtract.type]: CrowdExtract,
  [NODE_COLLECTION.crowdUniq.type]: CrowdUniq,
  [NODE_COLLECTION.wait.type]: Wait,
};

export default {
  name: '',
  props: {
    disabledEdit: Boolean,
  },
  components: {

  },
  data () {
    return {
      isShow: false,
      componentData: {},
      currentComponent: null,
    }
  },
  mounted () {

  },
  computed: {

  },
  methods: {
    delSubmit () {
      this.$emit('delSubmit', {
        id: this.componentData.id,
        type: this.componentData.type,
      });
      this.hidden();
    },
    submit (formData) {
      const errorText = checkNodeData(this.componentData.type, formData);
      if (errorText) {
        this.$alert(errorText, '错误', { type: 'error' });
        return;
      }

      this.$emit('submit', {
        id: this.componentData.id,
        type: this.componentData.type,
        formData,
      });

      this.hidden();
    },
    openUserGuide () {
      this.currentComponent = m.userGuide

      this.isShow = !!this.currentComponent
    },
    openDialog (id, type, formData, nextLinks) {
      // @TODO 前期本地开发模式下
      this.currentComponent = null;

      this.$nextTick(() => {
        this.componentData = {
          formData: cloneDeep(formData),
          id,
          type,
          nextLinks,
        };
        this.currentComponent = m[type];

        this.isShow = !!this.currentComponent;
      });
    },
    hidden () {
      this.isShow = false;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
.node-form-setting {
  position: absolute;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
  top: 8px;
  /* bottom: 8px; */
  max-height: 100%;
  overflow: auto;
  /* margin:auto; */
  right: 8px;
  z-index: 2;
  /* border-radius: 4px; */
}
</style>
