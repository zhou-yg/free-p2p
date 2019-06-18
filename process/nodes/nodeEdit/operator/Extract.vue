<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import NumberSelect from 'src/components/BasicCpt/NumberSelect.vue';
import {NODE_COLLECTION} from '../../../data';
import nodeBaseMixin from '../../nodeBaseMixin';

const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(NODE_COLLECTION.crowdExtract.name, NODE_COLLECTION.crowdExtract.type, () => {
    return {
      ...NODE_COLLECTION.crowdExtract.data(),
    };
  })],
  props: {
  },
  data () {
    return {
      isPercentError: false,
      isFormatError: false,
    };
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    afterShow () {
      if (this.mode === 0) {
        this.percent = this.percent.map(p => parseInt(p));
      }
    },
    changePercent (v, i) {
      this.percent[i] = v;
    },
    afterChangePercent () {
      this.isPercentError = this.percent.reduce((p, n) => p + Number(n), 0) > 100;
      this.isFormatError = this.percent.some(v => !/^\d+$/.test(v));

      if (!(this.isPercentError || this.isFormatError)) {
        this.percent = this.percent.map(v => parseInt(v));
      }
    },

    changeNum (len) {
      var len2 = this.percent.length;
      while (len > len2) {
        this.percent = this.percent.concat(0);
        len--;
      }
      if (len < len2) {
        this.percent = this.percent.slice(0, len);
      }
    },
    beforeSubmit () {
      this.percent = this.percent.map(p => parseInt(p));
      this.num = this.percent;
    },
  },
  components: {
    NumberSelect,
  },
});

export default Cpt;
</script>

<template lang="html">
  <NodeBase
    :nodeName="name"
    :disabledSubmit="isPercentError || isFormatError"
    className="crowd-extract-top">
    <div class="crowd-extract">
      <p class="form-item-title">
        抽取方式：
      </p>
      <div class="form-item">
        <el-radio-group
          v-if="!disabledEdit"
          size="small"
          v-model="mode">
          <el-radio size="small" :label="0">按比例抽取</el-radio>
          <el-radio size="small" :label="1">固定配额抽取</el-radio>
        </el-radio-group>
        <span v-else>{{ mode === 0 ? '按比例抽取' : '固定配额抽取' }}</span>
      </div>
      <p class="form-item-title">
        分支数：
      </p>
      <div class="form-item">
        <number-select v-model="branchNum" @input="changeNum" :from="2" :to="4" v-if="!disabledEdit" />
        <span v-else>{{ branchNum }}</span>
      </div>
      <div class="block-area">
        <p class="form-item-title">
          抽取比例：
        </p>
        <div class="form-item ha">
          <span class="extract-row" :key="percent.join(', ')">
            <div v-if="mode === 0" v-for="(p, i) in percent" :key="p + '  ' + i">
              <span class="extract-pre">
                分支{{i + 1}}占比
              </span>
              <dib :w="disabledEdit ? '10px' : '80px'">
                <el-input :key="p" :value="p" @input="v => changePercent(v, i)" @blur="afterChangePercent" v-if="!disabledEdit" />
                <span v-else>{{ p }}</span>
              </dib>
              %
            </div>
            <div v-if="mode === 1" v-for="(p, i) in percent" :key="p + ' ' + i">
              <span class="extract-pre">
                分支{{i + 1}}分配
              </span>
              <dib :w="disabledEdit ? '10px' : '80px'">
                <el-input :key="p" :value="p" @input="v => changePercent(v, i)" @blur="afterChangePercent"  v-if="!disabledEdit" />
                <span v-else>{{ p }}</span>
              </dib>
              人
            </div>
            <div class="error" v-if="mode === 0 && isPercentError">
              占比合计不能超过100%
            </div>
            <div class="error" v-if="isFormatError">
              输入的值只能为正整数，不能是小数和负数
            </div>
          </span>
        </div>
      </div>
      <p class="form-item-title">
        描述：
      </p>
      <div class="form-item ha">
        <textarea class="tt" v-model="note" v-if="!disabledEdit">

        </textarea>
        <div v-else class="tt tt-view">{{ note || '暂无' }}</div>
      </div>
    </div>
  </NodeBase>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';
@b crowd-extract-top {
  .extract-row {
    display: inline-block;
    margin-left: 0em;
    > div {
      margin-bottom: 6px;
    }
  }
  .el-select {
    display: block;
  }
  .form-item-title {
    margin: 16px 0 4px;
    color: #666;
    font-size: 12px;
  }
  .extract-pre {
    width: 65px;
    display: inline-block;
  }
  .block-area {
    margin-top: 16px;
    background-color: #f5f9ff;
    padding: 8px 16px;
  }
  .tt {
    margin-top: 10px;
    border: 1px solid var(--dark-border-color);
    padding: 0.5em;
    width: 100%;
    height: 60px;
    min-width: 100%;
    max-width: 100%;
    min-height: 60px;
    max-height: 60px;
    box-sizing: border-box;
  }
  .tt-view {
    border: none;
  }
}
</style>
