// const IP = 'http://192.168.199.101' + ':3000'
// const IP = 'http://192.168.43.32' + ':3000'
// const IP = 'http://172.20.10.2'+':3000'
const IP = 'http://192.168.0.108'+':3000'
const obj = {

  //  买车初始化页面数据
  initCarInfo(that){
    return new Promise((resolve, reject)=>{
      wx.request({
        url: IP,
        success(res){
          resolve(res)
        },
        fail(){
          wx.showLoading({
          title: '数据加载失败!',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        }
      })
    }).then(res=>{
      that.setData({
        carNum: res.data.count,
        allPage: res.data.allPage,
        pageNow: res.data.pageNow,
        carItem: res.data.items,
        picArr: res.data.picArr
      })
    }) 
  },
  
  // 用户登录
  userLogin(data){
    wx.request({
      url: IP+'/userLogin',
      data:{
        uid: data.userName,
        password: data.password
      },
      success(res){
        if(res.data.state === 'error'){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }else{
          wx.setStorage({
            key: 'uid',
            data: res.data.uid
          })
          wx.setStorage({
            key: 'userName',
            data: res.data.name
          })
          wx.navigateBack({
            delta: 2,
          })
        }
      }
    })
  },


 // 用户注册
  userRegister(data){
    wx.request({
      url: IP+'/register',
      data:{
        uid: data.account,
        password: data.password,
        name: data.name,
        sex: data.gender,
        location: data.location,
        phone: data.phone
      },
      success(res){
        if(res.data.state === 'ok'){
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg
          })
        }
      }
    })
  },

  // 汽车数据获取
  getcarInfo(data, that, isInfoShow){
      wx.request({
          url: IP,
          data,
          success(res){
              var tempPicArr = res.data.picArr
              for(let i=0; i< tempPicArr.length; i++){
                  if (!tempPicArr[i].startsWith('https://')){
                      tempPicArr[i] = 'https://'+tempPicArr[i]
                  }
              }
              that.setData({
                  carItem: res.data.items,
                  picArr: tempPicArr,
                  count: res.data.count,
                  allPage: res.data.allPage,
                  pageNow: res.data.pageNow,
                  isInfoShow: isInfoShow
              },()=>{
                  if(isInfoShow){
                      setTimeout(() => {
                          that.setData({
                              isInfoShow: false
                          })
                      }, 2000)
                  }

              })
            //   console.log(res)
          },
          fail(){
              wx.showModal({
                  title: '提示',
                  content: '信息获取失败！'
              })
          }
      })
  },

//   用户下拉到底部时加载新的数据
  getMoreCarInfo(pageNow, allPage, that){
      wx.getStorage({
          key: 'filterForMore',
          success: function(storageRes) {
              var data = storageRes.data
              if(pageNow <= allPage){
                  wx.request({
                      url: IP,
                      data:{
                          ...data,
                          pageNow: that.data.pageNow + 1
                      },
                      success(requestRes) {
                          var tempPicArr = requestRes.data.picArr
                          for (let i = 0; i < tempPicArr.length; i++) {
                              if (!tempPicArr[i].startsWith('https://')) {
                                  tempPicArr[i] = 'https://' + tempPicArr[i]
                              }
                          }
                          that.setData({
                              carItem: that.data.carItem.concat(requestRes.data.items),
                              picArr: that.data.picArr.concat(tempPicArr),
                              pageNow: that.data.pageNow + 1,
                          })
                      },
                      fail() {
                          wx.showModal({
                              title: '提示',
                              content: '信息获取失败！'
                          })
                      }
                  })
              }else{
                  that.setData({
                      isLoadingShow: true,
                      isBottom: true,
                      isLoadingLongShow: true
                  })
              }
              
            },

            // 当缓存中没有filterForMore时默认加载全部
            fail(storageRes){
                if(pageNow <= allPage){
                    wx.request({
                        url: IP,
                        success(requestRes) {
                            var tempPicArr = requestRes.data.picArr
                            for (let i = 0; i < tempPicArr.length; i++) {
                                if (!tempPicArr[i].startsWith('https://')) {
                                    tempPicArr[i] = 'https://' + tempPicArr[i]
                                }
                            }
                            that.setData({
                                carItem: that.data.carItem.concat(requestRes.data.items),
                                picArr: that.data.picArr.concat(tempPicArr),
                                pageNow: that.data.pageNow + 1,
                            })
                        },
                        fail() {
                            wx.showModal({
                                title: '提示',
                                content: '信息获取失败！'
                            })
                        }
                    })
                }else{
                    that.setData({
                        isLoadingShow: true,
                        isBottom: true,
                        isLoadingLongShow: true
                    })
                }
            }
        })
   
  },

  // 将收藏车辆数据与服务器交互
  collectionServer(uid, cid, that){
      wx.request({
          url: IP+'/collection',
          data:{
              uid,
              cid
          },
          success(res){
              wx.showToast({
                  title: res.data.msg,
              })
          },
          fail(){
              wx.showModal({
                  title: '错误',
                  content: '请求失败，请检查连接！',
              })
          }
      })
  },

  // 请求用户的收藏夹数据，
  collectionShow(uid, that){
      wx.request({
          url: IP+'/showCollection',
          data:{
              uid
          },
          success(res){
            if(res.data.item){
                if (res.data.item.length !== 0) {
                    that.setData({
                        carItem: res.data.item,
                        pics: res.data.pics
                    })
                }  
            } 
          },
          fail(){
              wx.showModal({
                  title: '错误',
                  content: '请求失败，请检查连接',
              })
          }
      })
  },
  
  // 请求车辆所有信息
  carInfoShow(id, that){
      wx.request({
          url: IP+'/carAllInfo',
          data:{
              id
          },
          success(res){
              var data = res.data
              var picArr = []
              var enginePic = data.picInfo.engine
            //   var insidePic = res.data.picInfo.inside
              var outsidePic = data.picInfo.outside
              var picArr = outsidePic.concat(enginePic)
            //   去掉数组中重复的部分
            //   console.log(insidePic === outsidePic)
              that.setData({
                  isReady: true,
                  picArr,
                  picLength: picArr.length,
                  id: data.id,
                  baseInfo: data.baseInfo,
                  engineInfo: data.engineInfo,
                  insideInfo: data.insideInfo,
                  outsideInfo: data.outsideInfo,
                  safeInfo:  data.safeInfo,
                  shortInfo: data. shortInfo,
                  stopInfo:  data.stopInfo
              })
          },
          fail(){
              wx.showModal({
                  title: '错误',
                  content: '请求失败，请检查连接'
              })
          }
      })
  },


  // 提交评论
  commentSubmit(uid, cid, content){
      wx.request({
          url: IP+'/comment',
          data:{
              uid,
              cid,
              content
          },
          success(res){
              console.log(res.data)
              if(res.data.state === 'error'){
                  wx.showModal({
                      title: '错误',
                      content: res.data.msg,
                  })
              }else{
                  wx.navigateTo({
                      url: '../carInfo/carInfo?id=' + cid,
                  })
              }

          },
          fail(){
              wx.showModal({
                  title: '错误',
                  content: '请求失败，请检查连接',
              })
          }
      })
  },

//   获取评论数据
    getComment(cid, that){
        wx.request({
            url: IP+'/getComment',
            data:{
                cid
            },
            success(res){
                if(res.data.state === 'ok'){
                    that.setData({
                        commentItem: res.data.comments,
                        isPressed: []
                    })
                }else{
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                    })
                }
            },
            fail(){
                wx.showModal({
                    title: '错误',
                    content: '请求失败，请检查连接',
                })
            }
        })
    },


    // 为评论点赞
    likeTheComment(id, that){
        wx.request({
            url: IP+'/commentLike',
            data:{
                id
            },
            success(res){
                if(res.data.state === 'ok'){
                    wx.showToast({
                        title: res.data.msg,
                    })
                }else{
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                    })
                }
            },
            fail(){
                wx.showModal({
                    title: '错误',
                    content: '请求失败，请检查连接',
                })
            }
        })
    },

    // 用户反馈错误信息
    feedBackError(that){
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                var uid = res.data
                wx.getStorage({
                    key: 'userName',
                    success: function(res) {
                        var name = res.data
                        wx.request({
                            url: IP+'/feedbackerror',
                            data:{
                                uid,
                                cid: that.data.cid,
                                title: that.data.index,
                                content: that.data.content
                            },
                            success(res){
                                if(res.data.state === 'ok'){
                                    wx.showToast({
                                        title: res.data.msg,
                                    })
                                }else{
                                    wx.showModal({
                                        title: '错误',
                                        content: res.data.msg,
                                    })
                                }
                            }
                        })
                    },
                })
            },
            fail(){
                wx.showModal({
                    title: '错误',
                    content: '用户登录异常，请重新登录',
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

    // 用户上传头像
    submitHeadPic(path, uid){
        wx.uploadFile({
            url: IP+'/test',
            filePath: path,
            name: 'picture',
            formData: {
                uid
            },
        })
    },

    // 获取用户头像信息
    getUserPic(uid, that){
        wx.request({
            url: IP+'/getuserinfo',
            data:{
                uid
            },
            success(res){
                if(res.data.state === 'ok'){
                    that.setData({
                        link: IP+"/img/"+res.data.data.link
                    })
                }else{
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                    })
                }
            }
        })
    },

    // 获取用户信息
    getUserInfo(uid, that, choose){
        wx.request({
            url: IP + '/getuserinfo',
            data: {
                uid
            },
            success(res) {
                if (res.data.state === 'ok') {
                    if(choose === '0'){  
                        that.setData({
                            simg: IP+"/img/"+res.data.data.link,
                            sname: res.data.data.name
                        })
                    }else{
                        that.setData({
                            limg: IP + "/img/" + res.data.data.link,
                            lname: res.data.data.name
                        })
                    }
                    
                } else {
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                    })
                }
            }
        })
    },


    // 获取聊天数据
    getChatMsg(uid, that){
        var sidArr = []
        var resItem = []
        var realItems = []
        wx.request({
            url: IP+'/getchatmsg',
            data:{
                uid
            },
            success(res){
                var items = res.data.item
                for(let i=0; i<items.length; i++){
                    items[i].simg = IP+'/img/'+items[i].simg
                    items[i].limg = IP + '/img/' + items[i].limg
                    realItems.push(items[i])
                    if (sidArr.indexOf(items[i].sid) === -1){
                        sidArr.push(items[i].sid)
                        resItem.push(items[i])
                    }
                }
                that.setData({
                    items: resItem,
                    realItems
                })
            }
        })
    },

    // 获取两人间的聊天数据
    getTwoPersonChatMsg(uid, ssid, that){
        wx.request({
            url: IP+'/gettwopersonchatmsg',
            data:{
                uid,
                sid: ssid
            },
            success(res){
                var items = res.data
                for(let i=0; i< items.items.length; i++){
                    items.items[i].simg = IP+ "/img/" + that.data.limg
                    items.items[i].limg = IP + "/img/" + that.data.simg
                }
                that.setData({
                    items: items.items,
                })
            }
        })
    },

    // 用户发送聊天消息时
    userSendMsg(obj, that){
        // 这个时候身份需要互换，因为之前的听者变为现在的说话者
        wx.request({
            url: IP+'/insertchatmsg',
            data:{
                content: obj.content,
                simg: obj.limg.split('/').pop(),
                sid: obj.lid,
                sname: obj.lname,
                limg: obj.simg.split('/').pop(),
                lid: obj.sid,
                lname: obj.sname
            },
            success(res){
                if(res.data.state === 'ok'){
                    // 下面导航也要变化
                    wx.navigateTo({
                        url: '../chatPage/chatPage?sid=' + obj.sid + '&uid=' + obj.lid,
                    })
                }
            }
        })
    },


    // 删除用户收藏的车
    delCollection(uid, cid){
        wx.request({
            url: IP+'/delcollection',
            data:{
                uid,
                cid
            },
            success(res){
                console.log(res.data.msg)
            }
        })
    },


    // 获取用户好友列表
    getUserFrindsList(uid, that){
        wx.request({
            url: IP+'/getfriendslist',
            data:{
                uid
            },
            success(res){
                if(res.data.state === 'ok'){
                    var items = res.data.items
                    for(let i=0; i<items.length; i++){
                        items[i].link = IP+ "/img/" +items[i].link
                    }
                    that.setData({
                        items
                    })
                }
            }
        })
    },

    // 用户模糊搜索
    searchGetUserInfo(uid, that){
        wx.request({
            url: IP+'/getsearchuserinfo',
            data:{
                uid
            },
            success(res){
                if(res.data.state === 'ok'){
                    var items = res.data.items
                    for (let i = 0; i < items.length; i++){
                        items[i].link = IP+ "/img/"+items[i].link
                    }
                    that.setData({
                        searchItems: items
                    })
                }
            }
        })
    },

    // 添加好友
    addFriend(uid, fid){
        wx.request({
            url: IP+'/addfriend',
            data:{
                uid,
                fid
            },
            success(res){
                if(res.data.state === 'ok'){
                    wx.showToast({
                        title: res.data.msg,
                    })
                }
            }
        })
    },

    // 删除好友
    removeFriend(uid, fid) {
        wx.request({
            url: IP + '/removefriend',
            data: {
                uid,
                fid
            },
            success(res) {
                if (res.data.state === 'ok') {
                    wx.showToast({
                        title: res.data.msg,
                    })
                }
            }
        })
    },


    // 用户发布问问
    submitQuestion(uid, title, content){
        wx.request({
            url: IP + '/submitquestion',
            data:{
                uid,
                title,
                content
            },
            success(res){
                if(res.data.state === 'ok'){
                    wx.showToast({
                        title: res.data.msg,
                        success(){
                            setTimeout(()=>{
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 1000)  
                        }
                    })
                }
            }
        })
    },

    // 首页获取前三条问问
    getUserQuestion(that){
        wx.request({
            url: IP+'/getuserquestion',
            success(res){
                if(res.data.state === 'ok'){
                    var items = res.data.items
                    for(let i=0; i<items.length; i++){
                        var tempArr = items[i].time.split(' ')
                        var tempDate = tempArr[0].split('-')
                        var dataStr = tempDate[1]+'-'+tempDate[2]
                        var tempTime = tempArr[1].split(':')
                        var timeStr = tempTime[0]+':'+tempTime[1]
                        items[i].time = dataStr+' '+timeStr
                        items[i].image = IP + '/img/' +items[i].image
                    }
                    that.setData({
                        questionItem: res.data.items
                    })
                }
            }
        })
    },


    // 获取所有问问
    getUserAllQuestion(that) {
        wx.request({
            url: IP + '/getuserallquestion',
            success(res) {
                if (res.data.state === 'ok') {
                    var items = res.data.items
                    for (let i = 0; i < items.length; i++) {
                        var tempArr = items[i].time.split(' ')
                        var tempDate = tempArr[0].split('-')
                        var dataStr = tempDate[1] + '-' + tempDate[2]
                        var tempTime = tempArr[1].split(':')
                        var timeStr = tempTime[0] + ':' + tempTime[1]
                        items[i].time = dataStr + ' ' + timeStr
                        items[i].image = IP + '/img/' + items[i].image
                    }
                    that.setData({
                        questionItem: res.data.items
                    })
                }
            }
        })
    },

    // 获取具体某条问问的详细内容和用户信息
    getQuestion(id, that){
        wx.request({
            url: IP+'/getquestion',
            data:{
                id
            },
            success(res){
                if(res.data.state === 'ok'){
                    var item = res.data.result
                    var tempArr = item.articleInfo.time.split(' ')
                    var tempDate = tempArr[0].split('-')
                    var dataStr = tempDate[1] + '-' + tempDate[2]
                    var tempTime = tempArr[1].split(':')
                    var timeStr = tempTime[0] + ':' + tempTime[1]
                    item.articleInfo.time = dataStr + ' ' + timeStr
                    item.userInfo.link = IP+ "/img/" + item.userInfo.link
                    that.setData({
                        authorInfo: item.userInfo,
                        articleInfo: item.articleInfo
                    })
                }
            }
        })
    },


    // 获取关于某条问问的留言
    getQuestionComment(qid, that){
        wx.request({
            url: IP+'/getquestioncomment',
            data:{
                qid
            },
            success(res){
                if(res.data.state === 'ok'){
                    var items = res.data.result
                    for(let i=0; i<items.length; i++){
                        items[i].link = IP+'/img/' +items[i].link
                    }
                    that.setData({
                        commentItems: items,
                        isCommentReady: true
                    })
                }
            }
        })
    },

    // 为问问的评论点赞
    likeQuestionComment(qid, uid){
        wx.request({
            url: IP+'/likequestioncomment',
            data:{
                qid,
                uid
            },
            success(res){
                if(res.data.state === 'ok'){
                    wx.showToast({
                        title: res.data.msg,
                    })
                }
            }
        })
    },

    // 阅读问问时，浏览量增加
    readQuestion(id){
        wx.request({
            url: IP + '/readquestion',
            data:{
                id
            },
            success(res){}
        })
    },

    // 问问提交评论
    submitQuestionComment(qid, uid, content){
        wx.request({
            url: IP+'/submitquestioncomment',
            data:{
                qid,
                uid,
                content
            },
            success(res){
                if(res.data.state === 'ok'){
                    wx.showToast({
                        title: res.data.msg,
                    })
                    wx.navigateTo({
                        url: '../questionArticle/questionArticle?id='+qid,
                    })
                }
            }
        })
    },


    // 获取用户的浏览历史
    getHistory(uid, that){
        wx.request({
            url: IP+'/gethistory',
            data:{
                uid
            },
            success(res){
                if(res.data.state === 'ok'){
                    var items = res.data.data
                    for(let i=0; i<items.length; i++){
                        items[i].time = items[i].time.split(' ')[0]
                    }   
                    that.setData({
                        isHistoryReady: true,
                        historyItem: items
                    })
                }
            }
        })
    },


    // 删除用户的浏览历史
    delHistory(uid, cid){
        wx.request({
            url: IP+'/delhistory',
            data:{
                uid,
                cid
            },
            success(res){
                if(res.data.state === 'ok'){
                    wx.showToast({
                        title: res.data.msg,
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false
                    })
                }
            }
        })
    },


    // 添加历史记录
    addHistory(uid, cid){
        wx.request({
            url: IP+'/addhistory',
            data:{
                uid,
                cid
            },
            success(res){
                if(res.data.state === 'ok'){
                    console.log(res.data.msg)
                    wx.navigateTo({
                        url: '../carInfo/carInfo?id=' + cid,
                    })
                }else{
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                        showCancel: false
                    })
                }
            }
        })
    },


    // 用户信息页获取 用户信息
    userPageGetUserInfo(uid, that){
        wx.request({
            url: IP+'/getuserinfo',
            data:{
                uid
            },
            success(res){
                if(res.data.state === 'ok'){
                    var data = res.data.data
                    data.link = IP+'/img/'+data.link
                    if(data.sex !== '男' && data.sex !== '女'){
                        data.sex = '保密'
                    }
                    that.setData({
                        userInfo: data
                    })
                }else{
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                        showCancel: false
                    })
                }
            }
        })
    },


    // 举报用户
    addUserReport(uid, bid, type, reason, uphone, uname, bname){
        console.log({
                uid,
                bid,
                type,
                reason,
                uphone,
                uname,
                bname
            })
        wx.request({
            url: IP+'/adduserreport',
            data:{
                uid,
                bid,
                type,
                reason,
                uphone,
                uname,
                bname
            },
            success(res){
                if(res.data.state === 'ok'){
                    
                    wx.navigateBack({
                        delta: 1
                    })
                    setTimeout(()=>{
                        wx.showToast({
                            title: res.data.msg,
                        })
                    }, 100)
                }else{
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                    })
                }
            }
        })
    },

    // 获取用户举报信息
    getUserReport(uid, that){
        wx.request({
            url: IP+'/getuserreport',
            data:{
                uid
            },
            success(res){
                if(res.data.state !== 'ok'){
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                    })
                }else{
                    that.setData({
                        items: res.data.result
                    })
                }
            }
        })
    },


    // 提交预约卖车的信息
    addSaleCarInfo(uid, city, cartype, date, distance, appraise){
        wx.request({
            url: IP+'/addsalecarinfo',
            data:{
                uid,
                city,
                cartype,
                date,
                distance,
                appraise
            },
            success(res){
                if(res.data.state === 'ok'){
                    wx.showModal({
                        title: '成功',
                        content: res.data.msg,
                        showCancel: false
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                }else{
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                        showCancel: false
                    })
                }
                
            }
        })
    },


    // 获取估价信息
    getCarEvaluateInfo(cartype, date, dataFrom, that){
        var date = date.split('-')[0]
        wx.request({
            url: IP+'/getcarevaluateinfo',
            data:{
                cartype,
                date,
                dataFrom
            },
            success(res){
                if(res.data.state === 'ok'){
                    that.setData({
                        thisYearItem: res.data.thisYearResult,
                        allItem: res.data.allResult,
                        loading: false
                    })
                }
            }
        })
    },

    // 获取用户的卖车记录
    getUserSaleCarInfo(uid, that){
        wx.request({
            url: IP+'/getusersalecarinfo',
            data:{
                uid
            },
            success(res){
                if(res.data.state === 'ok'){
                    that.setData({
                        items: res.data.data
                    })
                }else{
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                        showCancel: false
                    })
                }
            }
        })
    }
}
module.exports = obj