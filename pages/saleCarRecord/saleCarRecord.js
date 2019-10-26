const conServer = require('../../utils/connectServer.js')

Page({

    data: {
        items: []
    },

    onLoad(){
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                conServer.getUserSaleCarInfo(res.data, that)
            },
        })
    }
})