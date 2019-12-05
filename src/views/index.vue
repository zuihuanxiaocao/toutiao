<template>
  <div class="index">
    <div class="header">
      <div class="logo iconfont iconnew"></div>
      <div class="search" @click="$router.push('/search')">
        <van-icon name="search" />搜索内容
      </div>
      <van-icon name="user-circle-o" class="icon_user" @click="goPersonal" />
    </div>
    <van-tabs v-model="active" sticky swipeable >
      <van-tab :title="value.name" v-for="(value,index) in cateList" :key="index">
        <van-list
          :immediate-check='false'
          :offset = 5
          v-model="value.loading"
          :finished="value.finished"
          finished-text="没有更多了"
          @load="onLoad"
          loading-text="正在玩命加载....."
        >
        <articleBlock v-for='(sv,si) in value.articleList' :key='si' :post='sv' @click='$router.push({path:`articleDeatil/${sv.id}`})'></articleBlock>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getCateList } from '@/apis/category.js'
import { getArticleList } from '@/apis/article.js'
import articleBlock from '@/components/articleBlock.vue'
export default {
  components: {
    articleBlock
  },
  data () {
    return {
      active: localStorage.getItem('heimatoutiao_id') ? 1 : 0,
      cateList: []
    }
  },
  watch: {
    async active () {
      let id = this.cateList[this.active].id
      console.log(id)
      // 将数据存储到当前栏目数组中
      // let res = await getArticleList({ pageIndex: 1, pageSize: 10, category: id })
      // this.cateList[this.active].articleList = res.data.data
      if (this.cateList[this.active].articleList.length === 0) {
        this.init()
      }
    }
  },
  async mounted () {
    let res = await getCateList()
    if (res.data.data && res.data.data.length > 0) {
      this.cateList = res.data.data
      // 对数据进行改造，添加后期业务处理所需要的属性
      // 栏目的文章数据：articleList:[]
      // 当前页码：pageIndex
      // 当前每页显示的数量:pageSize
      // map会执行回调函数，并将回调函数的结果存储到数组后返回
      this.cateList = this.cateList.map(value => {
        return {
          ...value,
          articleList: [], // 当前栏目中的文章列表数据
          pageIndex: 1, // 每页当前数据页码
          pageSize: 5, // 每页显示的记录数
          loading: false, // 上拉加载更多数据的加载状态，为true时则说明正在加载数据
          finished: false, // 下拉加载更多数据的完成状态，为true时说明没有更多数据了
          isLoading: false // 下拉刷新标识
        }
      })
      // console.log(this.cateList)
      // 获取当前默认栏目的文章数据
      // this.init(this.cateList[this.active].id)
      this.init()
    }
  },
  methods: {
    onRefresh () {
      // 重新加载数据
      this.cateList[this.active].pageIndex = 1
      this.cateList[this.active].articleList.length = 0
      this.init(() => {
        this.cateList[this.active].isLoading = false
        this.cateList[this.active].finished = false
      })
    },
    onLoad () {
      // 发起异步请求，获取下一页数据
      this.cateList[this.active].pageIndex++
      this.init()
    },
    async init (callback) {
      let res = await getArticleList({
        pageIndex: this.cateList[this.active].pageIndex,
        pageSize: this.cateList[this.active].pageSize,
        category: this.cateList[this.active].id })
      // 判断是否有callback,有callback才会执行后面的函数调用
      callback && callback()
      // if(callback){
      //   callback()
      // }
      // 将数据存储到当前栏目的数组中
      this.cateList[this.active].articleList.push(...res.data.data)
      // 设置本次数据加载完毕
      this.cateList[this.active].loading = false
      // 判断数据是否已经加载完毕
      if (res.data.data.length < this.cateList[this.active].pageSize) {
        this.cateList[this.active].finished = true
      }
    },

    // 跳转到个人中心页面
    goPersonal () {
      let token = localStorage.getItem('heimatoutiao_Authorization')
      if (token) {
        this.$router.push(`/personal/${localStorage.getItem('heimatoutiao_id')}`)
      } else {
        this.$router.push({ name: 'Login' })
      }
    }
  }
}
</script>

<style lang='less' scoped>
.index {
  .header {
    display: flex;
    height: 50/360 * 100vw;
    background-color: #f00;
    line-height: 50/360 * 100vw;
    align-items: center;
    // color:white;
    .logo {
      width: 50/360 * 100vw;
      height: 50/360 * 100vw;
      color: #fff;
      font-size: 60/360 * 100vw;
      line-height: 50/360 * 100vw;
      padding: 0 15/360 * 100vw;
    }
    .search {
      flex: 1;
      height: 36/360 * 100vw;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 18/360 * 100vw;
      color: #fff;
      text-align: center;
      display: flex;
      // justify-content: center;
      align-items: center;
      font-size: 16/360 * 100vw;
      .van-icon {
        padding: 0px 5/360 * 100vw;
      }
    }
    .icon_user {
      width: 32/360 * 100vw;
      padding: 0 10/360 * 100vw;
      color: #fff;
      font-size: 25/360 * 100vw;
    }
  }
}
</style>
