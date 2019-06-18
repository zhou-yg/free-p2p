import {NODE_COLLECTION} from '../data';

export default function checkData (type, formData) {
  let errorText;
  
  if (!formData.name) {
    errorText = `节点必须填写一个名称`;
    return errorText;
  }

  switch (type) {
    case NODE_COLLECTION.wait.type:
      const { time, waitDays, mode } = formData;
      if (
        (mode === 1 && (!time || waitDays === undefined)) ||
        (mode === 0 && !time)
      ) {
        errorText = `"${formData.name}"节点必须填写等待日期或天数`;
      }
      break;
    
    case NODE_COLLECTION.crowd.type:
      if (!formData.crowdId) {
        errorText = `"${formData.name}"节点必须选择一个人群`;
      }
      break;

    case NODE_COLLECTION.sms.type:
      if (!formData.tmpl || !formData.sign) {
        errorText = `"${formData.name}"节点必须含有 短信文案 和 有效的签名`;
      }
      break;

    case NODE_COLLECTION.coupon.type:
      if (!formData.couponId) {
        errorText = `"${formData.name}"节点必须选择一个优惠券`;
      }
      break;

    case NODE_COLLECTION.sendResponse.type:
      if (!formData.filterTypes.length) {
        errorText = `"${formData.name}"节点必须选择一个输出分支`;
      }
      break;

    case NODE_COLLECTION.effect.type:
      if (!formData.afterDay) {
        errorText = `"${formData.name}"节点必须填写分析截止时间`;
      }
      break;

    case NODE_COLLECTION.orderResponse.type:
      
      break;

    case NODE_COLLECTION.dealResponse.type:
      if (!formData.num) {
        errorText = `"${formData.name}"节点必须填写统计时间`;

        if (isNaN(formData.num)) {
          errorText = `"${formData.name}"节点的统计时间必须为数字`;
        }
      }
      break;
  }

  return errorText
}
