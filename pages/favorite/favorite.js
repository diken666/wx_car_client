
const conServer = require('../../utils/connectServer.js')


Page({
   data:{
       carItem: null,
       pics: null,
       uid: null
   },
    onShow(){
      var that = this
      wx.getStorage({
          key: 'uid',
          success: function(res) {
              conServer.collectionShow(res.data, that)
              that.setData({
                  uid: res.data
              },()=>{
                  console.log(that.data)
              })
          },
          fail(){
              wx.showModal({
                  title: '错误',
                  content: '未登录状态，是否重新登录？',
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

    // 删除此项收藏
    delCollection(e){
        var that = this
        var cid = e.currentTarget.dataset.cid
        var index = e.currentTarget.dataset.index
        wx.showModal({
            title: '提示',
            content: '确定删除次收藏？',
            success(res){
                if(res.confirm){
                    var tempItems = that.data.carItem
                    tempItems.splice(index, 1)
                    // 当剩余列为0时显示列表为空
                    if(tempItems.length === 0){
                        that.setData({
                            carItem: null
                        })
                    }else{
                        that.setData({
                            carItem: tempItems
                        })
                    }
                    
                    conServer.delCollection(that.data.uid, cid)
                }
            }
        })
    },


    // 当车辆被点击时
    carSelect(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../carInfo/carInfo?id=' + id,
        })
    }
})