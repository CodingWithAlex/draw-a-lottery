// pages/me/me.js
const app = getApp()

Page({

  /**
   * 组件的初始数据
   */
  data: {
    number:'0'
  },
  onLoad: function () {
    this.onnewQuery();
  },
  onnewQuery: function () {
   
    const db = wx.cloud.database()
    console.log(app.globalData.openid)
    db.collection('Number').where({
      openid: app.globalData.openid
    }).get({
      success: res => {
        console.log("xxxxxx",res)
        if (res.number != 0) {
          app.globalData.openid = res.openid;
          app.globalData.nickName = res.nickName;
          app.globalData.avatarUrl = res.avatarUrl;
          app.globalData.number = res.number;
          this.setData({
            number: res.data[0].number
          })
          console.log("123", that.number)
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },


})
