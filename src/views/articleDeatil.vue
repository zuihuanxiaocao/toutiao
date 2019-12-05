<template>
 <div class="articleDeatil">
  <myheader>
      <div slot="left" @click='$router.back()' class="lefth">
        <van-icon name="arrow-left" />
        <span class="iconfont iconnew"></span>
      </div>
      <div slot="right">
        <div class="arbtn" @click='userFollow' :class="{active:isActive}">{{focuText}}</div>
      </div>
    </myheader>
    <div class="content">
        <div class="title">{{article.title || ''}}</div>
        <div class="infoad">
            <span>{{article.user && article.user.nickname}}</span>
            <span>2019-11-23</span>
        </div>
        <div class="articleContent" v-html='article.content' v-if='article.type === 1'></div>
        <div class="video" v-if='article.type === 2'>
          <!-- src:当前视频资源的路径
              controls:显示控制面板,默认不会显示
              width:宽度
              height: 高度
              autoplay:自动播放
              loop:循环播放
              poster:设置封面，设置视频第一帧的画面，它应该设置为一张图片 -->
    <!-- <video :src="article.content" controls autoplay loop :poster="article.cover[0].url"></video> -->
    <video :src="article.content" controls :poster="article.cover[0].url"></video>
        </div>
        <div class="opt">
            <van-button icon="good-job-o" type="primary" plain @click='likethisarticle' :class="{likeactive:article.has_like}">{{article.like_length}}</van-button>
            <van-button icon="chat" type="primary" plain >微信</van-button>
        </div>
    </div>
    <div class="commentList">
      <h2>精彩跟帖</h2>
      <div class="item">
        <div class="head">
          <img src="" alt />
          <div>
            <p>火星网友</p>
            <span>2小时前</span>
          </div>
          <span>回复</span>
        </div>
        <div class="text">文章说得很有道理</div>
      </div>
      <div class="more">更多跟帖</div>
    </div>
    <commentFooter :post='article'></commentFooter>
    </div>
</template>

<script>
import myheader from '@/components/myheader.vue'
import commentFooter from '@/components/commentFooter.vue'
import { focusUser, unfocusUser } from '@/apis/users.js'
import { getArticleById, likeArticle } from '@/apis/article.js'
export default {
  data () {
    return {
      article: {

      },
      isActive: '',
      focuText: ''
    }
  },
  components: {
    myheader, commentFooter
  },
  async mounted () {
    let id = this.$route.params.id
    let res = await getArticleById(id)
    // console.log(res)
    this.article = res.data.data
    this.isActive = this.article.has_follow
    this.focuText = this.isActive ? '已关注' : '关注'
  },
  methods: {
    // 文章点赞
    async likethisarticle () {
      let res = await likeArticle(this.article.id)
      console.log(res)
      if (res.data.message === '点赞成功') {
        ++this.article.like_length
        this.article.has_like = true
      } else {
        --this.article.like_length
        this.article.has_like = false
      }
    },
    async userFollow () {
      let res
      // 判断当前是关注还是取消关注
      if (this.isActive) {
        res = await unfocusUser(this.article.user.id)
        if (res.data.message === '取消关注成功') {
          this.isActive = false
          this.focuText = '关注'
        }
      } else {
        res = await focusUser(this.article.user.id)
        if (res.data.message === '已关注' || res.data.message === '关注成功') {
          this.isActive = true
          this.focuText = '已关注'
        }
      }
      this.$toast.success(res.data.message)
    }
  }
}
</script>

<style lang='less' scoped>
.likeactive{
  color:red!important;
  border-color:red!important;
}
.header {
    line-height: 40px;
    /deep/.left{
      vertical-align: middle;
    }
    .lefth{
        display: flex;
        align-items: center;
    }
  // /deep/：可以在父组件中修改子组件的样式：让父组件中的样式影响子组件
  /deep/.leftspan {
    width: 100px !important;
  }
  .iconnew {
    font-size: 50px;
  }
  .arbtn{
      width: 60px;
      height: 24px;
      border-radius: 12px;
      border:1px solid #ccc;
      line-height: 24px;
      text-align: center;
      font-size: 13px;
      &.active {
        background-color: #f00;
        color: #fff;
      }
  }
}
.content{
    padding: 10px;
    .title{
        font-size: 18px;
        font-weight: 700;
        line-height: 24px;
    }
    .infoad{
        font-size: 12px;
        color:#999;
        > span:nth-child(2){
            margin-left: 15px;
        }
    }
    .articleContent{
        padding: 20px 0;
        font-size: 14px;
        color: #333;
        line-height: 26px;
        text-indent: 2em;
        /deep/img {
            width: 100%;
            display: block;
        }
    }
    .video{
      width: 100%;
      > video{
        width: 100%;
      }
    }
    .opt{
        display: flex;
        justify-content: space-around;
    }
}
.commentList {
    border-top: 5px solid #ddd;
    padding: 0 15px 50px;
    box-sizing: border-box;
    > h2 {
      line-height: 50px;
      text-align: center;
    }
    .item {
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > img {
          width: 50/360 * 100vw;
          height: 50/360 * 100vw;
          display: block;
          border-radius: 50%;
        }
        > div {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          > span {
            font-size: 12px;
            color: #999;
            line-height: 25px;
          }
        }
        > span {
          color: #999;
          font-size: 13px;
        }
      }
      .text {
        font-size: 14px;
        color: #333;
        padding: 20px 0 10px 0;
      }
    }
    .more {
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 15px;
      margin: 20px auto;
      font-size: 13px;
    }
  }
</style>
