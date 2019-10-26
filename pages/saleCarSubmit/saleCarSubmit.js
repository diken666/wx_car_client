
const conServer = require('../../utils/connectServer.js')

Page({
    data:{
        uid: null,
        cityIndex: 0,
        city: ['杭州', '宁波', '湖州', '绍兴', '丽水', '台州', '衢州', '金华', '嘉兴', '温州'],
        date: '2019-04-22',

        carType: null,
        distance: null,
        appraise: null,
    },

    onLoad(options){
        this.setData({
            uid: options.uid
        })
    },


    // 城市选择时
    cityChange(e){
        var index = parseInt(e.detail.value)
        this.setData({
            cityIndex: index
        })
    },

    // 品牌车系改变时
    carTypeInput(e){
        this.setData({
            carType: e.detail.value
        })
    },

    // 购车时间选择时
    timeChange(e){
        this.setData({
            date: e.detail.value
        })
    },

    // 行驶里程输入时
    distanceInput(e){
        this.setData({
            distance: e.detail.value
        })
    },

    // 车况评价时
    appraiseInput(e){
        this.setData({
            appraise: e.detail.value
        })
    },

    // 提交页面数据时
    submit(){
        var data = this.data
        if(data.carType && data.distance && data.appraise){
            conServer.addSaleCarInfo(data.uid, data.city[parseInt(data.cityIndex)], data.carType, data.date, data.distance, data.appraise )
        }else{
            wx.showModal({
                title: '提示',
                content: '有内容为空喔~',
                showCancel: false
            })
        }
    }
})