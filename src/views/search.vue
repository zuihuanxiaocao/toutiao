<template>
  <div class="search">
      <div class="header">
          <span class="iconfont iconjiantou2" @click="$router.back()"></span>
          <div>
              <van-icon name="search" class="fanda"/>
              <input type="text" placeholder="请输入搜索内容" v-model='keyword'>
          </div>
          <span @click='search'>搜索</span>
      </div>
      <div class="historyList">
        <h2>历史记录</h2>
        <p v-for='(value,index) in historyList' :key='index' @click="searchArticle(value)">{{value}}</p>
      </div>
      <div class="hotList clearfix">
        <h2>热门搜索</h2>
        <p v-for='value in hotList' :key='value.id' @click="$router.push({path: `/articleDeatil/${value.id}`})">{{value.title}}</p>
      </div>
      <div class="resultList clearfix">
        <h2>搜索结果</h2>
        <p v-for='value in resultList' :key='value.id' @click="$router.push({path: `/articleDeatil/${value.id}`})">{{value.title}}</p>
      </div>
  </div>
</template>

<script>
import { hotSearch, serachArticle } from '@/apis/article.js'
export default {
  data () {
    return {
      keyword: '',
      hotList: [],
      historyList: [],
      resultList: []
    }
  },
  methods: {
    // 实现搜索--封装
    async searchArticle (key) {
      let res = await serachArticle(key)
      //   console.log(res)
      this.resultList = res.data.data
    },

    // 获取历史记录数据--数组
    getdata () {
      // 获取历史记录，实现动态渲染
      let historyStr = localStorage.getItem('heimatoutiao_searchkey_list') || '[]'
      return JSON.parse(historyStr)
    },
    // 实现搜索功能：1.历史记录的存储 2.搜索功能
    search () {
      // 1.获取搜索关键字
      // 2.先将关键字添加到数组，这个数组要基于之前的历史记录
      let arr = this.getdata()
      // 添加前进行处理
      //   判断当前存储的关键字的数量是否已经达到最大值，如果是，则删除最前面一个，再追加
      if (arr.length === 10) {
        arr.shift()
      }
      // 判断当前关键字是否已经存在，如果存在，则先删除再添加
      if (arr.indexOf(this.keyword) !== -1) {
        arr.splice(arr.indexOf(this.keyword), 1)
      }
      arr.unshift(this.keyword)
      // 有可能输入相同的关键字，所以需要进行去重--添加之后来处理
      // arr = [...new Set(arr)]
      // 3，将搜索关键字存储到本地
      // heima_39_searchkey_list：是我们自己定义的
      localStorage.setItem('heimatoutiao_searchkey_list', JSON.stringify(arr))

      // 实现搜索功能
      this.searchArticle(this.keyword)
    }
  },
  // 对搜索关键字进行监听
  watch: {
    async keyword () {
      let res = await hotSearch(this.keyword)
      console.log(res)
      this.hotList = res.data.data
    }
  },
  async mounted () {
    let res = await hotSearch()
    console.log(res)
    // 读取历史记录
    this.historyList = this.getdata()
  }
}
</script>

<style lang='less' scoped>
.search{
    .header{
        display: flex;
        height: 50px;
        align-items: center;
        background-color: #eee;
        > div {
            flex: 1;
            padding: 0 15px;
            position: relative;
            > input {
                width: 100%;
                height: 30px;
                border:none;
                border:1px solid #ccc;
                border-radius: 15px;
                line-height: 30px;
                padding-left: 40px;
                box-sizing: border-box;
            }
            > .fanda{
                font-size: 18px;
                position: absolute;
                left: 28px;
                top: 8px;
            }
        }
        > span {
            padding: 0 10px;
        }
    }
    .historyList{
        padding: 20px 10px;
        border-bottom: 1px solid #ccc;
        > h2 {
            line-height: 36px;
            font-weight: bold;
        }
        > p {
            line-height: 26px;
        }
    }
    .hotList,.resultList{
        padding: 20px 10px;
        border-bottom: 1px solid #ccc;
        > h2 {
            line-height: 36px;
            font-weight: bold;
        }
        > p {
            line-height: 26px;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }
}
</style>
