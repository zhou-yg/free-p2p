import {NODE_COLLECTION, NODES_LIST} from '../data';

// 1、链路完整性：漏连、错连、死循环均需要进行判断；
//     1）人群选择：只能后接节点，前无节点；
//     2）人群抽取：只能前接人群选择；
//     3）人群运算：前接人群选择或人群抽取生成的新人群，必须有2个及以上人群；
//     4）短信、积分、优惠券：对应链路前面必须包含人群相关节点；
//     5）发送响应、成交响应、活动效果：对应链路前面必须包含短信、积分、优惠券其一；
//     6）每条链路必须包含效果分析；

export default function checkLinkNode (nodes, nextLinks) {
  const nodeIdMap = nodes.map(o => {
    return {
      [o.id]: o,
    };
  }).reduce((p, n) => Object.assign(p, n), {});
  console.log(nextLinks);
  console.log(nextLinks.getSimpleConnections());

  const validatesFuncs = [
    function () {
      // ---
      const errorsChildren = nextLinks.getMultiNext(true);
      if (errorsChildren.length > 0) {
        const names = errorsChildren.map(id => ({
          name: nodeIdMap[id].name,
          type: nodeIdMap[id].type,
        })).filter(({name, type}) => {
          // 人群运算节点可以有多个前节点
          return type !== null;
        }).map(({name}) => name).join(', ');

        if (names) {
          return `"${names}" 不能连接多个前节点，请删除多余的前节点`;
        }
      } else {
        // const hasCowrdCalNode = nextLinks.hasTypes(NODES_LIST[0].children[2].type);
        // if (hasCowrdCalNode) {
        //   errorText = `"人群运算" 必须连接2个人群相关的前节点`;
        // }
      }
    },
    function () {
      const errorsChildren2 = nextLinks.getMultiNext();
      if (errorsChildren2.length > 0) {
        // const names = errorsChildren2.map(id => ({
        //   name: nodeIdMap[id].name,
        //   type: nodeIdMap[id].type,
        // })).filter(({type}) => {
        //   // 开始，人群相关的 节点可以有多个后节点
        //   var r1 = type !== NODES_LIST[0].children[1].type;
        //   r1 = r1 && type !== NODES_LIST[0].children[0].type;
        //   r1 = r1 && type !== NODES_LIST[0].children[2].type;
        //
        //   r1 = r1 && type !== NODES_LIST[2].children[0].type;
        //   r1 = r1 && type !== NODES_LIST[2].children[1].type;
        //
        //   // 营销类的可以有多个后节点
        //   r1 = r1 && type !== NODES_LIST[1].children[0].type;
        //   r1 = r1 && type !== NODES_LIST[1].children[1].type;
        //   r1 = r1 && type !== NODES_LIST[1].children[2].type;
        //
        //   return type && r1;
        // }).map(({name}) => name).join(', ');
        //
        // if (names) {
        //   errorText = `"${names}" 不能连接多个后节点，请删除多余的后节点`;
        // }
      } else {
        // const hasCowrdCalNode = nextLinks.hasTypes(NODES_LIST[0].children[1].type);
        // if (hasCowrdCalNode) {
        //   return `"人群抽取" 未设置数据`;
        // }
      }
    },
    function () {
      var hasMarketingTypes = NODES_LIST.marketing.children.filter(c => {
        return nextLinks.hasTypes(c.type);
      }).map(c => c.type);

      if (hasMarketingTypes.length > 0) {
        let isMarketingHasCrowd = hasMarketingTypes.every(t => {
          return nextLinks.findTypeBefore(NODE_COLLECTION.crowd.type, t);
        });
        if (!isMarketingHasCrowd) {
          return '营销节点（短信、积分、优惠券）所在的链路前面必须包含"人群选择"';
        }
      } else {
        return '画布至少要包含一个营销节点（短信、积分、优惠券）';
      }
    },
    function () {
      var hasResultTypes = [...NODES_LIST.response.children, ...NODES_LIST.result.children].filter(c => {
        return nextLinks.hasTypes(c.type);
      }).map(c => c.type);

      // if (hasResultTypes.length > 0) {
      //   let isResultHasMarketing = hasResultTypes.every(t => {
      //     console.log(NODES_LIST)
      //     return NODES_LIST.sms.children.some(o => {
      //       return nextLinks.findTypeBefore(o.type, t);
      //     });
      //   });
      //   if (!isResultHasMarketing) {
      //     return '响应结果节点（发送响应、成交响应、活动效果）所在的链路必须包含营销节点（短信、积分、优惠券）';
      //   }
      // }
      if (!hasResultTypes.includes(NODE_COLLECTION.effect.type)) {
        return '每条链路的尾部都必须添加 一个"活动效果"节点';
      }
    },
    function () {
        // 运算节点的parent
      const calcluateNodesParents = nodes.filter(n => n.type === NODE_COLLECTION.crowdExcept.type).map(n => {
        return {
          name: n.name,
          gather: n.formData.gather,
          next: nextLinks.getNext(n.id, true),
        };
      }).filter(obj => {
        return obj && obj.gather === 'except' && obj.next.length !== 2;
      });

      if (calcluateNodesParents.length > 0) {
        return `"${calcluateNodesParents.map(n => n.name).join(',')}" 运算方式为“排除”时，只能连接2个前置节点`;
      }
    },
    function () {
      if (!nextLinks.existsTypeInSingle(NODE_COLLECTION.effect.type)) {
        return `"${NODE_COLLECTION.effect.name}" 节点必须存在于每条链路的结尾`;
      }
    },
  ];

  var i = 0;
  var errorText;
  while (i < validatesFuncs.length) {
    if (errorText) {
      break;
    } else {
      errorText = validatesFuncs[i]();
    }
    i++;
  }

  return {
    errorText,
    simpleConnections: nextLinks.getSimpleConnections(),
  };
}
