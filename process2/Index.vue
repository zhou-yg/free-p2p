<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
import ProcessOn from './svg/ProcessOn.vue'
import ProcessOperation from './ProcessOperation.vue'
import NodesListVue from './NodesList.vue'
import NodeFormSetting from './NodeFormSetting.vue'
import BeforeExe from './dialogs/BeforeExe.vue'
import ExeResult from './dialogs/ExeResult.vue'
import SelectSubAccount from './dialogs/SelectSubAccount.vue'

import {getExtractNodes} from '@/store/modules/processOn'
import {NODE_COLLECTION} from './data'
import moment from 'moment'
import SvgOp from './SvgOp.vue'

import checkLinkNode from './svg/checkLinkNode'
import checkData from './svg/checkData'
import {ImageNode} from './svg/ProcessOn'

const LOOK_LOOK = 'looklook'

const Cpt = Vue.extend({
  components: {
    ExeResult,
    SelectSubAccount,
    BeforeExe,
    NodeFormSetting,
    SvgOp,
    ProcessOn,
    NodesList: NodesListVue,
    ProcessOperation
  },
  props: {
  },
  data () {
    return {
      actName: '云片测试actName',
      isEditLine: false,
      executeTime: {
        scheduleMode: 0, // 0单次，1循环
        cycType: '', // int 1-每天；2-每周； 3-每月
        cycVal: '',
        startTime: '',
        endTime: ''
      },
      forceDisabledEdit: false,

      isClickedExe: false,

      activityName: '微信策略模板'
    }
  },

  computed: {

    nodes () {
      return this.$store.state.processOn.allNodes
    },
    testData () {
      return this.$store.state.crowd.list
    },
    aid () {
      return this.$route.query.id
    },
    templateId () {
      const i = this.$route.query.templateId
      return i
    },
    isLookTemp () {
      return (this.templateId || this.templateId === 0) && this.disabledEdit
    },
    disabledEdit () {
      return this.$route.query.state === LOOK_LOOK || this.forceDisabledEdit
    }
  },
  mounted () {
    const {aid, templateId} = this

    if (aid || aid === 0) {
      this.$store.dispatch('getAllNodes', aid).then(() => {
        this.initPoArea()
        this.$nextTick(() => {
          this.checkNodeData(true)
        })
      })
    } else {
      console.log(`aid is null`)
    }
    this.$nextTick(() => {
      if (templateId && !aid) {
        this.$refs.ssa.show()
      }
    })
    this.setActStatus()
    // @
    // this.getNodesExeState();
  },
  methods: {
    setActStatus () {
      const searchListPromise = this.backCaller(this.back.flow.search, {
        primaryAccountId: this.$store.state.user.id
      })
      searchListPromise.then(ret => {
        if (ret.code) {
          return
        }
        if (ret.data.records.length === 0) {
          this.$refs.nfs.openUserGuide()
        } else {
          let target = ret.data.records.filter(obj => obj.flowId === this.aid)[0]
          this.forceDisabledEdit = target && target.status === 'published'
          this.activityName = target && target.templateName ? target.templateName : this.activityName
        }
      })
    },

    initPoArea (isSaveConnections) {
      this.nodes.forEach(n => {
        // @TODO 早期demo版本不能选中和编辑
        // @TODO 早期demo版本全部不能移动
        n.canMove = false
        if (n.type === NODE_COLLECTION.Branch.type) {
          n.canSelected = false
        }
        this.$refs.po.newNode(n)
      })
      const initialConnections = this.$store.state.processOn.initialConnections
      initialConnections.forEach(o => {
        o.next.forEach((nextId, i) => {
          if (nextId) {
            this.$refs.po.connectNodeById(o.id, nextId, o.nextEvents[i])
          }
        })
      })
    },
    startLine () {
      this.$refs.po.openEditLineMode()
    },
    remove () {
      const removedNode = this.$refs.po.getCurrentNode()
      if (removedNode) {
        let removedNodeArr = [removedNode]
        // if (removedNode.type === null) {
        //   const nextLinks = this.$refs.po.getConnectionsWithId()
        //   const children = nextLinks.getNext(removedNode.id)
        //   if (children.every(child => child.type === NODES_LIST2[0].type)) {
        //     removedNodeArr = removedNodeArr.concat(children.map(child => ({ id: child.id })))
        //   }
        // }

        this.removeDirectly(removedNodeArr)
      }
    },
    removeDirectly (idObjArr) {
      let alreadyRemovedNodes = this.$refs.po.removeNode(idObjArr.map(({id}) => id))
      // console.log(alreadyRemovedNodes);

      this.$store.dispatch('delNode', {
        aid: this.aid,
        nodes: idObjArr
      }).then(() => {
        this.$message.success('删除节点成功')
      })
    },
    checkNode () {
      // if (this.$refs.nfs) {
      //   this.$refs.nfs.triggerSubmit()
      // }

      if (this.checkNodeData()) {
        return true
      } else {
        // this.$message.error('节点检测不通过')
      }
    },
    checkNodeData (ignoreError) {
      // 验证各个节点的数据是否规范
      let {errorText, errorId, successIds, errorIds} = checkData(this.nodes)

      // if (errorId !== null) {
      //   this.$refs.po.markNodeError(errorId)
      // }
      successIds.forEach(id => this.$refs.po.markNodeSuccess(id))
      errorIds.forEach(id => this.$refs.po.markNodeError(id))

      if (errorText && !ignoreError) {
        this.$alert(errorText, '节点数据检测', {
          type: 'error'
        })
        return
      }
      return true
    },
    checkLinksNet () {
      let {errorText, simpleConnections} = checkLinkNode(
        this.nodes,
        this.$refs.po.getConnectionsWithId()
      )

      if (errorText && 0) {
        this.$alert(errorText, '节点链路检测', {
          type: 'error'
        })
        return false
      } else {
        this.$store.dispatch('relation', simpleConnections)
        return true
      }
    },
    executeNode () {
      this.isClickedExe = true
    },
    beforeExecuteRightnow () {
      if (!this.checkNode()) {
        return
      }
      this.$refs.be.show()
    },
    async executeRightnow ({isOpenRobot, wxRobotId}) {
      try {
        let robotRet
        let m
        let wxSuccess = '我们已为你开启微信机器人请随时查看效果 '
        let wxFail = '您尚无绑定机器人，稍后请在<a href="http://baidu.com" target="_blank">微信机器人</a>中绑定才能查看效果 '

        if (isOpenRobot && wxRobotId) {
          robotRet = await this.backCaller(this.back.flow.robot.setting.put, {
            wxRobotId,
            wxRobotStatus: 1
          })
          if (robotRet.code) {
            m = wxFail
          } else {
            m = wxSuccess
          }
        }
        let ret = await this.$store.dispatch('execute')

        let t
        let exeSuccess = '策略已经成功执行'
        let exeFail = '策略未能成功执行'

        if (ret.code) {
          t = exeFail
          m = '请查看策略信息是否配置完整'
        } else {
          t = exeSuccess
          this.forceDisabledEdit = true
        }
        if (!ret.code && isOpenRobot && wxRobotId) {
          this.$refs.er.showCode()
        } else {
          this.$refs.er.show(t, m, !ret.code)
        }
      } catch (error) {
        this.$message.error('执行失败：' + error)
      }
    },
    async onInsertNode ({svgNode, prevNode}) {
      if (svgNode.id || !this.aid) {
        return
      }
      try {
        const nodeId = await this.$store.dispatch('insertNode', {
          aid: this.aid,
          svgNode
        })
        svgNode.id = nodeId
        this.$refs.po.newNode(svgNode, prevNode)
      } catch (m) {
        this.$alert('插入节点失败' + m ? m.message || m : '', '插入出错', {
          type: 'error'
        })
      }
    },
    clickOnNode (node) {
      const findNode = this.nodes.filter(n => n.id === node.id)[0]
      console.log(`findNode:`, findNode)
      if (findNode) {
        const nextLinks = this.$refs.po.getConnectionsWithId()
        const [parentType] = nextLinks.getNext(findNode.id, true).map(({type}) => type)

        // console.log('clickOnNode:', parentType);
        // console.log('clickOnNode:', findNode.formData);
        this.$refs.nfs.openDialog(findNode.id, findNode.type, {
          ...findNode.formData,
          name: findNode.name
        })
      }
    },
    clickOnSvg () {
      this.$refs.nfs.hidden()
    },
    changeNodeData ({id, type, formData}) {
      this.nodes.forEach(svgNode => {
        if (svgNode.id === id) {
          // @TODO 这里有副作用,直接修改state
          let oldFormData = svgNode.formData
          let oldName = svgNode.name
          svgNode.formData = formData
          svgNode.name = formData.name
          this.$refs.po.markNodeSuccess(id)
          this.afterChangeNode(svgNode)
          this.$store.dispatch('updateNode', {
            id,
            aid: this.aid
          }).then(res => {
            this.$message.success(`保存节点数据成功`)
            this.$refs.nfs.hidden()
          }, ret => {
            switch (ret.code) {
              case 98:
                this.$alert(`无法保存节点，因为该策略已经执行中，`, { type: 'error' })
                break
              default:
                this.$alert(`保存节点数据失败了`, { type: 'error' })
            }
            svgNode.formData = oldFormData
            svgNode.name = oldName
            this.$refs.po.markNodeError(id)
            this.clickOnNode({id})
          }).catch(e => {
            this.$alert(`保存节点数据失败`, { type: 'error' })
            svgNode.formData = oldFormData
            svgNode.name = oldName
            this.$refs.po.markNodeError(id)
            this.clickOnNode({id})
          })
        }
      })
    },
    afterChangeNode (svgNode) {
      const {id, type, formData} = svgNode
      const nextLinks = this.$refs.po.getConnectionsWithId()
      const now = Date.now()

      this.$refs.po.updateName(svgNode)

      switch (type) {
        case null:
          break
      }
    },
    gobackList () {
      this.$router.push({
        path: '/flow/record'
      })
    },
    async save () {
      // if (!this.checkNode()) {
      //   return
      // }

      // const nextLinks = this.$refs.po.getConnectionsWithId();
      // await this.$apiAuto.ecrm.node.relation(JSON.stringify(nextLinks.getSimpleConnections()));

      try {
        await this.$store.dispatch('saveAllNodes', this.aid)
      } catch (e) {
        console.log(e)
      }

      this.$message.success('保存成功')

      // const nodes = await this.$apiAuto.ecrm.node.get({
      //   activityId: this.aid
      // })
      // console.log('保存结果：', JSON.stringify(nodes, null, 2))
      return true
    },

    genNextNodes ({id}, nextArr) {
      const currentNode = this.$refs.po.findNodeById(id)
      if (currentNode) {
        // this.po.cleanNext(currentNode);
        nextArr = nextArr.map((svgNode, i) => {
          svgNode.x = currentNode.x + 150
          svgNode.y = currentNode.y + i * 100
          return svgNode
        }).forEach(svgNode => {
          this.onInsertNode({
            svgNode,
            prevNode: currentNode
          })
        })
      } else {
        console.log('not find currentNode ', id)
      }
    },
    nodeDragOver (ev) {
      ev.preventDefault()
    },
    nodeDrop (ev) {
      const {offsetX, offsetY} = ev
      ev.preventDefault()
      const node = JSON.parse(ev.dataTransfer.getData('text'))

      node.offsetX = offsetX
      node.offsetY = offsetY

      // const svgNode = this.newNode(node);

      const svgNode = new ImageNode({
        // id: null,
        type: node.type,
        name: node.name,
        x: node.offsetX,
        y: node.offsetY,
        url: node.img,
        formData: node.formData
      })

      this.onInsertNode({svgNode})
    },
    svgShrink () {
      this.$refs.po.shrink()
    },
    svgMagnify () {
      this.$refs.po.magnify()
    },
    fullScreen (full) {
      let el = this.$el
      if (full) {
        if (el.requestFullscreen) {
          el.requestFullscreen()
        }
      } else {
        if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        }
      }
    },
    async selectSubAccount (v) {
      let ret = await this.$store.dispatch('createNodes', {
        mainAccountId: this.$store.state.user.id,
        subAccountId: v.id,
        templateId: this.templateId
      })
      if (ret.code) {
        this.$alert(ret.msg, '创建失败', {
          type: 'error'
        })
        return
      }
      this.$router.replace(`/flow/process?id=${this.$store.state.processOn.originFsm.sid}`)
      this.initPoArea()
      this.setActStatus()
    },
    async stop () {
      let ret = await this.$store.dispatch('execute', 0)
      if (ret.code) {
        return
      }
      this.$message.success('停用成功')
      this.forceDisabledEdit = false
    }
  }
})

