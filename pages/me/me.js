const conServer = require('../../utils/connectServer.js')

Page({

  data: {
    isLogin: false,
    userName: null,
    uid: null,
    link: null
  },
  onShow(){
    var that = this
    wx.getStorage({
      key: 'userName',
      success: function (userName) {
        wx.getStorage({
          key: 'uid',
          success: function(uid) {
              // 获取用户的头像
            conServer.getUserPic(uid.data, that)
            that.setData({
              isLogin: true,
              userName: userName.data,
              uid: uid.data
            })
          },
        })
      },
      fail(){
        that.setData({
            isLogin: false,
            userName: null,
            uid: null
        })
      }
    })
  },

  // 用户登录，重定向到登录界面
  login(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  
  // 用户点击设置按钮后，跳转到设置页面
  setApp(){
    wx.navigateTo({
      url: '../set/set',
    })
  },

  // 快捷登录
  easyLogin(){
      wx.setStorage({
          key: 'uid',
          data: '2',
      })
      wx.setStorage({
          key: 'userName',
          data: '李四',
      })
      this.setData({
          isLogin: true,
          userName: '李四',
          uid: '2'
      })
  },


  // 用户头像选取
  selectHeadPic(){
      wx.navigateTo({
          url: '../../cutHeadPic/avatarUpload/index/index',
      })
  },

  // 跳转到好友页面
  toFriends(){
      wx.navigateTo({
          url: '../friends/friends?uid='+ this.data.uid,
      })
 },

    // 跳转到收藏页面
    toFavorite() {
        wx.navigateTo({
            url: '../favorite/favorite',
        })
    },

    // 跳转到询问页面
    toQuestion() {
        wx.navigateTo({
            url: '../question/question',
        })
    },

    // 跳转到历史界面
    toHistory(){
        wx.navigateTo({
            url: '../history/history',
        })
    },

    // 跳转到举报页面
    toReport(){
        wx.navigateTo({
            url: '../myReport/myReport?uid='+this.data.uid,
        })
    },

    // 跳转到卖车记录页面
    toSaleCar(){
        wx.navigateTo({
            url: '../saleCarRecord/saleCarRecord',
        })
    },


    // 跳转到数据展示页面】
    toTablePage(){
        wx.navigateTo({
            url: '../tablePage/tablePage',
        })
    }

})