<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import nodeBaseMixin from '../../nodeBaseMixin';
import {NODE_COLLECTION} from '../../../data';
import EditArea from 'src/components/MemberMarketing/EditArea.vue'
import TextEditor from 'src/components/MemberMarketing/TextEditor.vue';
import TestDialog from 'src/components/MemberMarketing/TestDialog.vue'

const MESSAGE_INFO = [
  { 
    label: '发送会员',
    valueKey: 'memberCount',
    // 是否要乘以发送短信数，后端要我这么干，我无力与他争辩了
    hasSendCount: false,
    span: 8,
    tip: null,
  },
  {
    label: '发送短信(条)',
    valueKey: 'totalCount',
    hasSendCount: true,
    span: 8,
    tip: null,
  },
  {
    label: '接受成功数',
    valueKey: 'successCount',
    hasSendCount: true,
    span: 8,
    tip: null,
  },
  {
    label: '接受失败数',
    valueKey: 'failCount',
    hasSendCount: true,
    span: 10,
    tip: {
      title: '什么是接收失败数？',
      content: '因为手机号码为空号、运营商黑名单，手机停机、信号等问题造成的短信无法触达',
    },
  },
  {
    label: '状态未返回数',
    valueKey: 'unkownStatusCount',
    hasSendCount: true,
    span: 10,
    tip: {
      title: '什么是状态未返回数？',
      content: '手机是否收到短信这个报告还未返回，客户可能已收到，一般发完短信后48小时内状态都会回来。',
    },
  },
]

