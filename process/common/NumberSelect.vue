<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
const Cpt = Vue.extend({
  props: {
    value: [Number, String],
    from: [Number, String],
    to: [Number, String],
    trans: {
      type: Function,
      default: function (_) {
        return _
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    options () {
      return new Array(Number(this.to) - Number(this.from) + 1).fill(Number(this.from)).map((from, i) => {
        return {
          label: this.trans(from + i),
          value: from + i
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {

    })
  },
  methods: {
    changeInput (v) {
      this.$emit('input', v)
    }
  },
  components: {
  }
})

export default Cpt
</script>

<template lang="html">
  <el-select
    :value="value"
    @input="changeInput">
    <el-option
      v-for="op in options"
      :key="op.value"
      :value="op.value"
      :label="op.label" />
  </el-select>
</template>

<style lang="less" type="text/less" >

</style>
