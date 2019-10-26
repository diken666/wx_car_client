const conServer = require('../../utils/connectServer.js')

Page({

    data:{
        uid: null,
        fid: null,

        userInfo: null
    },

    onLoad(options){
        var uid = options.uid
        var fid = options.fid
        this.setData({
            uid,
            fid
        },()=>{
            conServer.userPageGetUserInfo(uid, this)
        })
    },

    // 打电话给用户
    callHe(){
        wx.makePhoneCall({
            phoneNumber: this.data.userInfo.phone.toString()
        })
    },

    // 添加到通讯录
    addToMyNote(){ 
        wx.addPhoneContact({
            firstName: this.data.userInfo.name,
            remark: this.data.userInfo.name,
            addressCountry: '中国',
            addressState: '浙江',
            photoFilePath: this.data.userInfo.link,
            mobilePhoneNumber: this.data.userInfo.phone,
            workPhoneNumber: this.data.userInfo.phone,
            hostNumber: this.data.userInfo.phone,
            homePhoneNumber: this.data.userInfo.phone,
            addressCity: this.data.userInfo.location
        })
    },

    // 添加好友
    addFriend(e){
        var fid = e.currentTarget.dataset.fid
        var that = this
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                if(fid === res.data){
                    wx.showModal({
                        title: '提示',
                        content: '不能添加自己为好友',
                        showCancel: false
                    })
                }else{
                    conServer.addFriend(that.data.uid, fid)
                }
            },
            fail(){
                wx.showModal({
                    title: '提示',
                    content: '当前未登录，是否前往登陆？',
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


    // 举报用户
    reportUser(e){
        var that = this
        var id = e.currentTarget.dataset.id
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                if(id !== res.data){
                    wx.navigateTo({
                        url: '../reportUser/reportUser?uid=' + res.data + '&id=' + id + '&name=' + that.data.userInfo.name,
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '不能举报自己',
                        showCancel: false
                    })
                }
                
            },
            fail(){
                wx.showModal({
                    title: '提示',
                    content: '当前未登录，是否前往登陆？',
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
    }
})