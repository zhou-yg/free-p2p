import Raphael from 'raphael';
import raf from 'raf';
import delegates from 'delegates';
import NextLinks from './NextLinks';

const NORMAL_COLOR = '#516e78';
const DANGER_COLOR = '#ff4a46';

const IMAGE_URL_MAP = {};

const NODE_STATE_ICON = [
  require('cc/assets/images/svgNodes/node-state-success.png'),
  require('cc/assets/images/svgNodes/node-state-warning.png'),
];

const IMAGE_STATE_ICON = [
  // 绿色勾，红色叉，绿色旋转，黄色等待
  'https://img.alicdn.com/imgextra/i1/861472387/TB2PeU2weuSBuNjSsplXXbe8pXa_!!861472387.png',
  'https://img.alicdn.com/imgextra/i2/861472387/TB2v2pDwr9YBuNjy0FgXXcxcXXa_!!861472387.png',
  'https://img.alicdn.com/imgextra/i1/861472387/TB2kbT7n8mWBuNkSndVXXcsApXa_!!861472387.png',
  'https://img.alicdn.com/imgextra/i4/861472387/TB2ohB_wv5TBuNjSspcXXbnGFXa_!!861472387.png',
];

Raphael.fn.connection = function (obj1, obj2, event) {
  let line;
  if (obj1.line && obj1.from && obj1.to) {
    line = obj1;
    obj1 = line.from;
    obj2 = line.to;
  }
  let bb1 = obj1.getBBox();
  let bb2 = obj2.getBBox();
  let marginD = 4;
  let p = [{x: bb1.x + bb1.width / 2, y: bb1.y - marginD},  // 上
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + marginD}, // 下
        {x: bb1.x - marginD, y: bb1.y + bb1.height / 2},  // 左
        {x: bb1.x + bb1.width + marginD, y: bb1.y + bb1.height / 2}, // 3右
        {x: bb2.x + bb2.width / 2, y: bb2.y - marginD},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + marginD},
        {x: bb2.x - marginD, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + marginD, y: bb2.y + bb2.height / 2}];
  let d = {};
  let dis = [];
  let dx;
  let dy;
  for (let i = 0; i < 4; i++) {
    for (let j = 4; j < 8; j++) {
      dx = Math.abs(p[i].x - p[j].x);
      dy = Math.abs(p[i].y - p[j].y);
      if ((i === j - 4) || (((i !== 3 && j !== 6) || p[i].x < p[j].x) && ((i !== 2 && j !== 7) || p[i].x > p[j].x) && ((i !== 0 && j !== 5) || p[i].y > p[j].y) && ((i !== 1 && j !== 4) || p[i].y < p[j].y))) {
        dis.push(dx + dy);
        d[dis[dis.length - 1]] = [i, j];
      }
    }
  }
  let res;
  if (dis.length === 0) {
    res = [0, 4];
  } else {
    res = d[Math.min.apply(Math, dis)];
  }
  let x1 = p[res[0]].x;
  let y1 = p[res[0]].y;
  let x4 = p[res[1]].x;
  let y4 = p[res[1]].y;

  let arrowPath = [];
  let arrowSize = 2;
  let lineWidth = 2;
  // 下.上.右.左
  switch (res[1]) {
    case 4:
      arrowPath = ['L', x4 - arrowSize, y4 - arrowSize, 'L', x4 + arrowSize, y4 - arrowSize, 'L', x4, y4].join(',');
      break;
    case 5:
      arrowPath = ['L', x4 - arrowSize, y4 + arrowSize, 'L', x4 + arrowSize, y4 + arrowSize, 'L', x4, y4].join(',');
      break;
    case 6:
      arrowPath = ['L', x4 - arrowSize, y4 - arrowSize, 'L', x4 - arrowSize, y4 + arrowSize, 'L', x4, y4].join(',');
      break;
    case 7:
      arrowPath = ['L', x4 + arrowSize, y4 - arrowSize, 'L', x4 + arrowSize, y4 + arrowSize, 'L', x4, y4].join(',');
      break;
  }

  // console.log(x1, y1, x4, y4)
  // this.circle(x1, y1, 10).attr({'stroke': 2})
  // this.circle(x4, y4, 10).attr({'stroke': 2})

  // dx = Math.max(Math.abs(x1 - x4) / 2, 10)
  // dy = Math.max(Math.abs(y1 - y4) / 2, 10)
  // let x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3)
  // let y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3)
  // let x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3)
  // let y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3)
  // x1 = x1.toFixed(3)
  // y1 = y1.toFixed(3)
  // x4 = x4.toFixed(3)
  // y4 = y4.toFixed(3)
  let x2;
  let y2;
  let x3;
  let y3;
  let textX;
  let textY;

  // 上下方向
  if (res[1] === 4 || res[1] === 5) {
    x2 = x1.toFixed(3);
    y2 = ((y4 + y1) / 2).toFixed(3);

    textX = y1 === y4 ? (x1 + x4) / 2 : (parseFloat(x2) + x4) / 2;
    textY = y4 - 10;

    x3 = x4.toFixed(3);
    y3 = y2;
  } else {
    x2 = ((x4 + x1) / 2).toFixed(3);
    y2 = y1.toFixed(3);

    textX = y1 === y4 ? (x1 + x4) / 2 : (parseFloat(x2) + x4) / 2;
    textY = y4 - 10;

    x3 = x2;
    y3 = y4.toFixed(3);
  }

  x1 = x1.toFixed(3);
  y1 = y1.toFixed(3);
  x4 = x4.toFixed(3);
  y4 = y4.toFixed(3);

  let path = ['M', x1, y1, 'L', x2, y2, 'L', x3, y3, 'L', x4, y4, arrowPath].join(',');

  // if (event) {
  //   // @TODO 暂时如此，无法修改
  //   this.text(textX, textY, event).attr({
  //     'font-size': '12px'
  //   })
  // }

  if (line && line.line) {
    line.line.update(this, {
      path,
      eventOffset: {
        textX,
        textY,
      },
    });
  } else {
    let color = typeof line === 'string' ? line : '#516e78';
    line = new LineNode(event);
    line.generate(this, {
      path,
      attr: {
        stroke: color,
        fill: 'none',
        cursor: 'pointer',
        'stroke-width': 1,
      },
      eventOffset: {
        textX,
        textY,
      },
    });
    return {
      line,
      from: obj1,
      to: obj2,
    };
  }
};

