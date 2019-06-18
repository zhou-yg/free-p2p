<template>
  <div class="auto-complete-tag">
    <el-input :value="text" :placeholder="placeholder" @input="changeText"/>
    <div class="tips" v-show="isShowTips" :style="tipStyle">
      <p v-for="item in items" :key="item" @click="appendVar(item)">{{item}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    placeholder: String,
    items: {
      type: Array,
      default: () => ([])
    },
    tag: {
      type: String,
      default: '#'
    },
    defaultValue: String
  },
  components: {

  },
  data () {
    return {
      text: this.defaultValue,
      isShowTips: false
    }
  },
  mounted () {

  },
  computed: {
    tipStyle () {
      let t = this.text
      let enNum = t.match(/[\w\d#]/g)
      enNum = enNum ? enNum.length : 0
      return {
        left: (t.length * 14 + 10 - (enNum * 6)) + 'px'
      }
    }
  },
  methods: {
    changeText (v) {
      this.text = v
      let num = v.match(/#/g)
      num = num ? num.length : 0
      if (/#$/.test(v) && num % 2 !== 0) {
        this.isShowTips = true
      }
      if (num % 2 === 0) {
        this.isShowTips = false
      }
      this.$emit('input', this.text)
    },
    appendVar (variables) {
      let i = this.text.lastIndexOf('#')
      if (i >= 0) {
        let t = this.text.substring(0, i)
        this.text = t + variables
        this.isShowTips = false
        this.$emit('input', this.text)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less"  scoped>
.auto-complete-tag {
  width: 100;
  position: relative;
  .tips {
    background-color: #fff;
    position: absolute;
    top: 26px;
    z-index: 1;

    border-radius: 2px;
    box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(211, 211, 211, 1);
    text-align: center;
    color: #4A4A4A;
    font-size: 12px;

    > p {
      padding: 0 9px;
      height: 21px;
      line-height: 21px;
      cursor: default;

      &:hover {
        background-color: #00ABFB;
      }
    }
  }
}
</style>
