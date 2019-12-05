import axios from '@/utils/myaxios.js'

// 实现文件的上传
export const uploadFile = (file) => {
  return axios({
    url: '/upload',
    method: 'post',
    data: file
  })
}
