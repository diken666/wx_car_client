var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
var startPos = null;
var dataInfo = [
    { name: "奥迪", num : 1580}, 
    { name: "宝骏", num: 331 }, 
    { name: "宝马", num: 1872 }, 
    { name: "保时捷", num: 148 }, 
    { name: "奔驰", num: 1206 }, 
    { name: "奔腾", num: 259 }, 
    { name: "本田", num: 842 }, 
    { name: "标志", num: 215 }, 
    { name: "别克", num: 2088 }, 
    { name: "比亚迪", num: 1054 }, 
    { name: "北汽幻速", num: 176 }, 
    { name: "北汽威旺", num: 108 },
    { name: "长安", num: 592 }, 
    { name: "传祺", num: 186 }, 
    { name: "长安欧尚", num: 100 }, 
    { name: "大众", num: 3312 }, 
    { name: "东南", num: 436 }, 
    { name: "东风风神", num: 100 }, 
    { name: "东风风行", num: 353 }, 

]
Page({
    data: {
    },
    touchHandler: function (e) {
        lineChart.scrollStart(e);
    },
    moveHandler: function (e) {
        lineChart.scroll(e);
    },
    touchEndHandler: function (e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },
    createSimulationData: function () {
        var categories = [];
        var data = [];
        for (var i = 0; i < dataInfo.length; i++) {
            categories.push(dataInfo[i].name);
            data.push(dataInfo[i].num);
        }
        return {
            categories: categories,
            data: data
        }
    },
    onLoad: function (e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        var simulationData = this.createSimulationData();
        lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: simulationData.categories,
            animation: false,
            series: [{
                name: '汽车数量',
                data: simulationData.data,
                format: function (val, name) {
                    return val;
                }
            }],
            xAxis: {
                disableGrid: false
            },
            yAxis: {
                title: '汽车数量',
                format: function (val) {
                    return val;
                },
                min: 0
            },
            width: windowWidth,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    }
});