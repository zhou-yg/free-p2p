<template>
  <div class="node-form-setting" v-if="isShow">
    <component
      ref="nb"
      v-bind:is="currentComponent"
      v-bind="componentData"
      @submit="submit"
      :disabledEdit="disabledEdit"
      @hide="hidden" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import ApiGet from './nodes/nodeEdit/ApiGet.vue'
import SmsTemp from './nodes/nodeEdit/SmsTemp.vue'
import WechatMsg from './nodes/nodeEdit/WechatMsg.vue'
import UserGuide from './nodes/nodeEdit/UserGuide.vue'
import {NODE_COLLECTION} from './data'

const m = {
  [NODE_COLLECTION.InitialState.type]: ApiGet,
  [NODE_COLLECTION.SendSmsMessage.type]: SmsTemp,
  [NODE_COLLECTION.SendWechatMessage.type]: WechatMsg,
  'userGuide': UserGuide
}

export default {
  name: '',
  components: {

  },
  props: {
    disabledEdit: Boolean
  },
  data () {
    return {
      isShow: false,
      componentData: {},
      currentComponent: null
    }
  },
  mounted () {

  },
  computed: {

  },
  methods: {
    triggerSubmit () {
      this.$refs.nb.submit()
    },
    submit (formData) {
      console.log(`nfs`, formData)
      this.$emit('submit', {
        id: this.componentData.id,
        type: this.componentData.type,
        formData
      })
    },
    openUserGuide () {
      this.currentComponent = m.userGuide

      this.isShow = !!this.currentComponent
    },
    openDialog (id, type, formData) {
      this.componentData = {
        formData: cloneDeep(formData),
        id,
        type
      }
      this.currentComponent = m[type]

      this.isShow = !!this.currentComponent
    },
    hidden () {
      this.isShow = false
      // this.openUserGuide()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less"  scoped>
.node-form-setting {
  background-color: #fff;
  width: 309px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2;

  box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.24);
}
</style>
