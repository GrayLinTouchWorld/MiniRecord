// 工具库


// 隨機字符串
export const randomID = function () {
  var t = ((new Date() / 1) + "").split(""),
    tmp = "",
    ran = 0;
  for (var i = t.length; i > 0; i--) {
    ran = Math.floor(Math.random() * 3) + 1;
    if (t[i]) {
      if (t[i] != 0) {
        if (ran == 1) {
          tmp += String.fromCharCode(64 + parseInt(t[i]));
        } else if (ran == 2) {
          tmp += String.fromCharCode(64 + parseInt(t[i])).toLowerCase();
        } else {
          tmp += t[i]
        }
      } else {
        tmp += t[i];
      }
    }
  }
  return tmp;
}

// 類型判斷
export const typeStr = function (obj) {
  //直接會return壹個字符串  "[objec 妳傳進了的數據的類型String/Number/Array/Object/Null/Undefined]"
  //然後正則匹配得到想要的類型
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
}

// cookie 操作
export const cookie = {
  set: function (key, val, day) {
    var date = new Date()
    if (day) {
      date.setTime(date.getTime() + day * 24 * 3600 * 1000); // 格式化日期
    }
    document.cookie = key + "=" + val + (day ? ";path=/;expires=" + date.toGMTString() : '') //設置cookie
  },
  get: function (key) {
    var getCookie = document.cookie.replace(/[ ]/g, ""), // 獲取cookie，並且將獲得的cookie格式化，去掉空格字符
      arrCookie = getCookie.split(";"), // 將獲得的cookie以"分號"為標識 將cookie保存到arrCookie的數組中
      match // 聲明變量
    for (var i = 0; i < arrCookie.length; i++) {
      arrCookie[i] = arrCookie[i].replace('=', ' ')
      var arr = arrCookie[i].split(" ");
      if (key == arr[0]) {
        match = arr[1];
        break;
      }
    }
    return match
  },
  delete: function (key) {
    var date = new Date()
    date.setTime(date.getTime() - 10000); // 過期處理
    document.cookie = key + "=v; expires =" + date.toGMTString();
  }
}

// 日期格式化
var plusZero = num => num > 9 ? num : `0${num}`
export const timeFormat = (t, format = 'yyyy-mm-dd') => {
  // 接受format为 yyyy mm dd hh MM ss 任意精简字段，连接符自定义

  t = Number(t)

  if (t) {

    if (t < 1e10) t *= 1e3

    t = new Date(t)
    let y = t.getFullYear(), // 年份
      m = plusZero(t.getMonth() + 1), // 月份
      d = plusZero(t.getDate()), // 日期

      h = plusZero(t.getHours()), // 小时
      M = plusZero(t.getMinutes()), // 分钟
      s = plusZero(t.getSeconds()) // 秒

    let temp = format
    temp = temp.replace(/yyyy/g, y)
    temp = temp.replace(/mm/g, m)
    temp = temp.replace(/dd/g, d)
    temp = temp.replace(/hh/g, h)
    temp = temp.replace(/MM/g, M)
    temp = temp.replace(/ss/g, s)

    return temp
  } else {
    return '--/--/--'
  }
}