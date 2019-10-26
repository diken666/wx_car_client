Page({

    data:{
        searchHistory: null
    },

    onShow(){
        var that = this
        wx.getStorage({
            key: 'searchHistory',
            success: function(res) {
                that.setData({
                    searchHistory: res.data
                })
            },
        })
    },


    formSubmit(e){
        var inputData = e.detail.value.content
        if(inputData){
            wx.setStorage({
                key: 'carBrand',
                data: inputData,
                success(){
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
            wx.getStorage({
                key: 'searchHistory',
                success: function(res) {
                    var tempRes = res.data
                    wx.setStorage({
                        key: 'searchHistory',
                        data: tempRes.concat(inputData),
                    })
                },
                fail(){
                    wx.setStorage({
                        key: 'searchHistory',
                        data: [inputData],
                    })
                }
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '输入内容不能为空',
            })
        }
    },



    // 删除本地搜索历史缓存
    delHistory(){
        var that = this
        wx.removeStorage({
            key: 'searchHistory',
            success: function(res) {
                that.setData({
                    searchHistory: null
                })
            },
        })
    },

    // 用户点击标签后
    choose(e){
        console.log(e)
        var res = e.target.dataset.value
        if(res){
            wx.setStorage({
                key: 'carBrand',
                data: res,
            })
            wx.navigateBack({
                delta: 1
            })
        }
    }
})