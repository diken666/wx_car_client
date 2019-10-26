
const conServer = require('../../utils/connectServer.js')

Page({
    data: {
        date: '2014-01-01',
        carType: null,
        dataFrom: 0,
         thisYearItem: null,
         allItem: null,
         loading: true
    },
    
    // 购车时间选择时
    timeChange(e) {
        console.log(e.detail.value)
        var data = this.data
        this.setData({
            date: e.detail.value
        },()=>{
            console.log('date:::::', this.data.date)
            if(this.data.carType){
                this.setData({
                    loading: true
                })
                conServer.getCarEvaluateInfo(data.carType, data.date, data.dataFrom, this)
            }
        })
    },
    
    // 用户输入爱车车型时
    carTypeInput(e){
        var data = this.data
        this.setData({
            carType: e.detail.value
        }, () => {
            this.setData({
                loading: true
            })
            if (this.data.carType) {
                conServer.getCarEvaluateInfo(data.carType, data.date, data.dataFrom, this)
            }
        })
    },

    // 数据来源选择
    fromTap(e){
        var data = this.data
        var index  = parseInt(e.target.dataset.index)
        this.setData({
            dataFrom: index
        }, () => {
            this.setData({
                loading: true
            })
            if (this.data.carType) {
                conServer.getCarEvaluateInfo(data.carType, data.date, index, this)
            }
        })
    }
    
})