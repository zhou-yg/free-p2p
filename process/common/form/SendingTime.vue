<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
import moment from 'moment'
import getFormItemMixins from './formItemMixins'

const Cpt = Vue.extend({
  mixins: [getFormItemMixins()],
  props: {
    date: Date,
    delay: {
      type: [Number, String],
      default: 24 * 3600 * 1000
    },
    size: {
      type: String,
      default: 'small'
    },
    useMode: {
      type: Number,
      default: 0
    },
    preText: {
      type: String,
      default: '执行延迟时间'
    }
  },
  data () {
    return {
      minDate: new Date(),
      pickerOptions: {
        disabledDate (date) {
          return date.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  computed: {
    dateStr () {
      let d = this.date
      if (d && !isNaN(this.date.getTime())) {
        return moment(d).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return ''
      }
    },
    useDate () {
      return this.useMode === 0
    },
    useDelayTime () {
      return this.useMode === 1
    },
    delayNum () {
      return this.delay ? this.delay : 0
    },
    dd () {
      return parseInt(this.delayNum / 24 / 3600 / 1000)
    },
    hh () {
      return parseInt((this.delayNum - this.dd * 24 * 3600 * 1000) / 3600 / 1000)
    },
    mm () {
      return parseInt((this.delayNum - this.dd * 24 * 3600 * 1000 - this.hh * 3600 * 1000) / 60 / 1000)
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    changeDate (v) {
      if (this.value === 1) {
        this.$emit('submit', v ? new Date(v) : '')
      }
    },
    changeDelay (dd, hh, mm) {
      const delay = dd * 24 * 3600 * 1000 + hh * 3600 * 1000 + mm * 60 * 1000
      this.$emit('submit-delay', delay)
    }
  },
  components: {
  }
})

export default Cpt
</script>

<template lang="html">
  <div class="form-item sending-time">
    <span class="form-item__pre">
      发送时间：
    </span>
    <el-radio-group :value="value" @input="onInput">
      <el-radio
        :size="size"
        :label="0" >
        立即发送
      </el-radio>
      <el-radio
        :size="size"
        :label="1" >
        定时发送
      </el-radio>
    </el-radio-group>


    <div class="sending-time__picker" v-show="value === 1" v-if="useDate">
      <el-date-picker
        :value="dateStr"
        type="datetime"
        :time-picker="true"
        @input="changeDate"
        :min-date="minDate"
        :picker-options="pickerOptions" >
        <el-input  size="small" :value="dateStr" :auto-clear="true" icon="time">
        </el-input>
      </el-date-picker>
    </div>

    <div class="sending-time__delay" v-show="value === 1" v-if="useDelayTime">
      {{preText}}
      <dib w="50px">
        <el-input :value="dd" @input="v => changeDelay(v, hh, mm)" />
      </dib>
      天后的
      <dib w="50px" >
        <el-input :value="hh" @input="v => changeDelay(dd, v, mm)" />
      </dib>
      点
      <dib w="50px" >
        <el-input :value="mm" @input="v => changeDelay(dd, hh, v)" />
      </dib>
      分
    </div>

  </div>
</template>

<style lang="less" type="text/less" >


.sending-time{
  /*.el-radio-group {
    vertical-align: top;
    line-height: 30px;
  }*/
  .form-item__pre{
    vertical-align: top;
  }
  @e picker{
    margin-left: 30px;
    width: 170px;
    display: inline-block;
    position: relative;
    font-size: 14px;

    .icon-shijian{
      color: #333;
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translate(0,-50%);
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }
  @e delay {
    display: inline-block;
    color: #999;
  }
}
</style>
