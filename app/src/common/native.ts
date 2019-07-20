import {Events} from './events';
import fs from 'fs';
import path from 'path';
const env = process.env;
const HOME: string = (process.env.HOME || '');

console.log(fs);

export const desktop = {
  [Events.GET_FILE_LIST](param?: any): Promise<IFile[]> {
    const p = param ? param.path : '/';
    const fullPath = path.join(HOME, p);

    console.log(param, param && param.path, fullPath);

    const dirs = fs.readdirSync(fullPath)
    .filter(name => !/^\./.test(name))
    .map(name => {
      const fileP = path.join(fullPath, name);
      const stat = fs.lstatSync(fileP);
      return {
        id: '',
        name,
        path: fileP,
        rights: 'drwxr-xr-x',
        size: String(stat.size),
        date: String(new Date()),
        type: stat.isDirectory() ? 'dir' : 'file',
      };
    });

    return new Promise<IFile[]>(resolve => {
      resolve(dirs);
    });
  },
  // [Events.GET_FILE_DATA](param?:any): Promise<IFileData> {
    // return Promise.resolve(undefined);
    //   id: '2',
    //   name: '测试',
    //   path: 'txt',
    //   data: Date.now(),
    // });
  // }
};
