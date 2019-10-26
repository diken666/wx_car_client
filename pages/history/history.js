
const conServer = require('../../utils/connectServer.js')

Page({
    data:{
        uid: null,
        historyItem: null,
        isHistoryReady: false
    },


    onLoad(){
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                that.setData({
                    uid: res.data
                }, ()=>{
                    conServer.getHistory(res.data, that)
                })
            },
            fail(){
                wx.showModal({
                    title: '提示',
                    content: '当前登录异常，是否前往重新登录？',
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

    // 用户删除某条历史记录
    deleteCar(e){
        var cid = e.currentTarget.dataset.cid
        var index = e.currentTarget.dataset.index
        var tempHistoryItem = this.data.historyItem
        tempHistoryItem.splice(index, 1)
        this.setData({
            historyItem: tempHistoryItem
        }, ()=>{
            // 删除数据库中的历史记录
            conServer.delHistory(this.data.uid, cid)
        })
    },

    // 当车的图片被点击时，跳转到该车辆信息的页面
    picTap(e){
        var cid = e.currentTarget.dataset.cid
        wx.navigateTo({
            url: '../carInfo/carInfo?id='+cid,
        })
    }


})