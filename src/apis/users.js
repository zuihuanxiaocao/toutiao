// 1.引入axios
import axios from '@/utils/myaxios.js'

// 2.添加方法实现登陆业务
export const login = (data) => {
  return axios({
    method: 'post',
    url: '/login',
    data
  })
}
// 注册
export const register = (data) => {
  return axios({
    method: 'post',
    url: '/register',
    data
  })
}
// 根据id获取用户数据
export const getUserInfoById = (id) => {
  return axios({
    url: `/user/${id}`
  })
}
// 编辑用户信息
export const updateUserInfo = (id, data) => {
  return axios({
    method: 'post',
    url: `/user_update/${id}`,
    data
  })
}
// 关注文章发布者
export const focusUser = (id) => {
  return axios({
    url: `/user_follows/${id}`
  })
}
// 取消关注文章发布者
export const unfocusUser = (id) => {
  return axios({
    url: `/user_unfollow/${id}`
  })
}
// 获取用户关注列表
export const getUserFocus = () => {
  return axios({
    url: `/user_follows`
  })
}
// 获取用户收藏列表
export const getUserStars = () => {
  return axios({
    url: `/user_star`
  })
}
