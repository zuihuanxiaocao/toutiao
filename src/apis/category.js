// 引入axios
import axios from '@/utils/myaxios.js'
// 获取所有栏目数据
export const getCateList = () => {
  return axios({
    url: '/category'
  })
}
