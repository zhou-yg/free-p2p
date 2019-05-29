export default {
  namespace: 'user',
  state: {
    myId: '',
    connectId: '',
    userName: '',
  },
  reducers: {
    getUser (state, {userName}) {
      return {
        ...state,
        userName,
      };
    },
  },
  effects: {
    * fetchUser (params, {put}) {
      yield put({
        type: 'getUser',
        userName: params.name,
      })
    }
  },
  subscriptions: {
    onInit ({dispatch}) {
      dispatch({
        type: 'fetchUser',
        name: 'zhouyg',
      });
    }
  },
}