export default Cpt
</script>

<template lang="html">
  <div class="process-on-area">
    <header class="op">
      <ProcessOperation
        :activityName="activityName"
        :disabledEdit="disabledEdit"
        @checkNode="checkNode"
        @remove="remove"
        @save="save"
        @executeNode="executeNode"
        @executeRightnow="beforeExecuteRightnow"
        @stop="stop"
        @gobackList="gobackList" />
    </header>
    <div class="flex-box">
      <div class="node-list-top" v-show="!disabledEdit">
        <nodes-list
          ref="nl"
          :disabled-edit="disabledEdit" />
      </div>
      <div ref="poBox" class="po-box"  @dragover="nodeDragOver" @drop="nodeDrop">
        <process-on ref="po"
          :disabled-edit="disabledEdit"
          @click-node="clickOnNode"
          @new-node="onInsertNode"
          @clickOnSvg="clickOnSvg" />

        <SvgOp
          @fullScreen="fullScreen"
          @shrink="svgShrink"
          @magnify="svgMagnify" />

        <NodeFormSetting ref="nfs" :disabledEdit="disabledEdit" @submit="changeNodeData"/>
      </div>
    </div>

    <BeforeExe ref="be" @submit="executeRightnow"/>
    <ExeResult ref="er" />
    <SelectSubAccount ref="ssa"
      @gobackList="gobackList"
      @submit="selectSubAccount" />
  </div>
</template>

<style lang="less" type="text/less" >
:root {
  --node-list-width: 160px;
}
.process-on-area{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow: hidden;

  .flex-box {
    flex: 1;
    position: relative;
    max-height: 100%;
    box-sizing: border-box;

    .node-list-top {
      width: 160px;
      min-width: 160px;
      max-width: 160px;

      position: absolute;
      left: 0;
      top: 20px;

      z-index: 1;
      // @TODO 暂时隐藏
      display: none;
    }
    .po-box {
      flex: 1;
      border: 1px solid #eee;
      max-height: 100%;
    }
  }
}
</style>
