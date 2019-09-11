import Vue from 'vue';

// http get工具函数 获取数据
export function get (url, data) {
  return request(url, 'get', data)
}
export function post (url, data) {
  return request(url, 'post', data)
}

function request(url, method, data) {
  return new Promise((resolve, reject) => {
    if (method == 'get') {
      Vue.$http.get(url, data).then(res => {
        console.log(res)
        if (res.data.code == 1) {
          // Vue.$messageAlet.success('成功')
          if (res.data.data == void 0) {
            Vue.$messageAlet.success(res.data.msg)
            resolve('')
          } else {
            if (res.data.page != void 0) {
              let data = {
                data: res.data.data,
                page: res.data.page
              }
              resolve(data)
            } else {
              resolve(res.data.data)
            }
          }
        } else {
          Vue.$messageAlet.error(res.data.msg)
          reject()
        }
      })
    } else if (method == 'post') {
      Vue.$http.post(url, data).then(res => {
        // console.log(res)
        if (res.data.code == 1) {
          if (res.data.data == void 0) {
            Vue.$messageAlet.success(res.data.msg)
            resolve('')
          } else {
            resolve(res.data.data)
          }
        } else {
          // console.log(Vue.$messageAlet)
          Vue.$messageAlet.error(res.data.msg)
          reject()
        }
      })
    }
  })
}
