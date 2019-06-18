import {NODE_COLLECTION} from '../data'

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
      [o.id]: o
    }
  }).reduce((p, n) => Object.assign(p, n), {})
  console.log(nextLinks)
  console.log(nextLinks.getSimpleConnections())

  const validatesFuncs = [

    function () {
      // check error
    }
  ]

  let i = 0
  let errorText
  while (i < validatesFuncs.length) {
    if (errorText) {
      break
    } else {
      errorText = validatesFuncs[i]()
    }
    i++
  }

  return {
    errorText,
    simpleConnections: nextLinks.getSimpleConnections()
  }
}
