import {Events} from './events';
const fs = require('fs');
const path = require('path');

const HOME: string = (process.env.HOME || '');

console.log(fs);


export const desktop = {
  [Events.GET_FILE_LIST](param?: any): Promise<IFile[]> {
    console.log(param, param && param.path);
    const p = param ? param.path : '/';
    const fullPath = path.join(HOME, p);

    const dirs = fs.readdirSync(fullPath).map(name => {
      return {
        id: '',
        name,
        path: path.join(p, name),
      };
    });

    return new Promise<IFile[]>(resolve => {
      resolve(dirs);
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
