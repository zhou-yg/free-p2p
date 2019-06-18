<template lang="html">
  <NodeBase
    :nodeName="name"
    className="operator-uniq" >
    <div class="content">
      <p class="sub-title">
        当前排重优先级

        <span class="fr" @click="showDialogSetting" v-if="!disabledEdit">
          设置优先级
        </span>
      </p>

      <el-table :data="prevCrowd" >
        <el-table-column
          prop="index"
          label="优先级"
          width="60">
        </el-table-column>
        <el-table-column
          prop="showName"
          label="输入节点类型/名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="output"
          label="输出显示名称"
          width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.output" v-if="!disabledEdit"/>
            <span v-else>{{ scope.row.output }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <WkDialog
      title="设置排重优先级"
      v-model="isShowDialogSetting"
      @cancel="cancelSetting"
      @submit="submitSetting">
      <div class="setting-content">
        <el-table :data="transedList2" >
          <el-table-column
            prop="index"
            label="优先级"
            width="60">
          </el-table-column>
          <el-table-column
            prop="showName"
            label="输入节点类型/名称" >
          </el-table-column>
          <el-table-column
            prop="output"
            label="输出显示名称" >
          </el-table-column>
          <el-table-column
            label="调整优先级" >
            <template slot-scope="scope">
              <div class="operation">
                <i class="icon-arrow_up" @click="indexGoto(scope.row.index - 1, scope.row.index - 2)"></i>
                <i class="icon-arrow_down" @click="indexGoto(scope.row.index - 1, scope.row.index)"></i>
                <i class="icon-arrow_up limit" @click="indexGoto(scope.row.index - 1, 0)"></i>
                <i class="icon-arrow_down limit" @click="indexGoto(scope.row.index - 1, transedList.length - 1)"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </WkDialog>
  </NodeBase>
</template>
<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION, NODE_COLLECTION_TYPES} from '../../../data';
import WkDialog from 'src/components/BasicCpt/WkDialog.vue';

const Cpt = Vue.extend({
  components: {
    WkDialog,
  },
  mixins: [nodeBaseMixin(NODE_COLLECTION.crowdUniq.name, NODE_COLLECTION.crowdUniq.type, () => ({
    ...NODE_COLLECTION.crowdUniq.data()
  }))],
  props: {
  },
  data () {
    return {
      prevCrowd: [],
      isShowDialogSetting: false,
      settingList: [],
    };
  },
  computed: {
    transedList2 () {
      return this.settingList.map((o, i) => ({
        ...o,
        index: i + 1,
      }));
    },
  },
  mounted () {
    this.getPrevCrowds();
    this.sortByIds();
  },
  methods: {
    sortByIds () {
      let hasCrowds = this.preNodeIds.map(id => {
        return this.prevCrowd.filter(o => o.id === id)[0]
      }).filter(_ => _)
      let hasCrowdIds = hasCrowds.map(o => o.id)

      this.prevCrowd = hasCrowds.concat(this.prevCrowd.filter(o => !hasCrowdIds.includes(o.id))).map((o, i) => {
        o.output = this.outputNames[i];
        o.index = i + 1;
        return o;
      });
    },
    beforeSubmit () {
      this.preNodeIds = this.prevCrowd.map(obj => obj.id)
      this.outputNames = this.prevCrowd.map(obj => obj.output)
    },
    getPrevCrowds () {
      let prevLinks = this.nextLinks.getNext(this.id, true);
      let preNodeIds = prevLinks.map(obj => obj.id)
      let prevNodes = this.$store.state.processOn.allNodes.filter(imNode => {
        return preNodeIds.includes(imNode.id)
      })
      this.prevCrowd = prevNodes
      .filter(o => o.formData.crowdId && o.formData.crowdName)
      .map((o, i) => ({
        index: i + 1,
        id: o.id,
        // nodeTypeName: NODE_COLLECTION_TYPES[o.type].name,
        // nodeName: o.name,
        value: o.formData.crowdId,
        label: o.formData.crowdName,
        showName: `${NODE_COLLECTION_TYPES[o.type].name}/${o.name}`,
        output: '',
      }));
    },
    indexGoto (from, to) {
      if (from >= 0 && to <= this.prevCrowd.length - 1) {
        let f = this.settingList[from]
        let t = this.settingList[to]

        this.settingList[to] = f
        this.settingList[from] = t

        this.settingList = this.settingList.slice()
      }
    },
    showDialogSetting () {
      this.settingList = this.prevCrowd.slice();
      this.isShowDialogSetting = true
    },
    cancelSetting () {

    },
    submitSetting () {
      this.prevCrowd = this.settingList.slice().map((o, i) => ({
        ...o,
        index: i + 1,
      }));
    },
  },
});

export default Cpt;
</script>

<style lang="css">
@import 'src/assets/styles/var.css';
@b operator-uniq {
  .el-table .cell {
    padding-left: 8px;
    padding-right: 8px;
  }
  .sub-title {
    margin-bottom: 12px;
    font-size: 12px;
    color: #666;
    .fr {
      color: #2f89dc;
      cursor: pointer;
    }
  }
  .icon-arrow_up,
  .icon-arrow_down {
    color: #919191;
    user-select: none;
  }
  .icon-arrow_up.limit {
    border-top: 2px solid #919191;
  }
  .icon-arrow_down.limit {
    border-bottom: 2px solid #919191;
  }
}
</style>
