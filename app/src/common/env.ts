export enum EnvType {
  browser = 'browser',
  desktop = 'desktop',
}

const defautsEnv = {
  browser: true,
};


if (process.env.Adapter === EnvType.desktop) {
  console.log(1);
  Object.assign(defautsEnv, {
    "browser": false,
  })
} else {
  console.log(2);
}


export const env = defautsEnv;
