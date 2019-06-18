<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
const Cpt = Vue.extend({
  components: {
  },
  props: {
  },
  data () {
    return {
      isFull: false,
      isFullScreenEnabled: document.fullscreenEnabled
    }
  },
  computed: {
  },
  mounted () {
    document.addEventListener('fullscreenchange', (e) => {
      this.isFull = !this.isFull
    })
  },
  beforeDestroy () {
    document.removeEventListener('fullscreenchange', (e) => {
      this.isFull = !this.isFull
    })
  },
  methods: {
    reqFull () {
      this.$emit('fullScreen', !this.isFull)
    }
  }
})
export default Cpt
</script>

<template lang="html">
  <div class="svg-op">
    <div class="op" @click="$emit('magnify')">
      +
    </div>
    <div class="op" @click="$emit('shrink')">
      -
    </div>
    <div v-if="isFullScreenEnabled" class="op fs" @click="reqFull">
      <span v-if="isFull" class="shrink">
        &#xe6a5;
      </span>
      <span v-else >&#xe6a4;</span>
    </div>
  </div>
</template>

<style lang="less" type="text/less" >
.svg-op{
  background-color: #fff;
  border: 1px solid  #D3D3D3;
  display: flex;
  color: #00ABFB;
  position: absolute;
  left: 22px;
  bottom: 22px;
  z-index: 1;
  > .op {
    border-right: 1px solid #D3D3D3;
    width: 46px;
    line-height: 46px;
    height: 46px;
    text-align: center;
    user-select: none;

    &:last-child{
      border: 0;
    }
    &.fs {
      > span {
        font-family: 'iconfont';
        &.shrink {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
