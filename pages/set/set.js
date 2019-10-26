Page({

  // 用户注销登录，删除本地数据
  logout() {
    wx.removeStorage({
      key: 'userName',
      success: function (res) {
        wx.removeStorage({
          key: 'uid',
          success: function (res) {
            wx.navigateBack({
              delta: 1,
            })
          },
        })
      },
    })
  }

})