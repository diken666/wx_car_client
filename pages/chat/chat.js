const conServer = require('../../utils/connectServer.js')

Page({
    data: {
        isLogin: false,
        uid: null,
        items: null,
        realItems: null

    },
    onShow(){
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                that.setData({
                    isLogin: true,
                    uid: res.data
                },()=>{
                    conServer.getChatMsg(res.data, that)
                })
            },
        })
    },

    // 下拉刷新
    onPullDownRefresh(){
        var that = this
        wx.showLoading({
            title: '刷新中',
            success(){
                conServer.getChatMsg(that.data.uid, that)
                setTimeout(function(){
                    wx.hideLoading()
                    wx.stopPullDownRefresh()
                },200)
            }
        })     
    },

    toLogin(){
        wx.navigateTo({
            url: '../login/login',
        })
    },

    toChatPage(e){
        var sid = e.currentTarget.dataset.sid
        wx.navigateTo({
            url: '../chatPage/chatPage?sid='+sid+'&uid='+this.data.uid,
        })
    }
})