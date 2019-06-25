import api from '../../../common/api';

export default {
  namespace: 'finder',
  state: {
    files: ['a', 'b'],
  },
  reducers: {
    receiveFiles (state, {d}) {
      console.log(d);
      return {
        ...state,
        files: d,
      }
    },
  },
  effects: {
    * getFileList (arg, saga) {
      console.log('?', api.env);
      const r = yield api.getFileList();
      console.log('r:', r);
      yield saga.put({
        type: 'receiveFiles', 
        d: r,
      })
    }
  },
}
