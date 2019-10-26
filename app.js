//app.js

import GlobalConfig from "./cutHeadPic/config/index.js"

const globalconfig = new GlobalConfig()

globalconfig.init()

App({
  onLaunch: function () {
  },
  globalData: {
    config: globalconfig
  }
})