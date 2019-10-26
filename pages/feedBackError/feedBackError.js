var conServer = require('../../utils/connectServer.js')

Page({
    data:{
        index: 0,
        module: ["车辆信息", "基本参数","发动机参数","底盘及制动","安全配置","外部配置","内部配置"],
        cid: null,
        contentLength: 0,
        content: null
    },
    onLoad(options){
        this.setData({
            cid: options.cid
        })
    },

    moduleSelect(e){
        this.setData({
            index: e.detail.value
        })
    },
    userInput(e){
        var content = e.detail.value
        var length = content.length
        this.setData({
            content,
            contentLength: length
        })
    },

    // 用户点击取消
    cancel(){
        wx.navigateTo({
            url: '../carInfo/carInfo?id='+this.data.cid,
        })
    },

    // 用户点击确定
    submit(){
        conServer.feedBackError(this)
        wx.navigateTo({
            url: '../carInfo/carInfo?id='+this.data.cid,
        })
    }

})