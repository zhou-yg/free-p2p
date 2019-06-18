<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import {NODES_LIST, UINodeMap} from './data';

const Cpt = Vue.extend({
  props: {
    disabledEdit: Boolean,
  },
  data () {
    return {
      NODES_LIST,
      listState: 1, // 0收起，1展开
    };
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
    });
  },
  methods: {
    dragStart (ev, data) {

      ev.dataTransfer.dropEffect = 'move';
      ev.dataTransfer.setData('text/plain', JSON.stringify(data));
      // ev.dataTransfer.setDragImage(ev.target, 10, 10);
    },
  },
  components: {

  },
});

export default Cpt;
</script>

<template lang="html">
  <div class="node-list" v-if="!disabledEdit">
    <div class="list-start" v-if="listState === 0" @click="listState = 1" >
      选取组件&nbsp;
      <span class="arrow">></span>
    </div>

    <div class="list-expand" v-if="listState === 1" >
      <div class="list-start" @click="listState = 0">
        选取组件&nbsp;
        <span class="arrow">
          <
        </span>
      </div>
      <ul class="list" v-if="listState === 1">
        <li v-for="n in NODES_LIST" class="parent-li">
          <header>
            <span class="icon-pre hover" :style="{
               'background': n.fill,
              }">
              <img :src="n.iconImg" alt="">
            </span>
            <span class="icon-pre default" >
              <img :src="n.iconImgDefault" alt="">
            </span>
            {{n.name}}


            <ul class="child-list" >
              <li v-for="c in n.children" >
                <span class="text" draggable="true" @dragstart="(e) => dragStart(e, c)">
                  <span class="icon-pre hover2" :style="{
                     'background': c.fill,
                    }">
                    <img :src="c.iconImg" alt="">
                  </span>
                  <span class="icon-pre default2" >
                    <img :src="c.iconImgDefault" alt="">
                  </span>
                  {{c.name}}
                </span>
              </li>
            </ul>

          </header>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import 'src/assets/styles/var.css';
.list-start {
  box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.12);
  border: solid 1px #d3d3d3;
  width: 100px;
  height: 37px;
  line-height: 37px;
  text-align: center;
  cursor: pointer;
  .arrow {
    color: #00abfb;
  }
}
.list-expand {
  padding-top: 8px;
  width: 100%;
  box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.12);

  .list-start {
    box-sizing: border-box;
    width: 100%;
    box-shadow: none;
    border: 0;
    text-align: left;
    padding: 0 16px;

    .arrow {
      float: right;
    }
  }

  .list {

    header {
      padding-left: 1em;
      height: 40px;
      line-height: 40px;
      color: var(--title-color);
      /* border-bottom: 1px solid #e6e6e6; */
      user-select: none;
      cursor: pointer;

      .hover,
      .hover2 {
        display: none;
      }

      &:hover {
        background-color: #f5f9ff;
        .hover {
          display: inline-block;
        }
        .default {
          display: none;
        }
      }

      &:hover .child-list {
        display: block;
      }
    }
    li {
      line-height: 2em;
    }
    .parent-li {
      position: relative;
    }
  }
  .child-list {
    background-color: #fff;
    position: absolute;
    left: 100%;
    top: 0;
    z-index: 1;
    width: 150px;

    border-radius: 4px;
    box-shadow: 0 4px 7px 0 rgba(47, 137, 220, 0.2);
    display: none;
    > li {
      padding-left: 1em;
      height: 40px;
      line-height: 40px;
      cursor: pointer;

      &:hover {
        background-color: #f5f9ff;

        .hover2 {
          display: inline-block;
        }
        .default2 {
          display: none;
        }
      }

      .text {
        padding: 0 8px;
        display: inline-block;
      }
      .node-icon{
        width: 28px;
        vertical-align: middle;
      }
    }
  }
}
.node-list {
  background-color: #fff;
  width: 137px;

  .icon-pre {
    background-color: #e5f0fa;
    width: 24px;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    font-size: 0;
    > img {
      width: 12px;
      height: 12px;
      position: relative;
      top: 6px;
    }
  }
}
</style>
