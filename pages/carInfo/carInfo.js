
const conServer = require('../../utils/connectServer.js')


Page({
    data:{
        // 页面数据是否加载完成
        isReady: false,
        isLoadMore: false,
        isCollect: false,
        picLength: 2,
        currentIndex: 1,
        picArr: null,

        id: null,
        baseInfo: null,
        engineInfo: null,
        insideInfo: null,
        outsideInfo: null,
        safeInfo: null,
        shortInfo: null,
        stopInfo: null,

        commentItem: null,
        // 是否已经点赞
        isPressed: [],
    },
    onShow(){
        // 获取品论信息
        conServer.getComment(this.data.id, this)
        // // 获取用户头像
        // conServer.getUserPic()
    },
    onHide(){
        this.setData({
            isReady: false
        })
    },
    onLoad(options){
        var id = options.id
        this.setData({
            id
        },()=>{
            conServer.carInfoShow(id, this)
            
        })
       
    },
    swiperChange(e){
        var currentIndex = e.detail.current + 1
        this.setData({
            currentIndex
        })
    },

   // 展开更多参数栏
    forMore(){
        this.setData({
            isLoadMore: true
        })
    },

    // 收起更多参数栏
    packUp(){
        this.setData({
            isLoadMore: false
        })
    },

    // 添加到我的收藏
    addToMyCollection(){
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                if(that.data.isCollect){
                    that.setData({
                        isCollect: false
                    })
                }else{
                    that.setData({
                        isCollect: true
                    })
                }
                conServer.collectionServer(res.data, that.data.id, that)
            },
            fail(){
                wx.showModal({
                    title: '提示',
                    content: '当前未登录，是否前往登录？',
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

    // 评论
    toComment(){
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                wx.navigateTo({
                    url: '../comment/comment?cid=' + that.data.id,
                })
            },
            fail(){
                wx.showModal({
                    title: '提示',
                    content: '当前用户未登录，是否前往登录？',
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

    // 用户为评论点赞
    likeIt(e){
        var id = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.index
        var tempIsPressed = this.data.isPressed
        var tempCommentItem = this.data.commentItem
        if(!tempIsPressed[index]){
            tempIsPressed[index] = true
            tempCommentItem[index].likes += 1
            conServer.likeTheComment(id, this)
            this.setData({
                isPressed: tempIsPressed,
                commentItem: tempCommentItem
            })
        }
    },


    // 反馈错误
    toFeedbackError(){
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                wx.navigateTo({
                    url: '../feedBackError/feedBackError?cid='+that.data.id,
                })
            },
            fail(){
                wx.showModal({
                    title: '提示',
                    content: '用户未登录，是否前往登录',
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


    // 点击用户转到用户信息界面
    toUser(e) {
        var uid = e.currentTarget.dataset.uid
        var id = this.data.id
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                wx.navigateTo({
                    url: '../userInfo/userInfo?uid=' + res.data + '&fid=' + id,
                })
            },
            fail(){
                wx,wx.showModal({
                    title: '提示',
                    content: '当前未登录，是否前往登录？',
                    showCancel: true,
                    success: function(res) {
                        if(res.confirm){
                            wx.navigateTo({
                                url: '../login/login',
                            })
                        }
                    },
                })
            }
        })
        
    }

})