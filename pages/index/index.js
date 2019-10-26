const conServer = require('../../utils/connectServer.js')
const wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;

Page({

  data: {
    carNum: null,
    allPage: null,
    pageNow: null,
    carItem: [],
    picArr: [],
    isShow: false,
    questionItem: null
  },


    touchHandler: function (e) {
        console.log(pieChart.getCurrentDataIndex(e));
    },  

    toCarSearch(){
        wx.navigateTo({
            url: '../carSearch/carSearch',
        })
    },

  onLoad(){
        conServer.getUserQuestion(this)
        conServer.initCarInfo(this)


      var windowWidth = 320;
      try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
      } catch (e) {
          console.error('getSystemInfoSync failed!');
      }

      pieChart = new wxCharts({
          animation: true,
          canvasId: 'pieCanvas',
          type: 'pie',
          series: [{
              name: '瓜子',
              data: 19676,
          }, {
              name: '人人车',
              data: 12954,
          }],
          width: windowWidth,
          height: 300,
          dataLabel: true,
      });
  },

    // 下拉刷新
    onPullDownRefresh() {
        var that = this
        wx.showLoading({
            title: '刷新中',
            success() {
                conServer.getUserQuestion(that)
                conServer.initCarInfo(that)
                setTimeout(function () {
                    wx.hideLoading()
                    wx.stopPullDownRefresh()
                }, 500)
            }
        })
    },

    // 当车辆被点击时
    carSelect(e) {
        var id = e.currentTarget.dataset.value
        wx.getStorage({
            key: 'uid',
            success: function (res) {
                conServer.addHistory(res.data, id)
            },
            fail() {
                wx.navigateTo({
                    url: '../carInfo/carInfo?id=' + id,
                })
            }
        })
    },


    // 点击与客服聊天
    toChatWithKefu(){
        wx.getStorage({
            key: 'uid',
            success: function(res) {
                var uid = res.data
                var sid = 'kefu'
                wx.navigateTo({
                    url: '../chatPage/chatPage?sid=' + sid + '&uid='+uid,
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

    // 当用户点击问题项后
    questionTap(e){
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../questionArticle/questionArticle?id='+id,
        })
    },

    // 用户点击查看更多问问
    lookMoreQuestion(){
        wx.navigateTo({
            url: '../lookMoreQuestion/lookMoreQuestion',
        })
    },

    // 用户点击查看更多数据表格
    lookMoreTable(){
        wx.navigateTo({
            url: '../tablePage/tablePage',
        })
    }
})