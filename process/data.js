export const NODE_COLLECTION = {
  SendSmsMessage: {
    name: '发送短信',
    type: 'SendSmsMessage',
    fill: '#4A90E2',
    iconImg: require('@/../static/img/flow/flow-sms.png'),
    data: () => ({
      recipient: '{{trigger.request.body.mobile}}',
      apikey: '',
      body: '',
      yunpianTemplateId: '',
      yunpianTemplateContent: '',
      yunpianTemplateVariables: []
    }),
    output: []
  },
  SendWechatMessage: {
    name: '发送微信模版消息',
    type: 'SendWechatMessage',
    fill: '#4A90E2',
    iconImg: require('@/../static/img/flow/flow-wechat.png'),
    data: () => ({
      recipient: '{{trigger.request.body.mobile}}',
      wxTemplateId: '',
      wxAccountId: '',
      wxTemplateVariables: [
        // {
          // variableName: wechatVarName,
          // value: '{{trigger.request.body.var1}}'
          // color: ''
        // }
      ]
    })
  },
  Branch: {
    name: '用户是否绑定微信',
    fill: '#417505',
    iconImg: require('@/../static/img/flow/flow-branch.png'),
    data: () => ({
    })
  },
  InitialState: {
    name: '接口请求触发',
    fill: '#4D0B63',
    iconImg: require('@/../static/img/flow/flow-api.png'),
    type: 'InitialState',
    data: () => ({
      flowUrl: '初始URL test',
      variables: ['test']
    })
  },

  logic: {
    name: '逻辑分支节点',
    type: 'logic',
    data: () => ({
      bool: 0
    })
  }

}

export const NODES_LIST = [
  {
    name: '预置',
    children: [
      NODE_COLLECTION.InitialState,
      NODE_COLLECTION.Branch,
      NODE_COLLECTION.SendSmsMessage,
      NODE_COLLECTION.SendWechatMessage
    ]
  }
]

export class UINodeMap {
  constructor (listNode, id) {
    if (!['name', 'type', 'img'].every(k => k in listNode)) {
      throw new Error('非法画布节点')
    }

    const d = listNode.presetData || listNode.data

    Object.assign(this, listNode, {
      id,
      offsetX: 0,
      offsetY: 0,
      formData: d ? d() : {}
    })
  }
}
