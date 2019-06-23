import api from '../../../common/api';

export default {
  namespace: 'finder',
  state: {
    files: ['a', 'b'],
  },
  reducers: {

  },
  effects: {
    * getFileList (arg, saga) {
      console.log('?', api.env);
      api.getFileList();
    }
  },
}