function dragger (n, node) {
  if (node.type === 'image' || node.type === 'rect') {
    node.ox = node.attr('x') - n.centerPd;
    node.oy = node.attr('y') - n.centerPd;
  } else {
    node.ox = node.attr('cx') - n.centerPd;
    node.oy = node.attr('cy') - n.centerPd;
  }
};
function move (dx, dy) {
  let att = {x: this.ox + dx, y: this.oy + dy};

  if (this.type === 'image' || this.type === 'rect') {

  } else {
    att.cx = att.x;
    att.cy = att.y;
    delete att.x;
    delete att.y;
  }
  return att;
};
function up (e) {
  // this.animate({'fill-opacity': 0}, 500);
  console.log('up');
};

class ProcessShapesManager {
  constructor () {
    this.arr = []; // 包含Node类型，Raphael svg节点类型
  }
  add (node) {
    this.arr.push(node);
  }
  remove (node) {
    this.arr = this.arr.filter(n => {
      let r = n === node;
      if (r) {
        node.remove();
      }
      return !r;
    });
  }
  getAllNodes () {
    return this.arr.filter(n => n instanceof ImageNode);
  }
  findNode (tx, ty) {
    let find = null;
    // 允许的查找节点差误
    let randomErrorMargin = 3;
    this.arr.forEach((node) => {
      if (node instanceof Node) {
        const {x, y, w, h} = node;
        if (tx > x - randomErrorMargin && tx < x + w + randomErrorMargin && ty > y - randomErrorMargin && ty < y + h + randomErrorMargin) {
          find = node;
        }
      }
    });
    return find;
  }

