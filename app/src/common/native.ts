import {Events} from './events';
import fs from 'fs';
import path from 'path';

const HOME = process.env.HOME;

export const desktop = {
  [Events.GET_FILE_LIST](param?: any): Promise<IFile[]> {
    console.log(param, param && param.path);
    const path = param ? param.path : '/';
    const fullPath = path.join(HOME, path);

    const dirs = fs.readdirSync(fullPath).map(name => {
      return {
        id: '',
        name,
        path: path.join(path, name),
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
