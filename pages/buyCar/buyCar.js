
const fuc = require('../../utils/fuc.js')
const conServer = require('../../utils/connectServer.js')

Page({

data: {
  selectIndex: 0,
  place: ['不限', '杭州', '宁波', '湖州', '绍兴', '丽水', '台州', '衢州', '金华' ,'嘉兴', '温州'],

  isOrderShow: false,
  orderSelect: 0,
    orderSelectText: ['默认', '价格最高', '价格最低', '车龄最短', '里程最少', '过户最少'],
  
// 价格面板是否显示
  isPriceShow: false,
// 车辆数量的面板是否显示
  isInfoShow: false,
//   加载页面是否显示
  isLoadingShow: false,
  // 加载页面是否长时间显示
  isLoadingLongShow: false,
  // 是否加载完
  isBottom: false,

//   是否收藏
  isCollect: [],

  // 所选汽车的价格区间
  minPrice: 0,
  maxPrice: 100,

  // 所选筛选条件
  hasChoose: [
     { isShow: false, msg: '', bindEvent: 'orderCancel' },
     { isShow: false, msg: '', bindEvent: 'carBrandCancel'}, 
     { isShow: false, msg: '', bindEvent: 'priceCancel'}, 
     { isShow: false, msg: '', bindEvent: 'carAgeCancel' },
     { isShow: false, msg: '', bindEvent: 'distanceCancel' }, 
     { isShow: false, msg: '', bindEvent: 'plCancel' }, 
     { isShow: false, msg: '', bindEvent: 'standCancel' }, 
     { isShow: false, msg: '', bindEvent: 'boxCancel' }, 
     { isShow: false, msg: '', bindEvent: 'comeCancel' }, 
  ],
 // 最终要提交服务器的参数
  location: null,
  carBrand:null,
  finalPrice:null,
  carAge: null,
  distance: null,
  pl: null,
  stand: null,
  box:null,
  come: null,

  standText: ['国二及以下', '国三及以上', '国四及以上', '国五及以上'],
  isButtonSearchShow: false,
  carItem: null,
  picArr: null,
  count: null,
  pageNow: null,
  allPage: null,

},

   // 当用户滑到底部时 加载新的数据
    onReachBottom(){
        this.setData({
            isLoadingShow: true
        },()=>{
            if(this.data.isLoadingLongShow){
                this.setData({
                    isLoadingShow: true
                })
            }else{
                setTimeout(() => {
                    this.setData({
                        isLoadingShow: false
                    })
                }, 2000)
            }
        })
        conServer.getMoreCarInfo(this.data.pageNow, this.data.allPage, this)
    },

onLoad(){
    var data = this.data
    var obj = {
        location: data.location === null ? '' : data.location,
        order: data.orderSelect === null ? '' : data.orderSelect,
        carBrand: data.carBrand === null ? '' : data.carBrand,
        price: (data.minPrice + '-' + data.maxPrice) === null ? '' : (data.minPrice + '-' + data.maxPrice),
        carAge: data.carAge === null ? '' : data.carAge,
        distance: data.distance === null ? '' : data.distance,
        pl: data.pl === null ? '' : data.pl,
        stand: data.stand === null ? '' : data.stand,
        box: data.box === null ? '' : data.box,
        come: data.come === null ? '' : data.come
    }
    conServer.getcarInfo(obj, this, false)
},
// 当页面显示时，判断缓存中是否有存储的筛选条件,初始化选中内容
onShow(){
    var that = this
    wx.getStorage({
        key: 'carBrand',
        success: function(res) {
            that.setData({
                carBrand: res.data
            },()=>{
                var tempHasChoose = that.data.hasChoose
                tempHasChoose[1].isShow = true
                tempHasChoose[1].msg = res.data
                that.setData({
                    hasChoose: tempHasChoose,
                    isButtonSearchShow: true
                })
            })
        },
    })
    wx.getStorage({
        key: 'filter',
        success: function(res) {
            that.setData({
                carAge: res.data.carAge,
                distance: res.data.distance,
                pl: res.data.pl,
                stand: res.data.stand,
                box: res.data.box,
                come: res.data.come
            },()=>{
                var data = that.data
                var tempHasChoose = that.data.hasChoose
                if(data.carAge && data.carAge !== 14){
                    tempHasChoose[3].isShow = true
                    tempHasChoose[3].msg = "<="+data.carAge+"年"
                }
                if(data.distance && data.distance !== 80){
                    tempHasChoose[4].isShow = true
                    tempHasChoose[4].msg = "<="+data.distance+"万km"
                }
                if(data.pl && data.pl !== 7){
                    tempHasChoose[5].isShow = true
                    tempHasChoose[5].msg = "<=" + data.pl + "L"
                }
                if(data.stand){
                    var index = parseInt(data.stand)
                    tempHasChoose[6].isShow = true
                    tempHasChoose[6].msg = data.standText[index]
                }
                if(data.box){
                    tempHasChoose[7].isShow = true
                    tempHasChoose[7].msg = data.box
                }
                if(data.come){
                    tempHasChoose[8].isShow = true
                    tempHasChoose[8].msg = data.come
                }
                that.setData({
                    hasChoose: tempHasChoose
                },()=>{
                    var tempHasChoose = that.data.hasChoose
                    for(let i=0; i< that.data.hasChoose.length; i++){
                        if(tempHasChoose[i].isShow){
                            that.setData({
                                isButtonSearchShow: true
                            })
                            break
                        }
                    }
                })
            })
        },
    })
},


// 当用户选择地区时
placeChange(e){
  var index = parseInt(e.detail.value)
  this.setData({
    selectIndex: index,
    location: this.data.place[index]
  })
},

// 当用户点击上搜索车辆信息时，跳转到搜索汽车的界面
toCarSearch(){
  wx.navigateTo({
    url: '../carSearch/carSearch',
  })
},

// 用户点击收藏夹时，如果是登录了则跳转到收藏夹页面，否则到登录页面
toFavorite(){
  wx.getStorage({
    key: 'uid',
    success: function(res) {
      if(res.data){
        wx.navigateTo({
          url: '../favorite/favorite',
        })
      }
    },
    fail(){
      wx.showModal({
        title: '提示',
        content: '请先登录！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          }
        }
      })
    }
  })
},

  // 当用户点击排序后，显示排序的面板
  orderShow(){
    this.setData({
      isPriceShow: false,
      isOrderShow: this.data.isOrderShow?false:true
    })
  },

  // 当用户点击排序下的选项时, 记录选中状态
  orderSelect(e){
    var select = parseInt(e.target.dataset.value)
    console.log(select)
    var tempHasChoose = this.data.hasChoose
    tempHasChoose[0].isShow = true
    tempHasChoose[0].msg = this.data.orderSelectText[select]
    this.setData({
      isOrderShow: false,
      isButtonSearchShow: true,  
      orderSelect: select,
      hasChoose: tempHasChoose
    })
    
  },

  //当用户点击价格后，显示价格选择面板
  priceShow(){
    this.setData({
      isButtonSearchShow: true,
      isOrderShow: false,
      isPriceShow: this.data.isPriceShow?false:true
    })
  },
  //
  minPriceSlider(e){
    var minPrice = parseInt(e.detail.value)
    var tempHasChoose = this.data.hasChoose
    tempHasChoose[2].isShow = true,
        tempHasChoose[2].msg = `${minPrice}-${this.data.maxPrice}万`
    this.setData({
      minPrice,
      hasChoose: tempHasChoose
    })
  },
  maxPriceSlider(e) {
      var maxPrice = parseInt(e.detail.value)
      var tempHasChoose = this.data.hasChoose
      tempHasChoose[2].isShow = true,
      tempHasChoose[2].msg = `${this.data.minPrice}-${maxPrice}万`
    var maxPrice = parseInt(e.detail.value)
    this.setData({
        maxPrice,
        hasChoose: tempHasChoose
    })
  },

  // 当用户点击筛选按钮后，跳转到筛选页面
  filterShow(){
      this.setData({
          isOrderShow: false,
          isPriceShow: false
      })
      wx.navigateTo({
          url: '../filter/filter',
      })
  },

  //当用户点击品牌按钮后，跳转到品牌筛选页面
  brandShow(){
      this.setData({
          isOrderShow: false,
          isPriceShow: false
      })
      wx.navigateTo({
          url: '../carBrand/carBrand',
      })
  },




  // 
    orderCancel() {
        var tempHasChoose = this.data.hasChoose
        tempHasChoose[0].isShow = false
        tempHasChoose[0].msg = ''
        this.setData({
            orderSelect: 0,
            hasChoose: tempHasChoose
        })
    },
    carBrandCancel(){
        var tempHasChoose = this.data.hasChoose
        tempHasChoose[1].isShow = false
        tempHasChoose[1].msg = ''
        this.setData({
            carBrand: null,
            hasChoose: tempHasChoose
        })
    },
    priceCancel(){
        var tempHasChoose = this.data.hasChoose
        tempHasChoose[2].isShow = false
        tempHasChoose[2].msg = ''
        this.setData({
            minPrice: 0,
            maxPrice: 100,
            finalPrice: null,
            hasChoose: tempHasChoose
        })
    },
    carAgeCancel(){
        var tempHasChoose = this.data.hasChoose
        tempHasChoose[3].isShow = false
        tempHasChoose[3].msg = ''
        this.setData({
            carAge: null,
            hasChoose: tempHasChoose
        })
    },
    distanceCancel(){
        var tempHasChoose = this.data.hasChoose
        tempHasChoose[4].isShow = false
        tempHasChoose[4].msg = ''
        this.setData({
            distance: null,
            hasChoose: tempHasChoose
        })
    },
    plCancel(){
        var tempHasChoose = this.data.hasChoose
        tempHasChoose[5].isShow = false
        tempHasChoose[5].msg = ''
        this.setData({
            pl: null,
            hasChoose: tempHasChoose
        })
    },
    standCancel(){
        var tempHasChoose = this.data.hasChoose
        tempHasChoose[6].isShow = false
        tempHasChoose[6].msg = ''
        this.setData({
            stand: null,
            hasChoose: tempHasChoose
        }) 
    },
    boxCancel(){
        var tempHasChoose = this.data.hasChoose
        tempHasChoose[7].isShow = false
        tempHasChoose[7].msg = ''
        this.setData({
            box: null,
            hasChoose: tempHasChoose
        }) 
    },
    comeCancel(){
        var tempHasChoose = this.data.hasChoose
        tempHasChoose[8].isShow = false
        tempHasChoose[8].msg = ''
        this.setData({
            come: null,
            hasChoose: tempHasChoose
        })
    },


    // 当用户点击确定按钮手
    search(){
        var data = this.data
        var that = this
        var res = {}
        var obj = {
            location: data.location === null ? '':data.location,
            order: data.orderSelect === null ? '':data.orderSelect,
            carBrand: data.carBrand === null ? '' : data.carBrand,
            price: (data.minPrice + '-' + data.maxPrice) === null ? '' : (data.minPrice + '-' + data.maxPrice),
            carAge: data.carAge === null ? '' : data.carAge,
            distance: data.distance === null ? '' : data.distance,
            pl: data.pl === null ? '' : data.pl,
            stand: data.stand === null ? '' : data.stand,
            box: data.box === null ? '' : data.box,
            come: data.come === null ? '' : data.come
        }

        // 将用户所选内容存储下来，方便后续more加载
        wx.setStorage({
            key: 'filterForMore',
            data: obj,
        })

        // 点击确定后删除用户删选面板的存储内容
        wx.removeStorage({
            key: 'filter',
            success: function(res) {
                var tempHasChoose = that.data.hasChoose
                for (let i = 0; i < tempHasChoose.length; i++) {
                    tempHasChoose[i].msg = '',
                    tempHasChoose[i].isShow = false
                }
                that.setData({
                    location: null,
                    order:null,
                    carBrand: null,
                    price: null,
                    carAge: null,
                    distance: null,
                    pl: null,
                    stand: null,
                    box: null,
                    come: null,
                    hasChoose: tempHasChoose,
                    isButtonSearchShow: false,
                    isCollect: []
                })
            }
        }),
        wx.removeStorage({
            key: 'carBrand',
            success: function(res) {
                that.setData({
                    carBrand: null
                })
            },
        })
        conServer.getcarInfo(obj, this, true)
    },

    // 当用户点击收藏按钮后
    addToMyCollection(e){
        var that = this
        var id = e.currentTarget.dataset.id
        var index = parseInt(e.currentTarget.dataset.index)
        var length = this.data.carItem.length
        var tempIsCollect = this.data.isCollect
        if (tempIsCollect[index]){
            tempIsCollect[index] = false
        }else{
            tempIsCollect[index] = true
        }
        this.setData({
            isCollect: tempIsCollect
        })

        // 从缓存中获取此刻用户的登录uid
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                var uid = res.data
                // 与服务器进行交互
                conServer.collectionServer(uid, id, that)
            },

            // 如果未登陆，则可以跳转到登录页面
            fail(){
                wx.showModal({
                    title: '提示',
                    content: '用户未登录，是否前往登录？',
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
    
    // 当车辆被点击时
    carSelect(e){
        var id = e.currentTarget.dataset.id
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                conServer.addHistory(res.data, id)
            },
            fail(){
                wx.navigateTo({
                    url: '../carInfo/carInfo?id=' + id,
                })
            }
        }) 
    }

})