  findNodeById (id) {
    return this.arr.filter(node => String(node.id) === String(id))[0];
  }

  findNodeByRNode (rNode) {
    return this.arr.filter(node => node.rNode === rNode)[0];
  }
}

class Node {
  constructor ({id, type, name, x, y, w = 48, h = 48, formData, onClick, onDoubleClickNode, origin}) {
    this.id = id; // 用于区分节点
    this.type = type; // 节点的数据类型
    this.name = name;
    this.centerBd = 6; // 节点底部超出节点的程度
    this.centerPd = 12; // 节点距离绘制边线的距离
    this.x = x; // 画布最大尺寸为10000，设置5000，5000为原点
    this.y = y;
    this.w = w;
    this.h = h;
    this.formData = formData || {}; // 节点携带的数据
    this.onClick = onClick || function () {};
    this.glowCache = null;
    this.canSelected = true; // 可否被选择
    this.isSelected = false; // 是否被选中了
    this.canMove = true;
    this.rNode = null; // 边界节点，参与计算位置
    // 包含的节点
    this.nodeKeys = ['rNode', 'baseCenterNode', 'centerNode', 'connectionNodes', 'stateNode'];
    // 预设值
    this.connectionNodes = [];

    this.origin = origin; // 节点的原始数据对象

    this.cacheState = null; // 节点状态
  }
  moveTo ({x, y}) {
    if (!this.canSelected || !this.canMove) {
      return;
    }
    let centerPd = this.centerPd;
    this.x = x;
    this.y = y;

    this.shadow(true);
    this.rNode.attr({
      cx: x + this.w / 2,
      cy: y + this.h / 2,
    });
    this.baseCenterNode.attr({
      cx: x + this.w / 2,
      cy: y + this.h / 2,
    });
    this.centerNode.attr({
      x: x + this.centerPd,
      y: y + this.centerPd,
    });

    [
      [x + this.w / 2, y],
      [x + this.w, y + this.h / 2],
      [x + this.w / 2, y + this.h],
      [x, y + this.h / 2],
    ].forEach(([x, y], i) => {
      this.connectionNodes[i].attr({
        cx: x,
        cy: y,
      });
    });
    if (this.rTextNode) {
      this.rTextNode.attr({
        x: x + this.w / 2,
        y: y + this.h + 12,
      });
    }
    if (this.stateNode) {
      this.markState();
    }
  }
  shadow (isRemove) {
    if (isRemove && this.glowCache) {
      // this.glowCache.remove()
      this.glowCache = null;
      this.baseCenterNode.attr({
        opacity: 0,
      });
    } else if (!isRemove) {
      this.baseCenterNode.attr({
        opacity: 0.2,
      });
      this.glowCache = true;
      // this.glowCache = this.baseCenterNode.glow({
      //   color: 'black',
      //   opacity: 0.2
      // })
    }
  }
  borderColor (color) {
    this.rNode.attr({
      'stroke': color,
    });
  }
  showConnectiosNodes (show) {
    this.connectionNodes.forEach(rNode => {
      rNode.attr({
        opacity: this.isSelected || show ? 1 : 0,
      });
    });
  }
  generate (r) {
    throw new Error('need specify a "generate" method');
  }
  markState (r, state) {
    const {x, y, w, h} = this;
    const bgR = 7;
    const centerCof = 2;
    const stateIcon = NODE_STATE_ICON[state];
    let centerPd = this.centerPd;

    let sx = x + w - bgR * centerCof / 1.2;
    let sy = h + y - bgR * centerCof / 1.2;
    if (r) {
      if (this.stateNode) {
        this.stateNode.remove();
      }
      this.stateNode = r.image(stateIcon, sx, sy, bgR * centerCof, bgR * centerCof).attr({
        fill: '#fff',
      });
    } else {
      this.stateNode.attr({
        x: sx,
        y: sy,
      });
    }
  }
  remove () {
    this.nodeKeys.forEach(k => {
      if (Array.isArray(this[k])) {
        this[k].forEach(child => {
          child && child.remove();
        });
      } else {
        this[k] && this[k].remove();
      }
    });
  }
  selected () {
    this.isSelected = true;
    this.showConnectiosNodes(true);
    this.shadow();
  }
  cancelSelected () {
    this.isSelected = false;
    this.showConnectiosNodes();
    this.shadow(true);
  }
}
let li = 0;
class LineNode extends Node {
  constructor (eventName) {
    super({
      id: Date.now() + li++,
    });
    // svg Node
    this.rNode = null;
    this.canSelected = true;
    this.canMove = false;
    this.baseCenterNode = this.rNode;
    this.eventName = eventName;
  }
  generate (r, {path, attr, eventOffset}) {
    this.rNode = r.path(path).attr(Object.assign({
      cursor: 'default',
    }, attr));
    this.baseCenterNode = this.rNode;

    if (this.eventName) {
      this.textNode = r.text(eventOffset.textX, eventOffset.textY, this.eventName).attr({
        'font-size': '12px',
      });
    }
  }
  update (r, {path, eventOffset}) {
    this.rNode = this.rNode.attr({path});
    if (this.eventName) {
      this.textNode.remove();
      this.textNode = r.text(eventOffset.textX, eventOffset.textY, this.eventName).attr({
        'font-size': '12px',
      });
    }
  }
  click () {
    return this.rNode.click.apply(this.rNode, arguments);
  }
  shadow (isRemove) {
    if (isRemove && this.glowCache) {
      this.glowCache.remove();
      this.glowCache = null;
    } else if (!isRemove) {
      this.glowCache = true;
      this.glowCache = this.baseCenterNode.glow({
        color: 'black',
        opacity: 0.2,
      });
    }
  }
}

