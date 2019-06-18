<template lang="html">
  <NodeBase
    :nodeName="name"
    className="crowd-select-top">
    <div class="crowd-select">
      <div class="form-item" v-if="!this.currentSelect.crowdId && !disabledEdit">
        <div class="crowd-select-btn" @click="startSelect">
          选择人群
        </div>
      </div>
      <div class="crowd-select-result" v-if="this.currentSelect.crowdId">
        <div class="result-title">
          已选择分群信息

          <span class="fr" @click="startSelect" v-if="!disabledEdit">
            重新选择
          </span>
        </div>
        <div class="result-row">
          分群ID：{{currentSelect.crowdId}}
        </div>
        <div class="result-row">
          分群名称：{{currentSelect.crowdName}}
        </div>
        <div class="result-row">
          访客人数：{{currentSelect.visitorCount | countFilter}}
        </div>
        <div class="result-row">
          客户人数：{{currentSelect.crowdCount | countFilter}}
        </div>
      </div>
      <div class="crowd-select-result" v-if="!this.currentSelect.crowdId && disabledEdit">
        <div class="result-row">未选择分组人群</div>
      </div>

      <WkDialog
        v-model="isShowCrowdPool"
        @submit="afterShow">
        <div class="crowd-pool-box">
          <crowd-pool
            @select="select"
            :columns="columns"
            :current="cacheCurrentSelect" />
        </div>

      </WkDialog>
    </div>
  </NodeBase>
</template>
<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import NodeBase from '../../NodeBase.vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import WkDialog from 'components/BasicCpt/WkDialog.vue';

import CrowdPool from 'cc/components/crowd/pool/main.vue';
import Enumerator from 'src/tools/vueFilter/enumerator-format.js';
import DateTimeFormat from 'src/tools/vueFilter/date-time-format.js';

import {NODE_COLLECTION} from '../../../data';

const Cpt = Vue.extend({
  components: {
    NodeBase,
    CrowdPool,
    WkDialog,
  },
  mixins: [nodeBaseMixin(NODE_COLLECTION.crowd.name, NODE_COLLECTION.crowd.type, () => {
    return {
      ...NODE_COLLECTION.crowd.data(),
    };
  })],
  props: {
  },
  data () {
    return {
      isShowCrowdPool: false,

      columns: [
        {name: '选择', key: 'check', width: '80px'},
        {name: '人群名称', key: 'crowdName', width: '120px'},
        {name: '人群数量', key: 'crowdCount', width: '160px'},
        {name: '人群来源', key: 'crowdType', formatter: (row, {property}) => Enumerator.convert('crowdType', row[property])},
        {name: '营销次数', key: 'marketCount'},
        {name: '创建时间', key: 'createTime', formatter: (row, {property}) => DateTimeFormat(row[property])},
      ],
      currentSelect: {
        crowdId: this.formData.crowdId,
      },
      cacheCurrentSelect: {
        crowdId: this.formData.crowdId,
      },
    };
  },
  computed: {

  },
  mounted () {
    if (this.currentSelect.crowdId) {
      this.$apiAuto.ecrm.crowd.detail({
        crowdId: this.currentSelect.crowdId,
      }).then(obj => {
        console.log(obj);
        this.currentSelect = Object.assign(this.currentSelect, obj, {
          crowdId: this.currentSelect.crowdId,
        });
        this.cacheCurrentSelect = this.currentSelect;
      });
    }
  },
  methods: {
    startSelect () {
      this.isShowCrowdPool = true;
    },
    afterShow () {
      this.currentSelect = this.cacheCurrentSelect;
    },
    select (v) {
      this.cacheCurrentSelect = v;
      this.crowdId = v.crowdId;
      this.crowdName = v.crowdName;
    },
  },
});

export default Cpt;
</script>

<style lang="css">
@b crowd-select-btn {
  border: 1px dashed #d9d9d9;
  line-height: 28px;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;

  &:hover {
    border-color: #2f89dc;
    cursor: pointer;
  }
}
@b crowd-select-result {
  background-color: #f5f9ff;
  padding: 16px;
  font-size: 12px;
  .result-title {
    color: #666666;
    line-height: 20px;
    margin-bottom: 8px;

    .fr{
      color: #2f89dc;
      cursor: pointer;
    }
  }
  .result-row {
    color: #333;
    line-height: 20px;
  }
}
@b crowd-select-top{
  .el-dialog__body {
    width: 900px;
  }
}
@b crowd-select{
  .crowd-pool-box {
    padding: 0 10px 10px;
  }
}
</style>
