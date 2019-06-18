import {NODE_COLLECTION} from '../data'

function getTargetNodeByType (nodes, type) {
  return nodes.filter(n => n.type === type)[0]
}

export default function checkData (nodes) {
  let finalErrorText = null
  let finalEerrorId = null
  let successIds = []
  let errorIds = []
  nodes.forEach(nodeObj => {
    // if (errorText) {
    //   return
    // }
    let errorText
    let errorId
    switch (nodeObj.type) {
      // case NODE_COLLECTION.InitialState.type:
      //   if (!nodeObj.formData.variables.length) {
      //     errorId = nodeObj.id
      //     errorText = `"${nodeObj.name}"节点必须要一个变量`
      //   }
      //   break
      case NODE_COLLECTION.SendSmsMessage.type:
        if (!nodeObj.formData.yunpianTemplateId) {
          errorId = nodeObj.id
          errorText = `"${nodeObj.name}"节点必须要选择一个模板`
        }
        break
      case NODE_COLLECTION.SendWechatMessage.type:
        if (!nodeObj.formData.wxTemplateId) {
          errorId = nodeObj.id
          errorText = `"${nodeObj.name}"节点必须要选择一个模板`
        }
        break
    }
    if (!errorText) {
      successIds.push(nodeObj.id)
    } else {
      errorIds.push(nodeObj.id)
    }
    if (!finalErrorText && errorText) {
      finalErrorText = errorText
      finalEerrorId = errorId
    }
  })
  return {
    errorText: finalErrorText,
    errorId: finalEerrorId,
    errorIds,
    successIds
  }
}
