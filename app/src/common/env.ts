enum EnvType {
  browser,
  desktop,
}

const defautsEnv = {
  type: EnvType.browser,
};


if (window.REGISTER_ENV) {
  Object.assign(defautsEnv, window.REGISTER_ENV)
}


export const env = defautsEnv;