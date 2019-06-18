<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
const Cpt = Vue.extend({
  props: {
    value: {},
    placeholder: {},
    size: {},
    maxLen: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      inputValue: this.value
    }
  },
  watch: {
    value (v) {
      this.inputValue = v
    }
  },
  computed: {

  },
  mounted () {
    this.$nextTick(() => {

    })
  },
  methods: {
    changeValue (v) {
      this.inputValue = v
      this.$emit('input', v)
    },
    onClick (e) {
      this.$emit('click', e)
    }
  },
  components: {
  }
})

export default Cpt
</script>

<template lang="html">
  <div class="input-tip">
    <el-input v-bind="$props" @blur="(e) => $emit('blur', e)" :value="inputValue" :maxlength="maxLen" @input="changeValue" @click="onClick"/>
    <span class="value-tip"> {{String(inputValue || '').length}}/{{maxLen}}</span>
  </div>
</template>

<style lang="less" type="text/less" >
.input-tip {
  width: 100%;
  position: relative;
  .value-tip {
    color: #999;
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>
