const conServer = require('../../utils/connectServer.js')

Page({
    data:{
        valueLength: 0,
        qid: null,
        uid: null
    },

    onLoad(options){
        this.setData({
            uid: options.uid,
            qid: options.qid
        })
    },


    comment(e) {
        var inputValue = e.detail.value.value
        // 提交评论
        if(inputValue){
            conServer.submitQuestionComment(this.data.qid, this.data.uid, inputValue)
        }else{
            wx.showModal({
                title: '提示',
                content: '留言内容不能为空喔~',
                showCancel: false
            })
        }
        

    },
    userInput(e) {
        this.setData({
            valueLength: e.detail.value.length
        })
    }
})