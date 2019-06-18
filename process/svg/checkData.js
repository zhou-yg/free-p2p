import {NODE_COLLECTION, getExtractNodes} from '../data';

export default function checkData (nodes) {
  let successIds = [];
  let errorIds = [];

  let finalErrorText = null;
  let finalEerrorId = null;

  nodes.forEach(nodeObj => {
    let errorText;
    let errorId;

    switch (nodeObj.type) {
      case NODE_COLLECTION.crowd.type:
        if (!nodeObj.formData.crowdId && nodeObj.formData.crowdId !== 0) {
          errorText = `"${nodeObj.name}"节点必须选择一个人群`;
          errorId = nodeObj.id;
        }
        break;

      case NODE_COLLECTION.sms.type:
        if (!nodeObj.formData.tmpl) {
          errorText = `"${nodeObj.name}"节点必须填写"短信文案"`;
          errorId = nodeObj.id;
        }
        break;
      case NODE_COLLECTION.coupon.type:
        if (!nodeObj.formData.couponId) {
          errorText = `"${nodeObj.name}"节点必须选择一个优惠券`;
          errorId = nodeObj.id;
        }
        break;
    }

    if (!errorText) {
      successIds.push(nodeObj.id);
    } else {
      errorIds.push(nodeObj.id);
    }
    if (!finalErrorText && errorText) {
      finalErrorText = errorText;
      finalEerrorId = errorId;
    }
  });
  return {
    errorText: finalErrorText,
    errorId: finalEerrorId,
    errorIds,
    successIds,
  };
}
