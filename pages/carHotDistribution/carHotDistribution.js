var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
Page({
    data: {
    },
    touchHandler: function (e) {
        console.log(pieChart.getCurrentDataIndex(e));
    },
    onLoad: function (e) {
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
                name: '奥迪',
                data: 1580,
            }, {
                name: '宝马',
                data: 1872,
            }, {
                name: '别克',
                data: 2088,
            }, {
                name: '大众',
                data: 3312,
            }, {
                name: '福特',
                data: 1711,
            }, {
                name: '现代',
                data: 1674,
            }],
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });
    }
});