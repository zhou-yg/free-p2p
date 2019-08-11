import {Events} from './events';
import fs from 'fs';
import path from 'path';
const env = process.env;
const HOME: string = (process.env.HOME || '');

console.log(fs);

function resolvePath(p:string | string[]) {
  if (Array.isArray(p)) {
    return p.reduce((pre, cur) => {
      return path.join(pre, cur);
    }, HOME)
  }
  return path.join(HOME, p);
}
// a
export const desktop = {
  [Events.GET_FILE_LIST](param?: any): Promise<IFile[]> {
    const p = param ? param.path : '/';
    const fullPath = resolvePath(p);

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
  [Events.GET_FILE_DATA](param?:any): Promise<Blob> {
    const p = param ? param.path : '/';
    const fullPath = resolvePath(p);

    console.log(fullPath);

    if (fs.lstatSync(fullPath).isFile()) {
    }
    return Promise.resolve(new Blob([fs.readFileSync(fullPath).toString()]));
  },
  [Events.CREATE_FOLDER](param?:any):Promise<Boolean> {
    const p = param ? param.path: '/';
    const fullPath = resolvePath(p);

    const directory = param.directory;

    return new Promise((resolve, reject) => {
      fs.mkdir(path.join(fullPath, directory), (err) => {
        if (err) {
          reject(false)
        } else {
          resolve(true);
        }
      });
    })
  },
  [Events.UPLOAD_FILE](fd: FormData) {
    let promiseArr = [];

    const path = fd.get('path') as string;
    fd.delete('path');

    for(let item of fd) {
      const [fdKey, fileObj] = item;
      const { name, path:filePath } = fileObj;
      let targetFilePath = resolvePath([path, name]);

      promiseArr.push(new Promise((resolve) => {
        const rs = fs.createReadStream(filePath as string);
        const ws = fs.createWriteStream(targetFilePath);
        ws.on('finish', () => {
          resolve(targetFilePath);
        });
        rs.pipe(ws);
      }));
    }
    return Promise.all(promiseArr);
  }
};