const Cpt = Vue.extend({
  displayName: 'Coupon1',

  mixins: [nodeBaseMixin(NODE_COLLECTION.sms.name, NODE_COLLECTION.sms.type, () => ({
    ...NODE_COLLECTION.sms.data()
  }))],
  props: {
  },
  data () {
    return {
      MESSAGE_INFO,

      phoneError: '',

      showTestDialog: false,

      memberCount: '',
      successCount: '',
      totalCount: '',
      failCount: '',
      unkownStatusCount: '',
      smsCount: '',
    };
  },
  computed: {
    nick () {
      return this.$store.state.account.currentSignature;
    },
    text () {
      return `【${this.nick}】${this.tmpl}回T退订`;
    },
  },
  mounted () {
    this.$nextTick(() => {
      if (this.disabledEdit) this.getMessageInfo();

      this.$store.dispatch('getCurrentSignature', {
        state: 4,
        pageNo: 1,
        pageSize: 1,
      }).then(res => {
        this.sign = this.nick;
      })
    });
  },
  methods: {
    getMessageCount (k) {
      return this[k] ? this[k] * this.smsCount : '--';
    },
    changeTestPhones (val) {
      // this.$emit('update:testPhones', val);
      if (val) {
        val.replace(/\s/g, '').split(/,|，/).filter(phoneOne => {
          return !!phoneOne;
        }).forEach(phoneOne => {
          if (!/\d+/g.test(phoneOne)) {
            this.phoneError = '请正确的输入手机号码';
          } else if (phoneOne.length !== 11) {
            this.phoneError = '请确保手机号均为11位';
          } else {
            this.phoneError = '';
          }
        });
      } else {
        this.phoneError = '';
      }

      if (!this.phoneError) {
        if (!this.testPhones && this.isFormalAppend) {
          this.phoneError = '测试手机号码为空';
        }
      }
    },
    getMessageInfo () {
      this.$api.ecrm.activity.nodeInstStatusByNodeId({
        activityId: this.$route.query.aid,
        nodeId: this.id,
      }).then(res => {
        Object.assign(this, res.data);
      }).catch(e => {
        console.log(e);
      });
    },
    checkTestMsg (v) {
      if (!this.testPhones || (this.testPhones).split(/,|，/).length < 1) {
        this.$alert('测试号码不能为空', '', {
          type: 'error',
        });
        return;
      }
      this.sendTestMsg(v);
    },
    async sendTestMsg () {
      try {
        await this.$store.dispatch('sendSmsTest', {
          sign: this.nick,
          template: this.tmpl.replace(/#收货人#/g, '诸葛神候').replace(/#旺旺#/g, '采菇凉的小蘑菇'),
          testPhones: String(this.testPhones).split(/,|，/).join(','),
        });
        this.showTestDialog = false;
        this.$message.success('发送成功');
      } catch (error) {
        this.$alert(error, '发送测试失败', {
          type: 'error',
        });
      }
    },
    testSend () {
      this.showTestDialog = true;
    },
    changeEditText ({text}) {
      this.tmpl = text;
    },
  },
  components: {
    EditArea,
    TestDialog,
    TextEditor,
  },
});

export default Cpt;
</script>

<template lang="html">
  <NodeBase
    :nodeName="name"
    className="marketing-message1" >
    <p class="node-label-sub">短信编辑：</p>

    <EditArea
      v-if="!disabledEdit"
      :selected-sign="nick"
      :edit-text="tmpl"
      :show-sup-tools="false"
      :hideSignSelect="true"
      :showHeaderSign="true"
      :backtip="true"
      :variables="[0, 1]"
      @input="changeEditText"
    >
    </EditArea>
    <div class="marketing-message1__info" v-else>
      <el-col
        v-for="msg in MESSAGE_INFO"
        :key="msg.key"
        :span="msg.span"
      >
        <p>
          {{ msg.label }}
          <el-popover
            v-if="msg.tip"
            placement="top-start"
            :title="msg.tip.title"
            width="200"
            trigger="hover"
            :content="msg.tip.content">
            <i slot="reference" class="icon-yiwen" style="color: #c5d0de"></i>
          </el-popover>
        </p>
        <span>{{ getMessageCount(msg.valueKey) }}</span>
      </el-col>
    </div>

    <div>
      <p class="node-label-sub">短信测试：</p>
      <div class="test-sms-wrapper">
        <el-input
          v-if="!disabledEdit"
          size="small"
          v-model="testPhones"
          @input="changeTestPhones"
          placeholder="输入测试手机号"
        ></el-input>
        <span v-else>{{ testPhones || '无' }}</span>
        <el-button size="mini" @click="testSend" v-if="!disabledEdit">测试短信</el-button>
      </div>
      <div v-show="phoneError" class="edit-area__phone-error" v-if="!disabledEdit">
        <i class="el-icon-information"></i>{{phoneError}}
      </div>
    </div>

    <test-dialog
      v-model="showTestDialog"
      :text="text"
      :phones="testPhones"
      :hideFixed="true"
      @send="checkTestMsg"
    />
  </NodeBase>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';

.marketing-message1 {
  .marketing-message1__info {
    height: 136px;
    border-radius: 4px;
    background-color: #f5f9ff;
    padding: 18px 0;
    box-sizing: border-box;
    margin-bottom: 8px;

    p {
      font-size: 12px;
      margin-bottom: 8px;
      color: #666;
    }

    .el-col {
      text-align: center;
      margin: 4px 0;
    }
  }

  @b edit-area {
    padding: 16px;
    background-color: #f5f9ff;
    border: none;
    border-radius: 4px;
    margin-bottom: 16px;

    @e title {
      color: rgba(155, 155, 155, 1);
    }

    @e controls {
      padding: 0;
      @m bottom {
        border-top: none;
        padding: 8px 0 0;
      }
    }

    @e container {
      border-top: none;
      .text-editor {
        background-color: #ffffff;
        min-height: 120px;
        border: 1px solid #e6e7ec;
        border-radius: 4px;
        margin-top: 8px;
      }
    }

    @e phone-error{
      font-size: 12px;
      color:var(--warning-color);
      margin-top: 4px;
      line-height: 1em;
      height: 1em;
    }
  }

  .test-sms-wrapper {
    display: flex;
    align-items: center;
    .el-input {
      flex-grow: 1;
      margin-right:8px;
    }
  }
}
</style>
