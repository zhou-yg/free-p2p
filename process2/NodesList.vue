<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue'
import {NODES_LIST, NODE_COLLECTION, UINodeMap} from './data'

const Cpt = Vue.extend({
  props: {
    disabledEdit: Boolean
  },
  data () {
    return {
      NODES_LIST,
      dialogMap: {
      }
    }
  },
  computed: {

  },
  mounted () {
    this.$nextTick(() => {
      // this.openDialog(null, 8, {
      //   name: '测试',
      //   input: '测试2号',
      //   inputX: '测试2号',
      // });
    })
  },
  methods: {
    dragStart (ev, data) {
      let img = new Image()
      img.src = data.img

      let n = new UINodeMap(data)

      ev.dataTransfer.dropEffect = 'move'
      ev.dataTransfer.setData('text/plain', JSON.stringify(n))
      ev.dataTransfer.setDragImage(img, 10, 10)
    }
  },
  components: {

  }
})

export default Cpt
</script>

<template lang="html">
  <div class="node-list">
    <ul class="list">
      <li v-for="n in NODES_LIST">
        <header>
          {{n.name}}
        </header>
        <ul class="child-list" >
          <li v-for="c in n.children" >
            <span class="text" draggable="true" @dragstart="(e) => dragStart(e, c)">
              <img class="node-icon" :src="c.img" alt="">
              {{c.name}}
            </span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="less" type="text/less"  scoped>
.node-list {
  background-color: #fff;
  width: 100%;
  box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.12);

  .list {
    header {
      padding-left: 1em;
      height: 3em;
      line-height: 3em;
      color: var(--title-color);
      border-bottom: 1px solid #e6e6e6;
    }
    li {
      line-height: 2em;
    }
    > li {
      border-left: 1px solid #e6e6e6;
      border-right: 1px solid #e6e6e6;
    }
    /*> li:last-child {
      .child-list {
        border: 0;
      }
    }*/
  }
  .child-list {

    > li {
      padding-left: 1em;
      height: 38px;
      line-height: 38px;
      cursor: pointer;

      .text {
        display: inline-block;
      }
      .node-icon{
        width: 28px;
        vertical-align: middle;
      }
    }
  }
}
</style>
