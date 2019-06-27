import {Events} from './events';

export const desktop = {
  [Events.GET_FILE_LIST](param?: any): Promise<IFile[]> {
    return new Promise<IFile[]>(resolve => {
      resolve([
        {
          id: '2',
          name: '测试',
          path: 'txt',
        },
      ]);
    });
  },
  [Events.GET_FILE_DATA](param?:any): Promise<IFileData> {
    return Promise.resolve({
      id: '2',
      name: '测试',
      path: 'txt',
      data: Date.now(),
    });
  }
};
