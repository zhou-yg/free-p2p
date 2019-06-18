<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import WkDialog from 'src/components/BasicCpt/WkDialog.vue';
import moment from 'moment';
import pick from 'lodash/pick';
import InputTip from 'src/components/BasicCpt/InputTip.vue';
import PlayTime from '../../cpts/PlayTime.vue';

const Cpt = Vue.extend({
  props: {
    actName: String,
    executeTime: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      isVisible: false,
      name: this.actName || moment().format('高级营销YYYYMMDDHHmm'),
      playMode: 1,
      palyTimeValue: {
        playTime: 0,
        weekValue: 1,
        monthValue: 1,
        playStartTime: '',
        playEndTime: '',
        dateTime: new Date(),
        time: '',

        sendNow: 0,
        sendTime: new Date(),
        note: '',
      },
    };
  },
  watch: {
    executeTime (v) {
    },
    actName (v) {
      this.name = v;
    },
  },
  computed: {

  },
  mounted () {
    this.$nextTick(() => {

    });
  },
  methods: {
    show () {
      this.isVisible = true;
      this.isReq = false;
    },
    submit () {
      if (this.isReq) {
        return;
      }

      this.isReq = true;
      let arg = {
        ...pick(
          this,
          ['name', 'playMode']
        ),
      };
      const nowDate = new Date().getDate();
      const now = Date.now();
      arg = {...arg, ...this.palyTimeValue};

      const executeTime = {
        name: arg.name,
        startTime: arg.playStartTime ? new Date(arg.playStartTime).getTime() : 0,
        endTime: arg.playEndTime ? new Date(arg.playEndTime).getTime() : 0,
        scheduleMode: arg.playMode,
        cycType: arg.playTime + 1,
        cycVal: arg.playTime === 1 ? arg.weekValue : arg.playTime === 2 ? arg.monthValue : '',
        cycTime: arg.dateTime ? new Date(arg.dateTime).getTime() : 0,

        sendType: arg.sendNow,
        sendTime: arg.sendTime ? new Date(arg.sendTime).getTime() : 0,
        actDesc: arg.note,
      };

      if (arg.playMode === 2) {
        if (!executeTime.startTime || !executeTime.endTime) {
          return this.showError('必须填写时间范围', '时间范围错误');
        }

        if (executeTime.startTime && executeTime.startTime < now && new Date(executeTime.startTime).getDate() !== nowDate) {
          return this.showError('开始时间必须大于当前时间', '时间范围错误');
        }
        if (executeTime.endTime && executeTime.endTime < executeTime.startTime) {
          return this.showError('结束时间必须大于开始时间', '时间范围错误');
        }
      }
      this.$emit('submit', executeTime);
    },
    showError (m, t) {
      this.$nextTick(() => {
        this.isVisible = true;
        this.isReq = false;
      });
      return this.$alert(m, t, {
        type: 'error',
      });
    },
    onClose () {
      this.$emit('close');
    },
    onCancel () {
      this.$router.push('/marketing/plans')
      requestAnimationFrame(() => {
        document.body.click && document.body.click()
        requestAnimationFrame(() => {
          document.body.click && document.body.click()
        });
      });
    },
  },
  components: {
    WkDialog,
    InputTip,
    PlayTime,
  },
});

export default Cpt;
</script>

<template lang="html">
  <wk-dialog
    v-model="isVisible"
    title="执行设置"
    :ban-cancel="true"
    :close-on-click-modal="false"
    @submit="submit"
    @close="onClose"
    @cancel="onCancel" >
    <div class="process-setting-dialog">
      <div class="form-item">
        <span class="form-item__pre">
          <i class="danger">*</i>
          计划名称：
        </span>
        <dib w="200px">
          <input-tip v-model="name" :max-len="20" />
        </dib>
      </div>
      <div class="form-item">
        <span class="form-item__pre">
          <i class="danger">*</i>
          执行方式：
        </span>
        <el-radio-group v-model="playMode">
          <el-radio :label="1" >单次执行</el-radio>
          <el-radio :label="2" >循环执行</el-radio>
        </el-radio-group>
      </div>
      <play-time v-model="palyTimeValue" v-if="playMode === 2"/>
      <div class="" v-if="playMode === 1">
        <div class="form-item ha">
          <span class="form-item__pre">
            <i class="danger">*</i>
            执行时间：
          </span>
          <el-radio-group
            v-model="palyTimeValue.sendNow" >
            <div class="time-row">
              <el-radio :label="0" >立即执行</el-radio>
            </div>
            <div class="time-row">
              <el-radio :label="1" >定时执行</el-radio>
              <div class="time-row__time-picker">
                <el-date-picker
                  type="datetime"
                  v-model="palyTimeValue.sendTime"
                  placeholder="请选择">
                </el-date-picker>
              </div>
            </div>
          </el-radio-group>
        </div>

      </div>
      <div class="" >
        <div class="form-item ha">
          <span class="form-item__pre">
            <i class="danger">*</i>
            活动描述：
          </span>
          <textarea class="tt" placeholder="活动描述" v-model="palyTimeValue.note">

          </textarea>
        </div>
      </div>
    </div>
  </wk-dialog>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';
@b process-setting-dialog {
  padding: 10px 20px;

  .form-item {
    position: relative;
    &.ha {
      height: auto;
    }
    .tt {
      margin: 10px 0 0 0;
      padding: 1em;
      border: 1px solid var(--dark-border-color);
      width: 380px;
      min-width: 380px;
      max-width: 380px;
      height: 70px;
      min-height: 70px;
      max-height: 70px;
    }
  }
  .name-tip {
    width: 32px;
    position: absolute;
    top: 0;
    left: 210px;
  }
  .time-row {
    margin-top: 8px;
    font-size: 12px;

    &__time-picker {
      display: inline-block;
      width: 120px;
      vertical-align: middle;
    }
  }
}
</style>
