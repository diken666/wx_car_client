Page({
    select(e){
        var res = e.target.dataset.value
        if(res){
            wx.setStorage({
                key: 'carBrand',
                data: res,
                success(){
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
        }
        
    }
})