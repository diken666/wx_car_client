const conServer = require('../../utils/connectServer.js')

Page({
  formSubmit(e){
    var result = e.detail.value
    if(!result.userName || !result.password){
      wx.showModal({
        title: '提示',
        content: '内容不能为空！',
      })
    }else{
      conServer.userLogin(result)
    }
  },

  // 链接到注册页面
  register(){
    wx.navigateTo({
      url: '../register/register',
    })
  }
})