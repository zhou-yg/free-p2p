import {ImageNode} from 'cc/components/marketing/process/svg/ProcessOn';
import {cloneDeep} from 'lodash';

// 所有结点的引用
export const NODE_COLLECTION = {
  test: {
    name: 'test',
    type: 'test',
    data: () => ({
      crowdId: '',
    }),
  },
  start: {
    name: '开始',
    type: 0,
    typeName: 'start',
    iconImg: require('cc/assets/images/svgNodes/start.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-star@2x.png'),
    fill: '#687992',
    x: 200 + 2500,
    y: 200 + 2500,
    prevType: [],
    nextType: [1, 12],
    limitNodeNum: 50,
    data: () => ({
      crowdId: '',
    }),
  },
  wait: {
    name: '等待',
    type: 11,
    iconImg: require('cc/assets/images/svgNodes/wait.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-wait@2x.png'),
    fill: '#687992',
    typeName: 'wait',
    prevType: [0],
    nextType: [1, 12, 2, 3, 14, 15, 16, 4, 5, 6, 17, 7, 8],
    limitNodeNum: null,
    data: () => ({
      time: new Date().getTime(),
      waitDays: 10,
      mode: 0,
    }),
  },

  // 人群节点

  crowd: {
    name: '人群筛选',
    type: 1,
    iconImg: require('cc/assets/images/svgNodes/crowd-select.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-fqrq@2x.png'),
    fill: '#73c87c',
    prevType: [1, 11],
    nextType: [2, 3, 4, 14, 15, 16, 5, 6, 13],
    limitNodeNum: null,
    typeName: 'crowd',
    data: () => ({
      crowdId: '',
      crowdName: '',
    }),
  },
  historyCrowd: {
    name: '历史营销人群',
    type: 12,
    iconImg: require('cc/assets/images/svgNodes/crowd-history.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-lsrq@2x.png'),
    fill: '#73c87c',
    prevType: [1, 11],
    nextType: [2, 3, 4, 14, 15, 16, 5, 6, 13],
    limitNodeNum: null,
    typeName: 'historyCrowd',
    data: () => ({
      lastActivity: '', // 活动id
      crowdInstId: '', // 活动中的人群快照id
      crowdName: '', // 人群
      mode: 0, // 0, "全部"，1, "未下单客户"，2, "付款客户"，3, "下单客户"，4,"下单未付款客户"
    }),
  },

  // 操作

  crowdExtract: {
    name: '人群抽取',
    type: 2,
    typeName: 'crowdExtract',
    iconImg: require('cc/assets/images/svgNodes/operator-extract.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-lsrq@2x.png'),
    fill: '#687992',
    prevType: [11, 1, 12, 2, 3, 14, 15, 16, 4, 5, 6],
    nextType: [2, 3, 14, 15, 16, 12, 5, 6, 13, 10],
    limitNodeNum: null,
    data: () => ({
      mode: 0,
      branchNum: 2,
      percent: [1, 0],
      num: [1, 0],
      note: '',
    }),
  },
  crowdIntersect: {
    name: '交集',
    iconImg: require('cc/assets/images/svgNodes/operator-intersect.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-intersect@2x.png'),
    fill: '#687992',
    type: 3,
    typeName: 'crowdIntersect',
    prevType: [11, 1, 12, 2, 3, 14, 15, 16, 4, 5, 6],
    nextType: [2, 3, 14, 15, 16, 12, 5, 6, 13],
    limitNodeNum: null,
    data: () => ({
      gather: 'intersect',
    }),
  },
  crowdUnion: {
    name: '并集',
    type: 15,
    iconImg: require('cc/assets/images/svgNodes/operator-union.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-union@2x.png'),
    fill: '#687992',
    typeName: 'crowdUnion',
    prevType: [11, 1, 12, 2, 3, 14, 15, 16, 4, 5, 6],
    nextType: [2, 3, 14, 15, 16, 12, 5, 6, 13],
    limitNodeNum: null,
    data: () => ({
      gather: 'union',
    }),
  },
  crowdExcept: {
    name: '差集',
    type: 16,
    iconImg: require('cc/assets/images/svgNodes/operator-subtract.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-subtract@2x.png'),
    fill: '#687992',
    typeName: 'crowdExcept',
    prevType: [11, 1, 12, 2, 3, 14, 15, 16, 4, 5, 6],
    nextType: [2, 3, 14, 15, 16, 12, 5, 6, 13],
    limitNodeNum: null,
    data: () => ({
      gather: 'except',
      preNodeIds: [], // 仅在前端需要使用
    }),
  },
  crowdUniq: {
    name: '排重',
    type: 14,
    iconImg: require('cc/assets/images/svgNodes/operator-uniq.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-difference@2x.png'),
    fill: '#687992',
    typeName: 'crowdUniq',
    prevType: [11, 1, 12, 2, 3, 14, 15, 16, 4, 5, 6],
    nextType: [2, 3, 14, 15, 16, 12, 5, 6, 13, 18 ],
    limitNodeNum: null,
    data: () => ({
      preNodeIds: [], // 仅在前端需要使用
      outputNames: [], // 仅在前端需要使用
    }),
  },

  // 营销操作
  sms: {
    name: '文本短信',
    type: 4,
    iconImg: require('cc/assets/images/svgNodes/send-sms.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-sms@2x.png'),
    fill: '#00baff',
    typeName: 'sms',
    prevType: [11, 1, 12, 2, 3, 14, 15, 16, 4, 5, 6],
    nextType: [17, 7, 8, 9],
    limitNodeNum: null,
    data: () => ({
      sign: '',
      tmpl: '',
      exeType: 0,
      delayTime: 0,
      testPhones: '',
    }),
  },
  coupon: {
    name: '优惠券',
    type: 5,
    iconImg: require('cc/assets/images/svgNodes/send-coupon.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-yhq@2x.png'),
    fill: '#00baff',
    typeName: 'coupon',
    prevType: [11, 1, 12, 2, 3, 14, 15, 16, 4, 5, 6],
    nextType: [17, 7, 8, 9],
    limitNodeNum: null,
    data: () => ({
      couponId: null,
      exeType: 0,
      delayTime: 0,
      testWw: '旺旺',
    }),
  },
  intergral: {
    name: '积分',
    type: 6,
    typeName: 'intergral',
    iconImg: require('cc/assets/images/svgNodes/send-intergral.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-jf@2x.png'),
    fill: '#00baff',
    prevType: [11, 1, 12, 2, 3, 14, 15, 16, 4, 5, 6],
    nextType: [17, 7, 8, 9],
    limitNodeNum: null,
    data: () => ({
      num: 10,
      limit: 22,
      exeType: 0,
      delayTime: 0,
    }),
  },

  // 响应节点
  orderResponse: {
    name: '订单响应',
    type: 17,
    iconImg: require('cc/assets/images/svgNodes/reponse-order.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-ddxy@2x.png'),
    fill: '#707fe0',
    typeName: 'orderResponse',
    prevType: [11, 4, 5, 6],
    nextType: [2, 3, 14, 15, 16, 4, 5, 6, 13],
    limitNodeNum: null,
    data: () => ({
      relation: 0,
      tradeRules: [],
    }),
  },
  sendResponse: {
    name: '发送响应',
    type: 7,
    iconImg: require('cc/assets/images/svgNodes/response-send.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-fsxy@2x.png'),
    fill: '#707fe0',
    typeName: 'sendResponse',
    prevType: [11, 4, 5, 6],
    nextType: [2, 3, 14, 15, 16, 4, 5, 6, 13],
    limitNodeNum: null,
    data: () => ({
      filterTypes: [4, 3],
      note: '',
      isParentType4: true,
    }),
  },
  dealResponse: {
    name: '成交响应',
    type: 8,
    iconImg: require('cc/assets/images/svgNodes/response-deal.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-xwxy@2x.png'),
    fill: '#707fe0',
    typeName: 'dealResponse',
    prevType: [11, 4, 5, 6],
    nextType: [2, 3, 14, 15, 16, 4, 5, 6, 13],
    limitNodeNum: null,
    data: () => ({
      num: '',
      r_tradePeriod: true,
      rules: {
        r_cartPeriod: false,
      },
    }),
  },

  // 最后
  saveAsCrowd: {
    name: '另存为人群',
    type: 13,
    iconImg: require('cc/assets/images/svgNodes/save-crowd.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-resave@2x.png'),
    fill: '#707fe0',
    typeName: 'saveAsCrowd',
    prevType: [1, 12, 2, 3, 14, 15, 16, 4, 5, 6],
    nextType: [],
    limitNodeNum: null,
    data: () => ({
      crowdName: '大促人群',
    }),
  },

  effect: {
    name: '活动效果',
    type: 9,
    iconImg: require('cc/assets/images/svgNodes/result.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-xgtj@2x.png'),
    fill: '#707fe0',
    typeName: 'effect',
    prevType: [4, 5, 6],
    nextType: [],
    limitNodeNum: null,
    data: () => ({
      afterDay: 7,
    }),
  },

  // 抽象节点，衍生生成的

  crowdExtractChild: {
    name: '人群抽取子节点',
    type: 10,
    iconImg: require('cc/assets/images/svgNodes/operator-extract.png'),
    fill: '#687992',
    typeName: 'crowdExtractChild',
    prevType: [],
    nextType: [2, 3, 4, 14, 15, 16, 5, 6, 13],
    data: () => ({
      value: 0,
      mode: 0,
    }),
  },
  crowdUniqChild: {
    name: '排重运算子节点',
    type: 18,
    iconImg: require('cc/assets/images/svgNodes/operator-uniq.png'),
    fill: '#687992',
    typeName: 'crowdUniqChild',
    prevType: [],
    nextType: [2, 3, 4, 14, 15, 16, 5, 6, 13],
    data: () => ({
    }),
  },

  testLogic: {
    name: '测试条件节点',
    type: 20,
    typeName: 'testLogic',
    data: () => ({
    }),
  },
};

