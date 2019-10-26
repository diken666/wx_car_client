const conServer = require('../../utils/connectServer.js')

Page({

    data:{
        questionItem: null
    },
    onShow(){
        conServer.getUserQuestion(this)
    },

    // 卖车
    soleCar(){
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function (res) {
                wx.navigateTo({
                    url: '../saleCarSubmit/saleCarSubmit?uid='+res.data,
                })
            },
            fail() {
                wx.showModal({
                    title: '提示',
                    content: '当前未登录，是否前往登录？',
                    success(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../login/login',
                            })
                        }
                    }
                })
            }
        })
    },

    // 咨询客服
    askServer(){
        wx.getStorage({
            key: 'uid',
            success: function (res) {
                var uid = res.data
                var sid = 'kefu'
                wx.navigateTo({
                    url: '../chatPage/chatPage?sid=' + sid + '&uid=' + uid,
                })
            },
            fail() {
                wx.showModal({
                    title: '提示',
                    content: '当前用户未登录，是否前往登录？',
                    success(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../login/login',
                            })
                        }
                    }
                })
            }
        })
    },

    // 估价
    evaluateCar(){
        wx.navigateTo({
            url: '../evaluateCar/evaluateCar',
        })
    },

    // 当用户点击问题项后
    questionTap(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../questionArticle/questionArticle?id=' + id,
        })
    },

    // 用户点击查看更多问问
    lookMoreQuestion() {
        wx.navigateTo({
            url: '../lookMoreQuestion/lookMoreQuestion',
        })
    },

    // 写问题
    writeQuestion(){
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                wx.navigateTo({
                    url: '../question/question',
                })
            },
            fail(){
                wx.showModal({
                    title: '提示',
                    content: '当前为登录，是否前往登录？',
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
    }
})