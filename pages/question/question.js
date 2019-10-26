const conServer = require('../../utils/connectServer.js')

Page({
    data: {
        uid: null,
        titleLength: 0,
        titleVal: null,
        contentLength: 0,
        contentVal: null
    },
    
    onLoad(){
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                that.setData({
                    uid: res.data
                })
            },
        })
    },

    // 标题内容输入处理
    titleInput(e){
        var value = e.detail.value
        var len = value.length
        this.setData({
            titleVal: value,
            titleLength: len
        })
    },

    // 内容输入时间处理
    contentInput(e){
        var value = e.detail.value
        var len = value.length
        this.setData({
            contentVal: value,
            contentLength: len
        })
    },

    // 用户点击取消按钮后
    cancel(){
        wx.navigateBack({
          delta: 1  
        })
    },


    // 用户点击确定按钮后
    submit(){
        var title = this.data.titleVal
        var content = this.data.contentVal
        if(title && content){
            conServer.submitQuestion(this.data.uid, title, content)
        }else{
            wx.showModal({
                title: '提示',
                content: '标题和内容不能为空喔~',
                showCancel: false,
            })
        }
        
    }
})