export class ImageNode extends Node {
  constructor (config) {
    super(config);
    this.url = config.iconImg;
    this.fill = config.fill;
    this.prevType = config.prevType;
    this.nextType = config.nextType;
    this.limitNodeNum = config.limitNodeNum;
    this.canSelected = config.canSelected !== undefined ? config.canSelected : true; // 节点不能被选中
    this.canMove = config.canMove !== undefined ? config.canMove : true; // 节点不能被选中
    this.nodeKeys.push('rTextNode');
  }
  generate (r) {
    const centerPd = this.centerPd;

    // baseCenterNode 用以展示阴影
    this.baseCenterNode = r.circle(this.x + this.w / 2, this.y + this.h / 2, (this.w + this.centerBd) / 2);
    this.baseCenterNode.attr({
      'stroke-width': 0,
      'fill': this.fill,
      'opacity': 0,
    });

    this.rNode = r.circle(this.x + this.w / 2, this.y + this.h / 2, (this.w) / 2);
    this.rNode.attr({
      'stroke-width': 0,
      'fill': this.fill,
      cursor: this.canMove ? 'move' : 'default',
    });

    this.centerNode = r.image(this.url, this.x + centerPd, this.y + centerPd, this.w - centerPd * 2, this.h - centerPd * 2);
    this.centerNode.attr({
      cursor: this.canMove ? 'move' : 'default',
    });

    let hoverI = 0;
    [this.rNode, this.centerNode].forEach(n => {
      n.hover(() => {
        if (hoverI === 0) {
          this.showConnectiosNodes(true);
        }
        hoverI++;
      }, () => {
        hoverI--;
        if (hoverI === 0) {
          this.showConnectiosNodes();
        }
      });
    });

    this.connectionNodes = [
      [this.x + this.w / 2, this.y],
      [this.x + this.w, this.y + this.h / 2],
      [this.x + this.w / 2, this.y + this.h],
      [this.x, this.y + this.h / 2],
    ].map(([x, y]) => {
      const c = r.circle(x, y, 3);
      c.attr({
        cursor: 'pointer',
        fill: '#ffffff',
        stroke: '#5A5858',
        'stroke-width': 1,
        opacity: 0,
      });
      c.hover(() => {
        this.showConnectiosNodes(true);
      }, () => {
        this.showConnectiosNodes();
      });
      return c;
    });

    if (this.name) {
      this.rTextNode = r.text(this.x + this.w / 2, this.y + this.h + 12, this.name);
      this.rTextNode.attr({
        'font-size': 14,
      });
      this.rTextNode.node.style.userSelect = 'none';
    }
  }
  updateText (t) {
    this.rTextNode.attr({
      'text': t,
    });
  }
}

