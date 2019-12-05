<template>
  <div class="comments">
     <myheader title="精彩评论">
         <span slot="left" class="iconfont iconjiantou2" @click="$router.back()"></span>
     </myheader>
     <div class="commentsList">
         <div class="item" v-for="value in articleComments" :key="value.id" >
         <div class="head">
             <img :src="value.user.head_img" alt />
             <div>
                 <p>{{value.user.nickname}}</p>
                 <span>2小时前</span>
             </div>
             <span @click='replayComment(value)' >回复</span>
         </div>
         <commentItem v-if='value.parent' :data='value.parent' @replayComment='replayComment'></commentItem>
        <div class="text">{{value.content}}</div>
        </div>
     </div>
     <commentFooter :post='article' @refreshComment="init();++article.comment_length" :replayobj='obj' @resetreplayobj='obj = null'></commentFooter>
  </div>

</template>

<script>
import { getArticleComments, getArticleById } from '@/apis/article.js'
import myheader from '@/components/myheader.vue'
import commentItem from '@/components/commentItem.vue'
import commentFooter from '@/components/commentFooter.vue'

export default {
  components: {
    myheader, commentItem, commentFooter
  },
  data () {
    return {
      id: '',
      article: {},
      articleComments: [],
      obj: {}
    }
  },
  async mounted () {
    this.id = this.$route.params.id
    this.init()
    let res2 = await getArticleById(this.id)
    this.article = res2.data.data
  },
  methods: {
    replayComment (value) {
      this.obj = value
    },
    // 数据初始化
    async init () {
      let res = await getArticleComments(this.id)
      //   console.log(res)
      this.articleComments = res.data.data
      this.articleComments.forEach(value => {
        value.user.head_img = value.user.head_img ? localStorage.getItem('heimatoutiao_baseurl') + value.user.head_img : localStorage.getItem('heimatoutiao_baseurl') + '/uploads/image/default.jpeg'
      })
      // 移动到屏幕的最顶部
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang='less' scoped>
.commentsList{
    border-top: 5px solid #ddd;
    padding: 0 15px 50px;
    box-sizing: border-box;
    .item{
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
        .head{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >img{
                width: 50/360*100vw;
                height: 50/360*100vw;
                display: block;
                border-radius: 50%;
            }
            >div{
                flex:1;
                display:flex;
                flex-direction: column;
                margin-left: 10px;
                >span{
                    font-size: 12px;
                    color:#999;
                    line-height:25px;
                }
            }
            >span{
                color:#999;
                font-size: 13px;
            }
        }
        .text{
            font-size: 14px;
            color:#999;
            padding: 20px 0 10px 0;
        }
    }
    .more{
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border:1px solid #ccc;
        border-radius: 15px;
        margin: 20px auto;
        font-size: 13px;
    }
}
</style>
