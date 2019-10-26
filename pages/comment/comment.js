const conServer = require('../../utils/connectServer.js')

Page({
    data:{
        valueLength: 0,
        cid : null,
        uid: null
    },
    onLoad(options){
        var that = this
        this.setData({
            cid: options.cid
        })
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                that.setData({
                    uid: res.data
                })
            },
            fail(){
                wx.showModal({
                    title: '错误',
                    content: '登录状态出错，请重新登录',
                    success(res){
                        if(res.confirm){
                            wx.navigateTo({
                                url: '../login/login',
                            })
                        }
                    }
                })
            }
        })
    },
    comment(e){
        var inputValue = e.detail.value.value
        // 提交评论
        conServer.commentSubmit(this.data.uid, this.data.cid, inputValue)

    },
    userInput(e){
        this.setData({
            valueLength: e.detail.value.length
        })
    }
})