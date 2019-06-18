<template>
  <el-dialog
    title="请选择一个子账号"
    :modal-append-to-body="false"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    custom-class="select-sub-account"
    size="tiny" >
    <!-- {{systemAccountList}} -->

    <el-select

      v-model="accountId"
      style="width: 100%"
      @change="select"
      class="template-select"
      popper-class="template-list-select"
    >
      <el-option
        v-for="(item, index) in systemAccountList"
        :label="item.nick"
        :value="item.id"
        :key="index"
      >
      </el-option>
    </el-select>

    <p slot="footer" class="dialog-footer">
      <el-button
        :disabled="!selected"
        type="primary"
        @click="submit">确定</el-button>
      <el-button
        @click="back">返回</el-button>
    </p>
  </el-dialog>
</template>

<script>
import AccountSignatures from '@/mixins/AccountSignatures'

export default {
  name: '',
  mixins: [AccountSignatures],
  components: {

  },
  data () {
    return {
      dialogVisible: false,
      accountId: null
    }
  },
  mounted () {

  },
  computed: {
    selected () {
      let selected = this.systemAccountList.filter(o => o.id === this.accountId)[0]
      return selected
    }
  },
  methods: {
    show () {
      this.dialogVisible = true
    },
    select (v) {
      console.log(v)
    },
    submit () {
      this.dialogVisible = false

      if (this.selected) {
        this.$emit('submit', this.selected)
      }
    },
    back () {
      this.$emit('gobackList')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less" >
.select-sub-account {
  .dialog-footer {
    overflow: hidden;
    height: 28px;
    > button {
      margin-left: 16px;
      float: right;
    }
  }
}
</style>
