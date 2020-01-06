//index.js
const app = getApp()

Page({
  data: {
   userInfo:{},
   openid:0,
  },

  onLoad: function() {
    
    this.onGetOpenid();
    
    console.log(app.globalData.openid)
  },
  onShow: function () {
    this.onGetOpenid();
  },
  getUserInfo: function (e) {
    
    let that = this;
    // console.log(e)
    // 获取用户信息
    wx.getSetting({
      success(res) {
        // console.log("res", res)
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          
          wx.getUserInfo({
            success(res) {
              
              console.log("获取用户信息成功", res.userInfo)
              console.log("获取用户序号", app.globalData.number)
              console.log("获取用户序号", app.globalData.openid)
              app.globalData.nickName = res.userInfo.nickName
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              if (app.globalData.number== 0) {
                app.globalData.bignumber = app.globalData.bignumber + 1;
                that.onAdd();
              }else{
                wx.navigateTo({
                  url: '/pages/me/me',
                })
              }
              
            },
            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
          that.showSettingToast("请授权")
        }
      }
    })
  },
  onAdd: function () {
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database()
    db.collection('Number').count({
      success: res => {
        console.log("123XXX123", res.total)
        app.globalData.bignumber = res.total+1
        db.collection('Number').add({
      data:{
        openid: app.globalData.openid,
        number: app.globalData.bignumber,
        nickName: app.globalData.nickName,
        avatarUrl: app.globalData.avatarUrl,
      },
      success: res => {
        console.log("1231123",res)
        app.globalData.number=0;
        wx.navigateTo({
          url: '/pages/me/me',
        })
        wx.hideLoading();
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err)
      },
    })
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
  onQuery: function () {
    const db = wx.cloud.database()
    console.log("xxxxxx", app.globalData.openid)
    db.collection('Number').where({
      openid: app.globalData.openid
    }).get({
      success: res => {
        console.log("xxxxxx", res.data[0].number)
        if(res.openid!=null){
          app.globalData.openid = res.data[0].openid;
          app.globalData.nickName = res.data[0].nickName;
          app.globalData.avatarUrl = res.data[0].avatarUrl;
          app.globalData.number = res.data[0].number;
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
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        
        app.globalData.openid = res.result.openid
        console.log('[云函数] [login] user openid: ', app.globalData.openid)
        this.onQuery();
        this.onQueryNumber();
        this.onQuerybigNumber();
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onQueryNumber: function () {
    const db = wx.cloud.database()

    db.collection('Number').where({
      openid: app.globalData.openid
    }).get({
      success: res => {
        console.log("123XXX123", res.data[0].number)
        app.globalData.number = res.data[0].number
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
  onQuerybigNumber: function () {
    const db = wx.cloud.database()

    db.collection('Number').count({
      success: res => {
        console.log("123XXX123", res.total)
        app.globalData.bignumber = res.total
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
