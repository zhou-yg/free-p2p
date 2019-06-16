export enum EnvType {
  browser = 'browser',
  desktop = 'desktop',
}

const defautsEnv = {
  browser: true,
};


if (process.env.Adapter === EnvType.desktop) {
  Object.assign(defautsEnv, {
    "browser": false,
  })
}


export const env = defautsEnv;