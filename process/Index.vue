<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import ProcessOn from './svg/ProcessOn.vue';
import ProcessOperation from './ProcessOperation.vue';
import NodesListVue from './NodesList.vue';
import ProcessSettingDialog from './operation/ProcessSettingDialog.vue';
import ProcessExecuteDialog from './operation/ProcessExecuteDialog.vue';
import {getExtractNodes} from './data';
import {NODE_COLLECTION, GET_NODE_COLLECTION} from './data';
import moment from 'moment';
import {ImageNode} from './svg/ProcessOn';
import SvgOp from './SvgOp.vue';

import NodeFormSetting from './NodeFormSetting.vue'

import checkLinkNode from './svg/checkLinkNode';
import checkNodeConnection from './svg/checkNodeConnection';
import checkData from './svg/checkData';

const LOOK_LOOK = 'looklook';

const Cpt = Vue.extend({
  components: {
    NodeFormSetting,
    ProcessOn,
    NodesList: NodesListVue,
    ProcessSettingDialog,
    ProcessExecuteDialog,
    ProcessOperation,
    SvgOp,
  },
  props: {
  },
  data () {
    return {
      actName: '',
      isEditLine: false,
      executeTime: {
        scheduleMode: 0, // 0单次，1循环
        cycType: '', // int 1-每天；2-每周； 3-每月
        cycVal: '',
        startTime: '',
        endTime: '',
      },
      forceDisabledEdit: false,

      isClickedExe: false,

      currNode: null, // 当前双击选中的按钮 暂用于键盘backsapce删除
    };
  },

  computed: {
    activityName () {
      return this.actName;
    },
    executeText () {
      const {scheduleMode, cycType, cycVal, startTime, endTime} = this.executeTime;
      var r = '当前营销计划执行方式为';
      if (scheduleMode) {
        r += `"循环执行"`;

        let t = [
          startTime ? new Date(startTime) : Date.now(),
          endTime ? new Date(endTime) : Date.now(),
        ].map(n => moment(n).format('MM月DD日')).join('~');

        r += `，执行时间范围为${t}`;

        switch (cycType) {
          case 1:
            r += `的每天`;
            break;
          case 2:
            let names = ['一', '二', '三', '四', '五', '六', '日'];
            r += `的每周星期${names[cycType]}`;
            break;
          case 3:
            r += `的每月${cycVal}号`;
            break;
        }
      } else {
        r += `"单次执行"`;
      }
      return r;
    },
    nodes () {
      //  class NodeFormData集合
      return this.$store.state.processOn.allNodes;
    },
    testData () {
      return this.$store.state.crowd.list;
    },
    aid () {
      return this.$route.query.aid;
    },
    templateId () {
      const i = this.$route.query.templateId;
      return isNaN(Number(i)) ? i : Number(i);
    },
    isLookTemp () {
      return (this.templateId || this.templateId === 0) && this.disabledEdit;
    },
    disabledEdit () {
      return this.$route.query.state === LOOK_LOOK || this.forceDisabledEdit;
    },
    areaState () {
      const state = this.$route.query.state;

      if (this.forceDisabledEdit) {
        return '执行中';
      }

      switch (state) {
        case LOOK_LOOK:
          return '查看';
        default:
          return '设计中';
      }
    },
  },
  mounted () {
    const {aid, templateId} = this;
    if (aid || aid === 0) {
      this.$dispatchAuto('getAllNodes', {
        activityId: aid,
      }).then(() => {
        this.initPoArea();
      });
      this.$apiAuto.ecrm.activity.detail({
        aid,
      }).then(({name}) => {
        this.actName = name;
      });
    }
    this.$nextTick(() => {
      this.$refs.nfs.openUserGuide()

      if (!aid && aid !== 0 && !templateId && templateId !== 0) {
        this.$refs.ped.show({});
      }
      // 模板逻辑暂时隐藏
      // if (templateId || templateId === 0) {
      //   if (this.isLookTemp) {
      //     this.$store.dispatch('setTemplateNodes', {templateId});
      //     this.$nextTick(() => {
      //       this.initPoArea();
      //     });
      //   } else {
      //     this.submitSetting({
      //       name: moment().format('YYYYMMDD HH:mm计划'),
      //       actSource: 1,
      //       actTemplateId: templateId,
      //     });
      //   }
      // }
    });

    // @
    // this.getNodesExeState();
    this.calHeightAuto();
    window.addEventListener('resize', this.calHeightAuto);
  },
  beforeDestroyed () {
    window.removeEventListener('resize', this.calHeightAuto);
  },
  methods: {
    calHeightAuto () {
      requestAnimationFrame(() => {
        let h = document.body.offsetHeight;
        let th = document.querySelector('.wk-container__top').offsetHeight;
        let th2 = 40 - 2;
        let pd = 40;
        let finalH = (h - th - th2 - pd);
        this.$el.style.height = `${finalH}px`;
      });
    },
    initPoArea (isSaveConnections) {
      this.nodes.forEach(n => {
        this.$refs.po.newNode(n);
      });
      const initialConnections = this.$store.state.processOn.initialConnections;
      initialConnections.forEach(o => {
        o.next.forEach(nextId => {
          this.$refs.po.connectNodeById(o.id, nextId);
        });
      });
      if (isSaveConnections) {
        this.saveRelation();
      }
      if (this.disabledEdit) {
        this.$nextTick(() => this.getNodesExeState());
      }
    },
    getNodesExeState () {
      this.$apiAuto.ecrm.activity.nodeInstStatus({
        activityId: this.aid,
      }).then(states => {
        if (states) {
          this.$refs.po.setStates(states);
        }
      }).catch(e => {
        console.log(e);
      });
    },
    startLine () {
      this.$refs.po.openEditLineMode();
    },
    deleteNode () {
      // 开始节点不可删除
      if (this.currNode && this.currNode.type !== NODE_COLLECTION.start.type) {
        this.remove(this.currNode);
        this.$refs.nfs.hidden();
        this.currNode = null;
      }
    },
    remove ({id}) {
      const removedNode = this.$store.state.processOn.allNodes.filter(o => o.id === id)[0]
      if (removedNode) {
        var removedNodeArr = [removedNode];
        if (removedNode.type === NODE_COLLECTION.crowdExtract.type) {
          const nextLinks = this.$refs.po.getConnectionsWithId();
          const children = nextLinks.getNext(removedNode.id);
          // console.log(children, removedNode.id, typeof removedNode.id);
          if (children.every(child => child.type === NODE_COLLECTION.crowdExtractChild.type)) {
            removedNodeArr = removedNodeArr.concat(children.map(child => ({ id: child.id })));
          }
        }

        this.removeDirectly(removedNodeArr);
      }
    },
    removeDirectly (idObjArr) {
      let alreadyRemovedNodes = this.$refs.po.removeNode(idObjArr.map(({id}) => id));

      if (idObjArr.length > 0) {
        this.$store.dispatch('delNode', {
          aid: this.aid,
          nodes: idObjArr,
        }).then(() => {
          this.$message.success('删除节点成功');
        }, (e) => {
          console.error(e);
        });
      }
    },
    checkNode () {
      if (this.checkLinksNet() && this.checkNodeData()) {
        this.$message.success('节点检测通过');
        return true;
      }
      return false;
    },
    checkNodeData (targetId) {
      // 验证各个节点的数据是否规范
      // targetId 只验证targetId本身是否规范
      let {errorText, errorId, successIds, errorIds} = checkData(this.nodes)

      successIds.forEach(id => {
        if (targetId) {
          if (targetId === id) {
            this.$refs.po.markNodeNormal(id)
          } else if (!id) {
            this.$refs.po.markNodeSuccess(id)
          }
        } else {
          this.$refs.po.markNodeSuccess(id)
        }
      })
      errorIds.forEach(id => {
        if (targetId) {
          if (targetId === id) {
            this.$refs.po.markNodeError(id)
          }
        } else {
          this.$refs.po.markNodeError(id)
        }
      })

      if (errorText && !targetId) {
        this.$alert(errorText, '节点数据检测', {
          type: 'error',
        });
        return;
      }
      return true;
    },
    checkLinksNet () {
      var {errorText, simpleConnections} = checkLinkNode(
        this.nodes,
        this.$refs.po.getConnectionsWithId()
      );

      if (errorText && 0) {
        this.$alert(errorText, '节点链路检测', {
          type: 'error',
        });
        return false;
      } else {
        this.saveRelation();
        // this.$apiAuto.ecrm.node.relation(JSON.stringify(simpleConnections));
        return true;
      }
    },
    executeNode () {
      this.isClickedExe = true;
      // this.$refs.ped.show();
      this.submitExecute();
    },
    async executeRightnow (isTest) {
      isTest = isTest === true;

      if (!this.checkNode()) return;
      // 通过点击执行按钮的话，需要先确认下相关的执行设置。
      // 如果是函数内触发的直接调用，那么不就先确认执行设置
      if (!this.isClickedExe) {
        this.beforeBeforeExe = isTest;
        this.isClickedExe = true;
        return this.executeNode();
      }

      const isSaved = await this.save();
      if (!isSaved) {
        return;
      }
      try {
        await this.$apiAuto.ecrm.activity.execute({
          activityId: this.aid,
          startNodeId: this.nodes.filter(n => n.type === NODE_COLLECTION.start.type)[0].id,
          isTest,
        });
        if (!isTest) {
          this.forceDisabledEdit = true;
        }
        if (!isTest) {
          this.$message.success((isTest ? '测试' : '正式') + '执行成功');
        }
      } catch (error) {
        this.$alert('执行失败：' + error, '异常', {
          type: 'error',
        });
      }
    },
    async onInsertNode ({svgNode, prevNode}) {
      if (svgNode.id || !this.aid) {
        return;
      }
      try {
        const nodeObj = await this.$store.dispatch('insertNode', {
          aid: this.aid,
          svgNode,
        });
        svgNode.id = nodeObj.id;
        this.$refs.po.newNode(svgNode, prevNode);
        return nodeObj.id;
      } catch (m) {
        this.$alert('插入节点失败' + m ? m.message || m : '', '插入出错', {
          type: 'error',
        });
      }
    },
    handleNodeFormSettingClick () {
      this.currNode = null;
    },
    clickOnNode (node) {
      this.currNode = node;
      const findNode = this.nodes.filter(n => n.id === node.id)[0];
      if (findNode) {
        const nextLinks = this.$refs.po.getConnectionsWithId();
        const [parentType] = nextLinks.getNext(findNode.id, true).map(({type}) => type);

        // console.log('clickOnNode:', parentType);
        // console.log('clickOnNode:', findNode.formData);
        this.$refs.nfs.openDialog(findNode.id, findNode.type, {
          ...findNode.formData,
          executeText: this.executeText,
          name: findNode.name,
        }, nextLinks);
      }
    },
    changeNodeData ({id, type, formData}) {
      this.nodes.forEach(svgNode => {
        if (svgNode.id === id) {
          // @TODO 这里有副作用,直接修改state
          // @TODO 直接修改了，vue state, & processOn.shapes
          svgNode.formData = formData;
          svgNode.name = formData.name;

          this.checkNodeData(id);
          this.afterChangeNode(svgNode);
        }
      });
    },
    afterChangeNode (svgNode) {
      const {id, type, formData} = svgNode;
      const nextLinks = this.$refs.po.getConnectionsWithId();
      const now = Date.now();

      this.$refs.po.updateName(svgNode);

      let nextNodesData;
      let children;

      switch (type) {
        case NODE_COLLECTION.crowdExtract.type:
          nextNodesData = getExtractNodes({
            id,
            type,
            formData,
            x: 0,
            y: 0,
          });

          children = nextLinks.getNext(id);

          this.removeDirectly(children);
          this.genNextNodes({id}, nextNodesData);
          break;
        case NODE_COLLECTION.crowdUniq.type:
          nextNodesData = getExtractNodes({
            id,
            type,
            formData,
            x: 0,
            y: 0,
          });
          children = nextLinks.getNext(id);

          this.removeDirectly(children);
          this.genNextNodes({id}, nextNodesData);

          break;
      }

      this.$store.dispatch('updateNode', {
        id,
        aid: this.aid,
      }).then(res => {
        this.$message.success(`保存节点数据成功`);
      }, m => {
        this.$alert(`保存节点数据失败了：` + m, '检测出错', { type: 'error' });
        this.clickOnNode({id});
      }).catch(e => {
        this.$alert(`保存节点数据失败：` + e.message, '检测出错', { type: 'error' });
        this.clickOnNode({id});
      });
    },
    async genNextNodes ({id}, nextArr) {
      const currentNode = this.$refs.po.findNodeById(id);
      if (currentNode) {
        // this.po.cleanNext(currentNode);
        nextArr = await Promise.all(nextArr.map((svgNode, i) => {
          svgNode.x = currentNode.x + 150;
          svgNode.y = currentNode.y + i * 100;
          return svgNode;
        }).map(svgNode => {

          return this.onInsertNode({
            svgNode,
            prevNode: currentNode,
          });
        }));
        nextArr.forEach((id) => {
          // this.$refs.po.markNodeSuccess(id)
        });

        this.saveRelation();
      } else {
        console.log('not find currentNode ', id);
      }
    },
    gobackList () {
      this.$router.push({
        path: '/marketing/plans',
      });
    },
    submitSetting (arg) {
      this.actName = arg.name;
      this.$apiAuto.ecrm.activity.newAct({
        ...arg,
        marketType: 5,
      }).then(({actId}) => {
        let aid = actId;
        this.$message.success('新建成功');
        this.$router.replace({
          query: {
            aid,
          },
        });

        this.onInsertNode({
          svgNode: new ImageNode(GET_NODE_COLLECTION().start),
        });
        // if (arg.actSource === 0) {
        //   this.onInsertNode({
        //     svgNode: new ImageNode(GET_NODE_COLLECTION().start),
        //   });
        // } else {
        //   this.$store.dispatch('getNodesFromTemp', {
        //     aid,
        //     templateId: arg.actTemplateId,
        //   }).then(() => {
        //     this.initPoArea(true);
        //   });
        // }
      });
    },
    submitExecute (arg) {
      // this.executeTime = arg;
      // this.$apiAuto.ecrm.activity.newAct({
      //   activityId: this.aid,
      //   name: this.actName,
      //   marketType: 5,
      //   ...arg,
      // }).then(() => {
      //   this.$message.success('保存执行设置成功');
      //   if (this.beforeBeforeExe !== undefined) {
      //     this.executeRightnow(this.beforeBeforeExe);
      //     this.beforeBeforeExe = undefined;
      //   }
      // });
      if (this.beforeBeforeExe !== undefined) {
        this.executeRightnow(this.beforeBeforeExe);
        this.beforeBeforeExe = undefined;
      }
    },
    executeTimeClose () {
      // if (this.nodeCache) {
      //   this.clickOnNode(this.nodeCache);
      //   delete this.nodeCache;
      // }
    },
    async save () {
      // @TODO 暂存
      // if (!this.checkNode()) {
      //   return;
      // }
      // this.checkNode();

      await this.saveRelation();

      try {
        await this.$store.dispatch('saveAllNodes', this.aid);
      } catch (e) {
        console.log(e);
      }

      this.$message.success('保存成功');

      const nodes = await this.$apiAuto.ecrm.node.get({
        activityId: this.aid,
      });
      return true;
    },
    clickExecuteTime (node) {
      this.nodeCache = node;
      this.$refs.ped.show();
    },

    nodeDragOver (ev) {
      ev.preventDefault();
    },
    async nodeDrop (ev) {
      const {offsetX, offsetY} = ev;
      ev.preventDefault();
      const node = JSON.parse(ev.dataTransfer.getData('text'));

      node.offsetX = offsetX;
      node.offsetY = offsetY;

      // const svgNode = this.newNode(node);

      const svgNode = new ImageNode({
        // id: null,
        type: node.type,
        name: node.name,
        x: node.offsetX,
        y: node.offsetY,
        url: node.img,
        formData: node.formData,

        iconImg: node.iconImg,
        fill: node.fill,
        prevType: node.prevType,
        nextType: node.nextType,
        limitNodeNum: node.limitNodeNum,
      });

      let id = await this.onInsertNode({svgNode});
      if (id) {
        this.$store.dispatch('pushNodeHistory', id);
      }
    },
    undo () {
      let curId = this.$store.state.processOn.nodeHistory[0];
      if (curId !== undefined) {
        this.removeDirectly([{id: curId}]);
        this.$store.dispatch('shiftNodeHistory');
      }
    },
    svgShrink () {
      this.$refs.po.shrink();
    },
    svgMagnify () {
      this.$refs.po.magnify();
    },
    fullScreen (full) {
      let el = this.$el;
      if (full) {
        if (el.requestFullscreen) {
          el.requestFullscreen();
        }
      } else {
        if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    clickOnSvg () {
      this.currNode = null;
      this.$refs.nfs.hidden()
    },
    executeTest () {
      this.executeRightnow(true);
    },
    connectNode ({from, to}) {
      console.log(from, to);
      let errorText = checkNodeConnection(from, to);
      if (errorText) {
        this.$message.error(errorText);
        return;
      }

      this.saveRelation();
    },
    saveRelation () {
      let nextLinks = this.$refs.po.getConnectionsWithId();
      let simpleConnections = nextLinks.getSimpleConnections();
      return this.$store.dispatch('saveRelation', simpleConnections);
    },
    moveNodeDone (svgNode) {
      this.afterChangeNode(svgNode);
    },
  },
});

export default Cpt;
</script>

<template lang="html">
  <div class="process-on-area">
    <header class="op">
      <ProcessOperation
        :activityName="activityName"
        :disabledEdit="disabledEdit"
        :areaState="areaState"
        @delete="deleteNode"
        @save="save"
        @executeTest="executeTest"
        @executeRightnow="executeRightnow"
        @gobackList="gobackList" />
    </header>
    <div class="flex-box">
      <div class="node-list-top" v-show="!disabledEdit">
        <nodes-list
          :disabled-edit="disabledEdit"
          @execute-time="clickExecuteTime" />
      </div>
      <div class="po-box"  @dragover="nodeDragOver" @drop="nodeDrop">
        <process-on ref="po"
          :disabled-edit="disabledEdit"
          @click-node="clickOnNode"
          @clickOnSvg="clickOnSvg"
          @connectNode="connectNode"
          @moveNode="moveNodeDone" />

        <SvgOp
          @fullScreen="fullScreen"
          @shrink="svgShrink"
          @magnify="svgMagnify" />

        <NodeFormSetting
          :disabledEdit="disabledEdit"
          ref="nfs"
          @click="handleNodeFormSettingClick"
          @submit="changeNodeData"
          @delSubmit="remove"/>
      </div>
    </div>

    <process-setting-dialog
      @submit="submitSetting"
      ref="psd" />
    <process-execute-dialog
      :act-name="actName"
      @submit="submitSetting"
      @close="executeTimeClose"
      ref="ped" />
  </div>
</template>

<style lang="css">
@import 'src/assets/styles/var.css';
:root {
  --node-list-width: 160px;
}
@b process-on-area{
  box-sizing: border-box;
  width: 100%;
  min-height: 563px;
  height: 563px;
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

    .po-box {
      flex: 1;
      border: 1px solid #eee;
    }
  }
  .node-list-top {
    width: 160px;
    min-width: 160px;
    max-width: 160px;

    position: absolute;
    left: 5px;
    top: 30px;

    z-index: 1;
  }
}
</style>
