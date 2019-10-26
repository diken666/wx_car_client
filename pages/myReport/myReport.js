
const conServer = require('../../utils/connectServer.js') 

Page({

    data: {
        uid: null,
        items: null
    },

    onLoad(options){
        this.setData({
            uid: options.uid
        },()=>{
            conServer.getUserReport(options.uid, this)
        })
    }
})