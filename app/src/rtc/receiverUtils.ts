const qs = require('querystring');

// ';' === 59
const FLAG:number = 59;

export function parseBuffer (data:ArrayBuffer): [string, {}] {
  let bf = Buffer.from(data);

  let i = 0;
  let pre = i;
  let flagIndexSeg = 0; // 第一段表示event，第二段表示参数，第三段及以后表示二进制文件数据

  let event, paramQs, bufferData;

  while(i < bf.length) {
    if (bf[i] === FLAG) {
      switch (flagIndexSeg) {
        case 0:
          event = bf.slice(pre, i).toString();
          flagIndexSeg = 1;
          break;
        case 1:
          paramQs = qs.parse(bf.slice(pre, i).toString());
          bufferData = bf.slice(i+1);
          if (paramQs.bufferData) {
            console.warn('buffer 有重复字段 data');
          }
          paramQs.bufferData = bufferData;
          flagIndexSeg = 2;
          break;
      }
      pre = i+1;
    }
    i++;
  }

  return [event as string, paramQs];
}
