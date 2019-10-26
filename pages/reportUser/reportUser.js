const conServer = require('../../utils/connectServer.js')

Page({
    data:{
        uid: null,
        id: null,
        name: null,
        reasonVal: null,
        phone: null,

        pickerIndex: 0,
        pickerRange:['垃圾营销', '不实信息', '有害信息', '违法信息', '淫秽色情', '人身攻击']
    },

    onLoad(options){
        this.setData({
            uid: options.uid,
            id: options.id,
            name: options.name
        })  
    },


    // pickerChange
    pickerChange(e){
        var index = parseInt(e.detail.value)
        this.setData({
            pickerIndex: index
        })
    },

    //reasonInput
    reasonInput(e){
        var reasonVal = e.detail.value
        this.setData({
            reasonVal
        })
    },

    //phoneInput
    phoneInput(e){
        var phone = e.detail.value
        this.setData({
            phone
        })
    },



    //submit
    submit(){
        var data = this.data
        wx.getStorage({
            key: 'userName',
            success: function(res) {
                if (data.uid && data.id && data.reasonVal) {
                    conServer.addUserReport(data.uid, data.id, data.pickerIndex, data.reasonVal, data.phone, res.data, data.name)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '有内容为空喔~',
                        showCancel: false
                    })
                }
            },
        })
        
    }
})