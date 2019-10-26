const conServer = require('../../utils/connectServer.js')


Page({
  register(e){
    var isAllFilled = true
    var res = e.detail.value
    if (!res.account || !res.location || !res.name || !res.password || !res.phone || !res.sex){
      isAllFilled  = false
    }
    if(isAllFilled){
      conServer.userRegister(res)
    }else{
      wx.showModal({
        title: '提示',
        content: '有内容为空！',
      })
    }
  }
})