const conServer = require('../../utils/connectServer.js')
Page({
    data:{
        uid:null,
        items: null,
        contentVal: null,
        simg: null,
        sid: null,
        sname: null,
        limg: null,
        lid: null,
        lname: null
    },
    onLoad(options){
        var uid = options.uid
        var sid = options.sid
        var that = this
        // 获取两人用户信息
        conServer.getUserInfo(sid, this, '0')
        conServer.getUserInfo(uid, this, '1')
        // 获取两人间的聊天记录
        conServer.getTwoPersonChatMsg(uid, sid, this)
        this.setData({
            uid,
            sid,
            lid: uid
        })
    },


    // 下拉返回上一页
    onPullDownRefresh() {
        wx.navigateBack({
            delta: 1
        })
    },

    // 上拉刷新
    onReachBottom(){
        var that = this
        wx.showLoading({
            title: '刷新中',
            success() {
                conServer.getTwoPersonChatMsg(that.data.uid, that.data.sid, that)
                setTimeout(function () {
                    wx.hideLoading()
                    // wx.stopPullDownRefresh()
                }, 500)
            }
        })
    },

    // 当用户输入内容时
    userInput(e){
        var value = e.detail.value
        this.setData({
            contentVal: value
        })
    },

    // 用户点击发送按钮
    send(){
        console.log(this.data)
        var obj = {
            content: this.data.contentVal,
            simg: this.data.simg,
            sid: this.data.sid,
            sname: this.data.sname,
            limg: this.data.limg,
            lid: this.data.lid,
            lname: this.data.lname
        }
        conServer.userSendMsg(obj, this)
        this.data.contentVal = null
    }
})