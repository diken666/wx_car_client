Page({
    data:{
        carAge: 14,
        distance: 80,
        pl: 7,

        standSel:null,
        boxSel: null,
        comeSel: null
    },

    // 车龄监听
    ageChange(e){
        var res = e.detail.value
        this.setData({
            carAge: res
        })
    },

    // 行驶里程监听
    disChange(e){
        var res = e.detail.value
        this.setData({
            distance: res
        })
    },

    // 排量监听
    plChange(e){
        var res = e.detail.value
        this.setData({
            pl: res
        })
    },

    // 排放标准下的选项被点击时
    standSelect(e){
        this.setData({
            standSel: e.target.dataset.value
        })
    },

    // 变速箱下的选项被点击时
    boxSelect(e) {
        this.setData({
            boxSel: e.target.dataset.value
        })
    },

    //来源下的选项被点击时
    comeSelect(e){
        this.setData({
            comeSel: e.target.dataset.value
        })
    },

    // 当用户点击确定按钮后
    submit(){
        var res = {
            carAge: this.data.carAge,
            distance: this.data.distance,
            pl: this.data.pl,
            stand: this.data.standSel,
            box: this.data.boxSel,
            come: this.data.comeSel
        }
        wx.setStorage({
            key: 'filter',
            data: res,
        })
        wx.navigateBack({
            delta: 1
        })
    }
})