// 节点分类
export const NODES_LIST = {
  start: {
    name: '开始',
    iconImg: require('cc/assets/images/svgNodes/process.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-lccz@2x.png'),
    fill: '#687992',
    children: [
      // NODE_COLLECTION.start,
      NODE_COLLECTION.wait,
    ],
  },
  crowd: {
    iconImg: require('cc/assets/images/svgNodes/target-crowd.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-target@2x.png'),
    fill: '#73c87c',
    name: '人群',
    children: [
      NODE_COLLECTION.crowd,
      NODE_COLLECTION.historyCrowd,
    ],
  },
  operator: {
    name: '人群运算',
    iconImg: require('cc/assets/images/svgNodes/crowd-operator.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-rqys@2x.png'),
    fill: '#687992',
    children: [
      NODE_COLLECTION.crowdExtract,
      NODE_COLLECTION.crowdIntersect,
      NODE_COLLECTION.crowdUnion,
      NODE_COLLECTION.crowdExcept,
      NODE_COLLECTION.crowdUniq,
    ],
  },
  marketing: {
    name: '触达操作',
    iconImg: require('cc/assets/images/svgNodes/crowd-operator.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-cdcz@2x.png'),
    fill: '#00baff',
    children: [
      NODE_COLLECTION.sms,
      NODE_COLLECTION.coupon,
      NODE_COLLECTION.intergral,
    ],
  },
  response: {
    name: '客户响应',
    iconImg: require('cc/assets/images/svgNodes/user-response.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-khxy@2x.png'),
    fill: '#707fe0',
    children: [
      NODE_COLLECTION.sendResponse,
      NODE_COLLECTION.dealResponse,
      NODE_COLLECTION.orderResponse,
    ],
  },
  saveAsCrowd: {
    name: '人群另存为',
    iconImg: require('cc/assets/images/svgNodes/save-crowd.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-resave@2x.png'),
    fill: '#707fe0',
    children: [
      NODE_COLLECTION.saveAsCrowd,
    ],
  },
  result: {
    name: '结果',
    iconImg: require('cc/assets/images/svgNodes/result.png'),
    iconImgDefault: require('cc/assets/images/svgNodes/normal/icon-xgtj@2x.png'),
    fill: '#707fe0',
    children: [
      NODE_COLLECTION.effect,
    ],
  },
};

