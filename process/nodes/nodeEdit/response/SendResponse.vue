<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';

const Cpt = Vue.extend({
  mixins: [nodeBaseMixin(NODE_COLLECTION.sendResponse.name, NODE_COLLECTION.sendResponse.type, () => ({
    ...NODE_COLLECTION.sendResponse.data()
  }))],
  props: {
  },
  data () {
    return {
    };
  },
  computed: {

  },
  mounted () {
    this.$nextTick(() => {

    });
  },
  methods: {
  },
});

export default Cpt;
</script>

<template lang="html">
  <NodeBase
    :nodeName="name"
    className="sava-crowd" >
    <div class="response-send">
      <div class="ha">
        <p class="node-label-sub">
          <i class="danger">*</i>
          输出分支：
        </p>
        <el-checkbox-group v-model="filterTypes" style="dis">
          <el-row v-if="!disabledEdit">
            <el-col :span="12"><el-checkbox :label="4" >发送成功</el-checkbox></el-col>
            <el-col :span="12"><el-checkbox :label="3" >发送失败</el-checkbox></el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="24"><span v-if="filterTypes.includes(4)">发送成功</span></el-col>
            <el-col :span="24"><span v-if="filterTypes.includes(4)">发送失败</span></el-col>
          </el-row>

          <el-row v-if="!disabledEdit && isParentType4">
            <el-col :span="12"><el-checkbox :label="2">受限制</el-checkbox></el-col>
            <el-col :span="12"><el-checkbox :label="0">未知状态</el-checkbox></el-col>
          </el-row>
          <el-row v-if="disabledEdit && isParentType4">
            <el-col :span="24"><span v-if="filterTypes.includes(2)">受限制</span></el-col>
            <el-col :span="24"><span v-if="filterTypes.includes(0)">未知状态</span></el-col>
          </el-row>
        </el-checkbox-group>
      </div>
    </div>
    <div class="response-send">
      <div class="ha">
        <p class="node-label-sub">
          备注：
        </p>

        <el-input type="textarea" placeholder="描述" v-model="note" v-if="!disabledEdit"></el-input>
        <span v-else>{{ note }}</span>
      </div>
    </div>
  </NodeBase>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';

@b response-send {
  .el-checkbox-group {
    display: block;
  }

  .el-row {
    margin-bottom: 8px;
  }

  .el-textarea__inner {
    height: 64px;
    resize: none;
  }

  .form-item__pre {
    text-align: left;
  }
}
</style>
