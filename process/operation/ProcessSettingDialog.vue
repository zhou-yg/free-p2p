<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import WkDialog from 'src/components/BasicCpt/WkDialog.vue';
import moment from 'moment';
import NumberSelect from 'src/components/BasicCpt/NumberSelect.vue';
import Period from 'src/components/BasicCpt/Period.vue';
import pick from 'lodash/pick';
import InputTip from 'src/components/BasicCpt/InputTip.vue';
import {ALL_TEMPLATES} from 'cc/store/modules/processOn';

const Cpt = Vue.extend({
  props: {
    actName: String,
  },
  data () {
    return {
      isVisible: false,
      name: this.actName || moment().format('YYYYMMDD计划'),
      actSource: 0,
      actTemplateId: 0,
      ALL_TEMPLATES,
    };
  },
  watch: {
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
    show ({templateId}) {
      this.actTemplateId = templateId;
      this.isVisible = true;

      if (templateId) {
        this.actSource = 1;
      }
    },
    submit () {
      const arg = {
        ...pick(
          this,
          ['name', 'actSource', 'actTemplateId']
          // ['name', 'playMode', 'playTime', 'weekValue', 'monthValue', 'playStartTime', 'playEndTime', 'note']
        ),
      };
      this.$emit('submit', arg);
    },
    close () {
      this.$confirm('是否确定不创建营销计划，并离开该页面？', '提示', {
        confirmButtonText: '确认离开',
        cancelButtonText: '留下',
        type: 'warning',
      }).then(() => {
        try {
          const iframe = document.getElementsByClassName('child-iframe')[0];
          if (iframe) {
            console.log(iframe);
            iframe.contentWindow.history.back(-1);
          } else {
            throw Error('未找到ifram：child-iframe');
          }
        } catch (error) {
          console.error(error);
          window.history.back(-1);
        }
      }, () => {
        this.show({});
      });
    },
    backCancel () {
      this.$router.push('/marketing/plans')
    },
  },
  components: {
    WkDialog,
    NumberSelect,
    Period,
    InputTip,
  },
});

export default Cpt;
</script>

<template lang="html">
  <wk-dialog
    v-model="isVisible"
    title="新建营销计划"
    :ban-cancel="true"
    :close-on-click-modal="false"
    @submit="submit"
    @cancel="backCancel" >
    <div class="process-setting-dialog">
      <div class="form-item">
        <span class="form-item__pre">
          <i class="danger">*</i>
          计划名称
        </span>
        <dib w="180px">
          <input-tip v-model="name" :max-len="20" />
        </dib>
      </div>
      <div class="form-item" style="display:none;">
        <span class="form-item__pre">
          <i class="danger">*</i>
          新建方式
        </span>
        <el-radio-group v-model="actSource">
          <el-radio :label="0" >新建空白模板</el-radio>
          <el-radio :label="1" >从已有模板创建</el-radio>
        </el-radio-group>
      </div>
      <div class="form-item" v-if="actSource === 1">
        <span class="form-item__pre">
          <i class="danger">*</i>
          选择模板
        </span>
        <el-select v-model="actTemplateId" >
          <el-option v-for="t in ALL_TEMPLATES" :key="t" :value="t.templateId" :label="t.name" />
        </el-select>
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
  }
}
</style>
