<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
const Cpt = Vue.extend({
  props: {
    w: String
  },
  data () {
    return {
    }
  },
  computed: {
    s () {
      return {
        width: this.w
      }
    }
  },
  mounted () {
    this.$nextTick(() => {

    })
  },
  methods: {
  },
  components: {
  }
})

export default Cpt
</script>

<template lang="html">
  <div class="dib" :style="s">
    <slot/>
  </div>
</template>

<style lang="css">
.dib {
  display: inline-block;
}
</style>