export const NODE_COLLECTION_TYPES = Object.keys(NODE_COLLECTION).map(name => {
  return {
    [NODE_COLLECTION[name].type]: NODE_COLLECTION[name],
  };
}).reduce((p, n) => ({...p, ...n}));

// 节点前后的连接关系限制
export const NODE_CONNECT = {
  [NODE_COLLECTION.start.type]: {
    prevTypes: [],
    nextTypes: [
      ...NODES_LIST.crowd.children.map(obj => obj.type),
    ],
  },
  [NODE_COLLECTION.wait.type]: {
    prevTypes: [
      NODE_COLLECTION.start.type,
    ],
    nextTypes: [
      ...NODES_LIST.crowd.children.map(obj => obj.type),
      ...NODES_LIST.operator.children.map(obj => obj.type),
      ...NODES_LIST.marketing.children.map(obj => obj.type),
      ...NODES_LIST.response.children.map(obj => obj.type),
    ],
  },

  ...[
    NODE_COLLECTION.crowd.type,
    NODE_COLLECTION.historyCrowd.type,
  ].map(type => {
    return {
      [type]: {
        prevTypes: [
          NODE_COLLECTION.start.type,
          NODE_COLLECTION.wait.type,
        ],
        nextTypes: [
          ...NODES_LIST.operator.children.map(obj => obj.type),
          ...NODES_LIST.marketing.children.map(obj => obj.type),
          ...NODES_LIST.saveAsCrowd.children.map(obj => obj.type),
        ],
      },
    };
  }).reduce((p, n) => Object.assign(p, n), {}),

  ...[
    NODE_COLLECTION.crowdIntersect.type,
    NODE_COLLECTION.crowdUnion.type,
    NODE_COLLECTION.crowdExcept.type,
    NODE_COLLECTION.crowdUniq.type,
    NODE_COLLECTION.crowdExtract.type,
  ].map(type => {
    return {
      [type]: {
        prevTypes: [
          NODE_COLLECTION.wait.type,
          ...NODES_LIST.crowd.children.map(obj => obj.type),
          ...NODES_LIST.operator.children.map(obj => obj.type),
          ...NODES_LIST.response.children.map(obj => obj.type),
        ],
        nextTypes: [
          ...NODES_LIST.operator.children.map(obj => obj.type),
          ...NODES_LIST.marketing.children.map(obj => obj.type),
          ...NODES_LIST.saveAsCrowd.children.map(obj => obj.type),
        ],
      },
    };
  }).reduce((p, n) => Object.assign(p, n), {}),

  ...[
    NODE_COLLECTION.sms.type,
    NODE_COLLECTION.coupon.type,
    NODE_COLLECTION.intergral.type,
  ].map(type => {
    return {
      [type]: {
        prevTypes: [
          NODE_COLLECTION.wait.type,
          ...NODES_LIST.crowd.children.map(obj => obj.type),
          ...NODES_LIST.operator.children.map(obj => obj.type),
          ...NODES_LIST.response.children.map(obj => obj.type),
        ],
        nextTypes: [
          ...NODES_LIST.response.children.map(obj => obj.type),
          ...NODES_LIST.result.children.map(obj => obj.type),
        ],
      },
    };
  }).reduce((p, n) => Object.assign(p, n), {}),

  ...[
    NODE_COLLECTION.dealResponse.type,
    NODE_COLLECTION.orderResponse.type,
    NODE_COLLECTION.sendResponse.type,
  ].map(type => {
    return {
      [type]: {
        prevTypes: [
          NODE_COLLECTION.wait.type,
          ...NODES_LIST.marketing.children.map(obj => obj.type),
        ],
        nextTypes: [
          ...NODES_LIST.operator.children.map(obj => obj.type),
          ...NODES_LIST.marketing.children.map(obj => obj.type),
          ...NODES_LIST.saveAsCrowd.children.map(obj => obj.type),
        ],
      },
    };
  }).reduce((p, n) => Object.assign(p, n), {}),

  [NODE_COLLECTION.saveAsCrowd.type]: {
    prevTypes: [
      ...NODES_LIST.crowd.children.map(obj => obj.type),
      ...NODES_LIST.operator.children.map(obj => obj.type),
      ...NODES_LIST.response.children.map(obj => obj.type),
    ],
    nextTypes: [],
  },
  [NODE_COLLECTION.effect.type]: {
    prevTypes: [
      ...NODES_LIST.marketing.children.map(obj => obj.type),
    ],
    nextTypes: [],
  },
};

