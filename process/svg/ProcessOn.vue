<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import pick from 'lodash/pick';
import delegates from 'delegates';
import {ProcessOn, ImageNode} from './ProcessOn';

const tempUrl = 'https://ecrm1.jkcrm.cn/BCRM-bootstrap/image/flow/NPS/begin.png';
window.tempUrl = tempUrl;

const Cpt = Vue.extend({
  props: {
    w: Number,
    h: Number,
    disabledEdit: Boolean,
    onConnect: {
      type: Function,
      default: () => true,
    },
  },
  data () {
    return {
    };
  },
  computed: {

  },
  mounted () {
    this.$nextTick(() => {
      this.initMoveEvent();
    });

    this.$store.dispatch('clearAllNodes');
    this.po = new ProcessOn({
      id: 'processOnArea',
      w: this.w,
      h: this.h,
      disabledEdit: this.disabledEdit,
      onClickNode: (ele) => {
        this.$emit('click-node', ele);
      },
      onDoubleClickNode: (ele) => {
        // this.$emit('double-click-node', ele);
      },
      onStateChange: (k, v) => {
      },
      onNodeConnect: (from, to) => {
        this.$emit('connectNode', {
          from,
          to,
        });
        return true;
      },
      onNodeMoveDone: (node) => {
        this.$emit('moveNode', node);
      },
    });
    delegates(this, 'po')
      .method('findNodeById')
      .method('removeNode')
      .method('getCurrentNode')
      .method('getConnectionsWithId')
      .method('connectNodeById')
      .method('markNodeNormal')
      .method('markNodeError')
      .method('markNodeSuccess');
  },
  methods: {
    setStates (states) {
      states = states.map(obj => {
        return pick(obj, ['nodeId', 'nodeStatus', 'failCause']);
      }).filter(obj => (obj.nodeStatus && obj.nodeStatus <= 3) || obj.nodeStatus === 0);

      states.forEach(obj => {
        this.po.markNodeExeState(obj.nodeId, obj.nodeStatus);
      });
    },
    addNode (node, prev) {
      return this.po.addNode(node, prev);
    },

    newNode (node, prevNode) {
      var svgNode;

      // 构建原始数据
      if (!(node instanceof ImageNode) && node.id) {
        svgNode = new ImageNode({
          id: node.id,
          type: node.type,
          name: node.name,
          x: node.x || node.offsetX,
          y: node.y || node.offsetY,
          url: node.img,
          formData: node.formData,
          prevType: node.prevType,
          nextType: node.nextType,
          limitNodeNum: node.limitNodeNum,
        });
        this.$emit('new-node', {svgNode});
      } else {
        svgNode = node;
      }
      return this.addNode(svgNode, prevNode);
    },


    updateName (svgNode) {
      svgNode.updateText(svgNode.name);
    },

    // transform;
    shrink () {
      if (this.scaleNum === undefined) {
        this.scaleNum = 1;
      }
      this.scaleNum -= 0.05;
      this.changeTransform('scale', [this.scaleNum, this.scaleNum]);
    },
    magnify () {
      if (this.scaleNum === undefined) {
        this.scaleNum = 1;
      }
      this.scaleNum += 0.05;
      this.changeTransform('scale', [this.scaleNum, this.scaleNum]);
    },
    changeTransform(action, valueArr) {
      //type action = scale | translate;
      let svg = this.$el.querySelector('svg');
      let transform = getComputedStyle(svg).transform;
      let indexArr;
      switch (action) {
        case 'translate':
          indexArr = [4, 5];
          break;
        case 'scale':
          indexArr = [0, 3];
          break;
      }
      let transformArr = transform.replace(/matrix\(|\)/g, '').split(', ')
      indexArr.forEach((i, i2) => {
        transformArr[i] = parseFloat(valueArr[i2]).toFixed(3).replace(/(\.[\d]+)0+$/, '$1');
      });
      svg.style.transform = `matrix(${transformArr.join(',')})`;
    },
    initMoveEvent () {
      let svg = this.$el.querySelector('svg');
      let isDown = false;
      let iX;
      let iY;
      svg.addEventListener('click', e => {
        if (e.target === svg) {
          this.$emit('clickOnSvg', e)
        }
      })
      svg.addEventListener('mousedown', (e) => {
        isDown = true;
        let {offsetX, offsetY} = e;
        iX = offsetX;
        iY = offsetY;
        svg.style.cursor = 'grabbing'
      });
      svg.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
          if (isDown) {
            let {offsetX, offsetY} = e;
            let dx = offsetX - iX;
            let dy = offsetY - iY;
            // console.log(e, offsetX, offsetY);
            let r = String(svg.style.transform).match(/-?\d+/g);

            let transform = getComputedStyle(svg).transform;
            let transformArr = transform.replace(/matrix\(|\)/g, '').split(', ')

            let ox = +transformArr[4];
            let oy = +transformArr[5];
            let size = 5;
            let tx = ox + dx > -10 * size ? -10 * size : ox + dx;
            let ty = oy + dy > -10 * size ? -10 * size : oy + dy;
            tx = tx < -900 * size ? -900 * size : tx;
            ty = ty < -900 * size ? -900 * size : ty;
            this.changeTransform('translate', [tx, ty]);
          }
        });
      });
      document.addEventListener('mouseup', (e) => {
        isDown = false;
        svg.style.cursor = 'grab'
      });
    },
  },
  components: {
  },
});

export default Cpt;
</script>

<template lang="html">
  <div class="process-on" id="processOnArea" >

  </div>
</template>

<style lang="css">

@b process-on{
}
#processOnArea {
  background-color:#fff;
  background-image: linear-gradient(180deg, #ffffff 20px, transparent 0), linear-gradient(270deg, #d8d8d8 2px, transparent 0);
  background-size: 22px 22px;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 100%;
  overflow: hidden;

  position: absolute;
  top: 0;
  left: 0;

  svg{
    width: 5000px;
    height: 5000px;
    max-height: 1000%;
    cursor: grab;
    transform: translate(-2500px, -2500px) scale(1, 1);
  }
}
</style>
