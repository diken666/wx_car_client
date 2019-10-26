const conServer = require('../../utils/connectServer.js')

Page({
    data: {
        uid: null,
        items: null,
        searchItems: null
    },
    onLoad(options){
        this.setData({
            uid: options.uid
        })
        conServer.getUserFrindsList(this.data.uid, this)
    },
    userInput(e){
        var content = e.detail.value
        if(content.length >= 1){
            conServer.searchGetUserInfo(content, this)
        }else{
            this.setData({
                searchItems: []
            })
        }  
    },

    // 用户添加好友
    addFriend(e){
        var fid = e.currentTarget.dataset.id
        var fname = e.currentTarget.dataset.name
        var that = this
        wx.showModal({
            title: '提示',
            content: '添加【'+fname+'】为好友？',
            success(res){
                if(res.confirm){
                    conServer.addFriend(that.data.uid, fid)
                }
            }
        }) 
    },


    // 用户删除好友
    removeFriend(e){
        var fid = e.currentTarget.dataset.id
        var fname = e.currentTarget.dataset.name
        var that = this
        wx.showModal({
            title: '提示',
            content: '确认删除好友【' + fname + '】？',
            success(res) {
                if (res.confirm) {
                    conServer.removeFriend(that.data.uid, fid)
                }
            }
        }) 
    },

    // 跳转到聊天页
    toChatPage(e){
        var fid = e.currentTarget.dataset.fid
        wx.navigateTo({
            url: '../chatPage/chatPage?sid=' + fid + '&uid=' + this.data.uid,
        })
    },

    // 下拉刷新
    onPullDownRefresh() {
        var that = this
        wx.showLoading({
            title: '刷新中',
            success() {
                conServer.getUserFrindsList(that.data.uid, that)
                setTimeout(function () {
                    wx.hideLoading()
                    wx.stopPullDownRefresh()
                }, 200)
            }
        })
    },
})