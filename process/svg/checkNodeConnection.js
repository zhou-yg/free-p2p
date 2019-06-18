import {NODE_COLLECTION} from '../data';

export default function checkNodeConnection (from, to) {
  let errorText = '';

if (!from.nextType.includes(to.type)) {
    switch (from.type) {
      case NODE_COLLECTION.start.type:
        errorText = `${from.name}节点后只能选择目标人群模块的节点`
        break;

      case NODE_COLLECTION.wait.type:
        errorText = `${from.name}节点后只能选择目标人群、人群运算、触达操作、客户响应模块的节点`
        break;
      
      case NODE_COLLECTION.crowdExcept.type:
      case NODE_COLLECTION.crowdExtract.type:
      case NODE_COLLECTION.crowdUnion.type:
      case NODE_COLLECTION.crowdUniq.type:
      case NODE_COLLECTION.crowdIntersect.type:
        errorText = `${from.name}节点后只能选择人群运算、触达操作、人群另存为模块的节点`
        break;

      case NODE_COLLECTION.crowd.type: 
      case NODE_COLLECTION.historyCrowd.type:
      case NODE_COLLECTION.crowdUniqChild.type:
      case NODE_COLLECTION.crowdExtractChild.type:
        errorText = `${from.name}节点后只能选择人群运算、触达操作、人群另存为模块的节点`
        break;

      case NODE_COLLECTION.sms.type:
      case NODE_COLLECTION.coupon.type:
      case NODE_COLLECTION.intergral.type:
        errorText = `${from.name}节点后只能选择客户响应、效果统计模块的节点`
        break;

      case NODE_COLLECTION.sendResponse.type:
      case NODE_COLLECTION.orderResponse.type:
      case NODE_COLLECTION.dealResponse.type:
        errorText = `${from.name}节点后只能选择人群运算、触达操作、人群另存为模块的节点`
        break;

      case NODE_COLLECTION.effect.type:
      case NODE_COLLECTION.saveAsCrowd.type:
        errorText = `${from.name}节点后不能选择任何节点`
        break;
      
      default:
        break;
    }
  }

  return errorText;
}
