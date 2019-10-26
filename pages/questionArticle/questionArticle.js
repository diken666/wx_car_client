
const conServer = require('../../utils/connectServer.js')

Page({
    data:{
        id: null,
        authorInfo: null,
        articleInfo: null,
        isCommentReady: false,
        commentItems: null,
        // 记录每个点赞按钮的状态
        isPressed: []
    },  
    onLoad(options){
        var id = options.id
        this.setData({
            id
        }, ()=>{
            // 加载用户发布的问问信息
            conServer.getQuestion(id, this)
            // 获取此条问问的所有留言
            conServer.getQuestionComment(id, this)
            // 此条问问阅读量+1
            conServer.readQuestion(id)
        })
    },
    
    // 为评论点赞
    likeIt(e){
        var uid = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.index
        var tempIsPressed = this.data.isPressed
        var tempCommentItems = this.data.commentItems
        if (!tempIsPressed[index]){
            tempIsPressed[index] = true
            tempCommentItems[index].likes += 1
        }
        this.setData({
            isPressed: tempIsPressed,
            commentItems: tempCommentItems
        }, ()=>{
            conServer.likeQuestionComment(this.data.id, uid)
        })
    },

    // 问问写留言
    writeQuestionComment(){
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                wx.navigateTo({
                    url: '../writeQuestionComment/writeQuestionComment?uid='+ res.data + '&qid='+that.data.id,
                })
            },
            fail(){
                wx.showModal({
                    title: '提示',
                    content: '当前用户未登陆，是否前往登录？',
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
    toUser(e){
        var uid = e.currentTarget.dataset.uid
        var fid = e.currentTarget.dataset.fid
        wx.navigateTo({
            url: '../userInfo/userInfo?uid='+uid+'&fid='+fid,
        })
    }
})