export const GET_NODE_COLLECTION = () => cloneDeep(NODE_COLLECTION);

export class UINodeMap {
  constructor (listNode, id) {
    if (!['name', 'type'].every(k => k in listNode)) {
      throw new Error('非法画布节点');
    }

    const d = listNode.presetData || listNode.data;

    Object.assign(this, listNode, {
      id,
      offsetX: 0,
      offsetY: 0,
      formData: d ? d() : {},
    });
  }
}

export function getExtractNodes ({id, type, formData, x = 0, y = 0}) {
  switch (type) {
    case NODE_COLLECTION.crowdExtract.type:
      return new Array(formData.branchNum || 2).fill(0).map((_, i) => {
        const num = (formData.num || [])[i] || 0;
        var obj = {
          type: NODE_COLLECTION.crowdExtractChild.type,
          x: 0,
          y: 0,
          iconImg: NODE_COLLECTION_TYPES[type] ? NODE_COLLECTION_TYPES[type].iconImg : '',
          fill: NODE_COLLECTION_TYPES[type] ? NODE_COLLECTION_TYPES[type].fill : '',
          nextType: NODE_COLLECTION_TYPES[type] ? NODE_COLLECTION_TYPES[type].nextType : '',
          name: formData.mode === 0 ? `抽取${num}%` : `抽取${num}人`,
          formData: {
            mode: formData.mode,
            value: num,
          },
        };
        const n = new ImageNode(obj);
        return n;
      });
    case NODE_COLLECTION.crowdUniq.type:
      return new Array(formData.preNodeIds.length).fill(0).map((_, i) => {
        var obj = {
          type: NODE_COLLECTION.crowdUniqChild.type,

          iconImg: NODE_COLLECTION_TYPES[type] ? NODE_COLLECTION_TYPES[type].iconImg : '',
          fill: NODE_COLLECTION_TYPES[type] ? NODE_COLLECTION_TYPES[type].fill : '',
          nextType: NODE_COLLECTION_TYPES[type] ? NODE_COLLECTION_TYPES[type].nextType : '',

          x: 0,
          y: 0,
          name: formData.outputNames && formData.outputNames[i] ? formData.outputNames[i] : `人群排重子节点${i + 1}`,
          formData: {
          },
        };
        const n = new ImageNode(obj);
        return n;
      });
  }
  return [];
}
