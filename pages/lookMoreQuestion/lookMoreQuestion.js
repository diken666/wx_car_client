const conServer = require('../../utils/connectServer.js')

Page({

    data:{
        questionItem: null
    },
    onLoad(){
        conServer.getUserAllQuestion(this)
    },

    onPullDownRefresh(){
        var that = this
        wx.showLoading({
            title: '刷新中',
            success() {
                conServer.getUserAllQuestion(that)
                setTimeout(function () {
                    wx.hideLoading()
                    wx.stopPullDownRefresh()
                }, 500)
            }
        })
    },

    // 当用户点击问题项后
    questionTap(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../questionArticle/questionArticle?id=' + id,
        })
    },
})