export class ProcessOn {

  constructor ({id, w = 640, h = 480, disabledEdit, onClickNode, onDoubleClickNode, onStateChange, onNodeConnect, onNodeMoveDone}) {
    window.PO = this;
    this.r = Raphael(id, w, h);  // 定义了大的绘制区域

    this.disabledEdit = disabledEdit;
    this.banRepeatMouseup = true; // 不明所以

    this.r.canvas.addEventListener('mousemove', (e) => {
      this.mousemove(e);
    });
    this.r.canvas.addEventListener('mouseup', (e) => {
      if (this.banRepeatMouseup) {
        this.banRepeatMouseup = false;
        return;
      }
      this.mouseup(e);
    });
    this.shapes = new ProcessShapesManager();  // 节点管理器，对节点增删
    this.connections = [];
    this.onClickNode = onClickNode || function () {};
    this.onStateChange = onStateChange || function () {};
    this.onNodeConnect = onNodeConnect || function () { return true; };
    this.onDoubleClickNode = onDoubleClickNode || function () {};
    this.onNodeMoveDone = onNodeMoveDone || function () {};
    this.editLineMode = false;
    this.editLineStart = {
      x: 0,
      y: 0,
      node: null,
    };
    this.editLinePath = null;

    this.selectedNode = null;
    this.prevSelectedNode = null;
  }
  refreshConnections () {
    for (let i = this.connections.length; i--;) {
      this.r.connection(this.connections[i]);
    }
  }
  clickCallback (node) {
    this.onClickNode.apply(this, arguments);
    if (node.canSelected) {
      if (node.isSelected || this.prevSelectedNode === node) {
        this.onDoubleClickNode.apply(this, arguments);
      }
      this.selectedNode = node;
      node.selected();
    }
  }
  parse (jsonArr) {

  }
  openEditLineMode () {
    this.editLineMode = !this.editLineMode;
    this.onStateChange('editLineMode', this.editLineMode);
  }
  // startConnectLine (n) {
  //   if (this.editLinePath) {
  //     return;
  //   }
  //   const {x, y, w, h} = n;
  //   this.editLineStart.x = x + w / 2;
  //   this.editLineStart.y = y + h / 2;
  //   this.editLineStart.node = n;
  // }
  mousemove (e) {
    if (this.disabledEdit) {
      return;
    }

    let x = e.offsetX;
    let y = e.offsetY;

    if (this.editLineMode && this.editLineStart.x) {
      let {x: x1, y: y1} = this.editLineStart;
      let dx = Math.max(Math.abs(x - x1) / 2, 10);
      let dy = Math.max(Math.abs(y - y1) / 2, 10);

      let linePath = ['M', x1, y1, 'C', x1 + dx, y1, x - dx, y, x, y].join(',');

      if (this.editLinePath) {
        this.editLinePath.attr({path: linePath});
      } else {
        this.editLinePath = this.r.path(linePath).attr({stroke: 2});
        let domNode = this.editLinePath.node;
        domNode.parentNode.insertBefore(domNode, domNode.parentNode.children[0]);
      }
    }
  }
  mouseup (e) {
    // 比node的mouseup先触发
    // var x = e.offsetX;
    // var y = e.offsetY;
    //
    // if (this.editLineMode) {
    //   let targetNode = this.shapes.findNode(x, y);
    //   console.log(`targetNode`, targetNode);
    //   if (targetNode) {
    //     if (this.onNodeConnect(this.editLineStart.node, targetNode)) {
    //       if (this.connectNode(this.editLineStart.node, targetNode)) {
    //         this.editLineMode = false;
    //         this.onStateChange('editLineMode', false);
    //       }
    //     }
    //   }
    //   if (this.editLinePath) {
    //     this.editLinePath.remove();
    //     this.editLinePath = null;
    //   }
    //   this.editLineStart = {};
    // }
    if (this.selectedNode) {
      this.selectedNode.cancelSelected();
    }
    this.prevSelectedNode = this.selectedNode;
    this.selectedNode = null;
  }
  connectNodeById (fromId, toId, event) {
    fromId = isNaN(Number(fromId)) ? fromId : Number(fromId);
    toId = isNaN(Number(toId)) ? toId : Number(toId);

    const fromNode = this.shapes.findNodeById(fromId);
    const toNode = this.shapes.findNodeById(toId);

    // console.log(fromId, toId, fromNode.name, toNode.name);

    return this.connectNode(fromNode, toNode, event);
  }
  connectNode (from, to, event) {
    if (from === to || !from || !to) {
      return;
    }

    // 只能和指定节点连接
    console.log(from.nextType);
    if (from.nextType && !from.nextType.includes(to.type)) {
      return;
    }

    if (this.connections.some(conn => {
      return conn.from === from.rNode && conn.to === to.rNode || conn.to === from.rNode && conn.from === to.rNode;
    })) {
      console.log('repeat');
      return;
    }
    let conn = this.r.connection(from.rNode, to.rNode, event);
    conn.line.click(() => {
      this.clickCallback(conn.line);
    });
    this.connections.push(conn);
    this.shapes.add(conn.line);
    return true;
  }
  cleanConnectLine (node) {
    let target = null;
    if (node instanceof Node) {
      target = node.rNode;
    } else {
      target = node;
    }

    this.connections = this.connections.filter(conn => {
      let removed = (conn.from === target || conn.to === target || conn.line.rNode === target);
      console.log(removed);
      if (removed) {
        this.shapes.remove(conn.line);
      }
      return !removed;
    });
  }
  cleanNext (node) {
    let cleanLineArr = [];
    this.connections.filter(conn => {
      let removed = (conn.from === node.rNode);
      if (removed) {
        const n = this.shapes.findNodeByRNode(conn.to);
        this.shapes.remove(n);
        cleanLineArr.push(conn.to);
      }
      return !removed;
    });
    cleanLineArr.forEach(to => this.cleanConnectLine(to));
  }

