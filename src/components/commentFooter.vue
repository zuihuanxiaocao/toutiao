<template>
  <div class="comment">
    <div class="addcomment" v-show='!isFocus'>
      <input type="text" placeholder="写跟帖" @click='isFocus=!isFocus'/>
      <span class="comment" @click="$router.push({path:`/comments/${post.id}`})">
        <i class="iconfont iconpinglun-"></i>
        <em>{{post.comment_length}}</em>
      </span>
      <i class="iconfont iconshoucang" @click='starArticle' :class="{active:post.has_star}"></i>
      <i class="iconfont iconfenxiang"></i>
    </div>
    <div class="inputcomment" v-show='isFocus'>
        <textarea  ref='commtext' rows="5" :placeholder="placeholder"></textarea>
        <div>
            <span @click='sendComment'>发送</span>
            <span @click='cancelcomment'>取消</span>
        </div>
    </div>
  </div>
</template>

<script>
import { startThisArticle, publishComment } from '@/apis/article.js'
// import Comments from '@/views/comments.vue'
export default {
  props: ['post', 'replayobj'],
  data () {
    return {
      isFocus: false,
      placeholder: ''
    }
  },
  watch: {
    replayobj () {
      // console.log(this.replayobj)
      if (this.replayobj !== null) {
        this.isFocus = true
        this.placeholder = '@' + this.replayobj.user.nickname
        setTimeout(() => {
          this.$refs.commtext.focus()
        }, 0)
      }
    }
  },
  methods: {
    // 取消本次评论
    cancelcomment () {
      this.isFocus = false
      this.$refs.commtext.value = ''
      // 告诉父组件重置
      this.$emit('resetreplayobj')
    },
    // 发表评论
    async sendComment () {
      let data = {
        content: this.$refs.commtext.value
      }
      // 如果是单击回复，就要获取到父组件评论中的id
      if (this.replayobj) {
        data.parent_id = this.replayobj.id
      }
      let res = await publishComment(this.post.id, data)
      // console.log(res)
      if (res.data.message === '评论发布成功') {
        this.$emit('refreshComment')
        this.$refs.commtext.value = ''
        this.isFocus = false
      }
    },
    // 文章点赞
    async starArticle () {
      let res = await startThisArticle(this.post.id)
      // console.log(res)
      if (res.data.message === '收藏成功') {
        this.post.has_star = true
      } else {
        this.post.has_star = false
      }
      this.$toast.success(res.data.message)
    }
  }
}
</script>

<style lang='less' scoped>
.active {
  color:red;
}
.comment{
    width:100%;
    position: fixed;
    left: 0;bottom: 0;
}
.inputcomment{
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    background-color: #fff;
    align-items: flex-end;
    textarea{
        flex: 3;
        background-color: #eee;
        border:none;
        border-radius: 10px;
        padding: 10px;
    }
    div{
        padding: 20px;
    }
    span {
        display: block;
        flex: 1;
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        background-color: #f00;
        color:#fff;
        text-align: center;
        border-radius: 6px;
        font-size: 13px;
    }
}
.addcomment {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-top: 20px;
  display: flex;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #fff;
  > input {
    flex: 4;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    border: none;
    background-color: #eee;
    padding-left: 20px;
    font-size: 14px;
  }
  i {
    font-size: 20px;
  }
  > span {
    flex: 1;
    position: relative;
    > em {
      position: absolute;
      right: 0;
      top: -5px;
      font-size: 10px;
      background-color: #f00;
      color: #fff;
      border-radius: 5px;
      padding: 3px 5px;
    }
  }
  > i {
    flex: 1;
  }
}
</style>
