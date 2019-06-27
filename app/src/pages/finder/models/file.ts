import {api, Events} from '../../../common/api';

export default {
  namespace: 'finder',
  state: {
    files: ['a', 'b'],
    fileData: 11,
  },
  reducers: {
    receiveFiles (state, {d}) {
      console.log(d);
      return {
        ...state,
        files: d,
      }
    },
    receiveFileData (state, {d}) {
      console.log(d);
      return {
        ...state,
        fileData: d,
      }
    },
  },
  effects: {
    * getFileList (arg, saga) {
      console.log('?', api.env);
      const r = yield api.fetch(Events.GET_FILE_LIST);
      console.log('r:', r);
      yield saga.put({
        type: 'receiveFiles', 
        d: r,
      })
    },
    * getFile (arg, saga) {
      console.log('?', api.env);
      const r = yield api.fetch(Events.GET_FILE_DATA);
      console.log('r:', r);
      yield saga.put({
        type: 'receiveFileData', 
        d: r,
      })
    }
  },
}