  dragNodeEvent (node) {
    let isDragger;

    // [node.baseCenterNode, node.rNode].forEach(n => {
    //   n.drag((dx, dy, _, __, e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //   }, (_, __, e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //   }, (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //   });
    // });

    [node.centerNode].forEach((n) => {
      n.drag((dx, dy, _, __, e) => {
        isDragger = true;
        // 老式连线的代码
        // if (this.editLineMode) {
        //   return;
        // }

        raf(() => {
          node.moveTo({
            x: node.centerNode.ox + dx,
            y: node.centerNode.oy + dy,
          });
          this.refreshConnections();
        });
        e.preventDefault();
        e.stopPropagation();
      }, (x, y, e) => {
        dragger(node, node.centerNode);

        e.preventDefault();
        e.stopPropagation();
      }, (e) => {
        if (isDragger) {
          node.moveTo({
            x: node.x,
            y: node.y,
          });
          this.refreshConnections();

          this.onNodeMoveDone(node);
        } else {
          this.clickCallback(node);
          e.preventDefault();
          e.stopPropagation();
        }

        isDragger = false;
      });
    });
  }
  connectionNodeEvent (node) {
    if (this.disabledEdit) {
      return;
    }

    node.connectionNodes.forEach(c => {
      c.drag((dx, dy, e) => {
        this.editLineMode = true;

        const {cx: x, cy: y} = c.attrs;
        this.editLineStart.x = x;
        this.editLineStart.y = y;
        this.editLineStart.node = node;
      }, (_, __, e) => {
        e.preventDefault();
        e.stopPropagation();
      }, (e) => {
        e.preventDefault();
        e.stopPropagation();
        let x = e.offsetX;
        let y = e.offsetY;
        if (this.editLineMode) {
          let targetNode = this.shapes.findNode(x, y);
          if (targetNode) {
            if (this.onNodeConnect(this.editLineStart.node, targetNode)) {
              if (this.connectNode(this.editLineStart.node, targetNode)) {
                this.editLineMode = false;
                this.onStateChange('editLineMode', false);
              }
            }
          }
          if (this.editLinePath) {
            this.editLinePath.remove();
            this.editLinePath = null;
          }
          this.editLineStart = {};
        }
        if (this.selectedNode) {
          this.selectedNode.cancelSelected();
        }
        this.selectedNode = null;
      });
    });
  }
  findNodeById (id) {
    return this.shapes.findNodeById(id);
  }
  addNode (node, prev) {
    if (!(node instanceof Node)) {
      throw new Error('addNode wrong type');
    }

    node.generate(this.r); // 绘制
    this.dragNodeEvent(node); // 添加拖拽事件
    this.connectionNodeEvent(node); // 添加连接事件
    this.shapes.add(node);
    if (prev) { // 有前置节点则添加
      this.connectNode(prev, node);
    }
    return node;
  }
  removeNode (removeIds = []) {
    if (removeIds) {
      const removedNodes = removeIds.map(id => this.shapes.findNodeById(id)).map(node => {
        this.cleanConnectLine(node);
        this.shapes.remove(node);
        return node;
      });
      return removedNodes;
    } else if (this.selectedNode) {
      const selectedNode = this.selectedNode;
      this.cleanConnectLine(selectedNode);
      this.shapes.remove(selectedNode);
      return selectedNode;
    }
  }
  getCurrentNode () {
    return this.selectedNode;
  }
  getConnectionsWithId () {
    const connections = this.connections.map((conn) => {
      const fromNode = this.shapes.findNodeByRNode(conn.from);
      const toNode = this.shapes.findNodeByRNode(conn.to);
      return {
        from: {
          id: fromNode.id,
          type: fromNode.type,
        },
        to: {
          id: toNode.id,
          type: toNode.type,
        },
      };
    });
    const allNodes = this.shapes.getAllNodes();

    // console.log(this.connections.length, JSON.stringify(connections, null, 2));
    return new NextLinks(connections, allNodes);
  }
  markNodeNormal (nodeId) {
    const node = this.shapes.findNodeById(nodeId);
    if (node) {
      node.borderColor(NORMAL_COLOR);
    }
  }
  markNodeError (nodeId) {
    const node = this.shapes.findNodeById(nodeId);
    if (node) {
      // node.borderColor(DANGER_COLOR)
      this.markNodeExeState(nodeId, 1);
    }
  }
  markNodeSuccess (nodeId) {
    const node = this.shapes.findNodeById(nodeId);
    if (node) {
      // node.borderColor(DANGER_COLOR)
      this.markNodeExeState(nodeId, 0);
    }
  }
  markNodeExeState (nodeId, state) {
    const node = this.shapes.findNodeById(nodeId);
    if (node) {
      node.markState(this.r, state);
    }
  }
}
