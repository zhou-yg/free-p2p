<script type="text/babel">
/**
 * Created by huning.
 */
import Vue from 'vue'
import moment from 'moment'

const Cpt = Vue.extend({
  props: {
    isTime: {
      type: Boolean,
      default: false
    },
    start: {
      type: [String, Date],
      default: ''
    },
    startMin: {
      type: Date,
      default () {
        return new Date(0)
      }
    },
    end: {
      type: [String, Date],
      default: ''
    },
    endMin: Date,
    endMax: {
      type: Date
    },
    enableNull: {
      type: Boolean
    },
    startPlaceholder: String,
    endPlaceholder: String,
    showClose: {
      type: Boolean,
      default: true
    },
    disalbledStart: Boolean,
    disalbledEnd: Boolean,

    disabledPeriod: Boolean
  },
  data () {
    return {
      startTime: this.start,
      endTime: this.end,
      leftPickerOptions: {
        disabledDate: (date) => {
          let cur = date.getTime()
          let r1
          if (this.startMin) {
            r1 = cur < new Date(this.startMin).getTime()
          }
          return r1
        }
      },
      rightPickerOptions: {
        disabledDate: (date) => {
          let cur = date.getTime()
          let r1
          let r2
          if (this.endMax) {
            r1 = cur > new Date(this.endMax).getTime()
          }
          if (this.endMin) {
            r2 = cur < new Date(this.endMin).getTime()
          }
          return r1 || r2
        }
      }
    }
  },
  computed: {
    minDate () {
      let start = this.start.length > 0 ? new Date(this.start) : new Date(0)

      return this.startMin ? new Date(Math.max(start, this.startMin)) : start
    },
    maxDate () {
      return this.end.length > 0 ? new Date(this.end) : null
    },
    datePickerType () {
      return this.isTime ? 'datetime' : 'date'
    },
    dateFormat () {
      return this.isTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
    }
  },
  methods: {
    changeStart (v) {
      if (v) {
        v = moment(v).format(this.dateFormat)
        if (this.startTime !== v) {
          this.startTime = v
          this.changeTime()
        }
      } else if (this.enableNull) {
        this.startTime = null
        this.changeTime()
      }
    },
    changeEnd (v) {
      if (v) {
        v = moment(v).format(this.dateFormat)
        if (this.endTime !== v) {
          this.endTime = v
          this.changeTime()
        }
      } else if (this.enableNull) {
        this.endTime = null
        this.changeTime()
      }
    },
    changeTime () {
      if (!this.disabledPeriod && this.startTime && this.endTime && new Date(this.startTime) > new Date(this.endTime)) {
        return this.$alert('开始时间必须小于结束时间', '提示', {
          type: 'error'
        })
      } else if (this.enableNull) {
        return this.$emit('input', {
          startTime: this.startTime,
          endTime: this.endTime
        })
      }
      this.$emit('input', {
        startTime: this.startTime,
        endTime: this.endTime
      })
    }
  }
})

export default Cpt
</script>

<template lang="html">
  <span class="filter-form__input-group filter-form_period" :class="{
      'filter-form__input-group--time': isTime
    }">
    <span class="filter-input-container" style="display: inline-block;">
      <el-date-picker
        :disabled="disalbledStart"
        :key="String(start)"
        :value="start"
        @input="changeStart"
        :type="datePickerType"
        :time-picker="isTime"
        :min-date="startMin"
        :max-date-time="maxDate"
        :max-date="maxDate"
        :picker-options="leftPickerOptions"
        :placeholder="startPlaceholder"
        :clearable="showClose"
        >
      </el-date-picker>
    </span>
    <span>-</span><span class="filter-input-container" style="display: inline-block;">
      <el-date-picker
        :disabled="disalbledEnd"
        :key="String(end)"
        :value="end"
        @input="changeEnd"
        :type="datePickerType"
        :time-picker="isTime"
        :min-date-time="minDate"
        :min-date="minDate"
        :picker-options="rightPickerOptions"
        :placeholder="endPlaceholder"
        :clearable="showClose"
        >
      </el-date-picker>
    </span>
  </span>
</template>

<style lang="less" type="text/less"  >

.filter-form__input-group {
  .filter-input-container {
    display: inline-block;
    margin: 0px 5px;
    &:first-child {
      margin-left: 0;
    }
  }
  @m time {
    .filter-input-container {
      width: 165px;
    }
  }
}
.filter-form__input-group .form-item .el-input__icon-text {
  transform: rotate(0deg);
}
.filter-form__input-group .form-item .el-icon-circle-cross {
  cursor: pointer;
}
.filter-form_period .el-date-picker {
  width: 100%;
  position: relative;
}
</style>
