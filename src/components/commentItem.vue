<template>
      <div class="sour">
        <!-- 需要判断是否还需要递归，v-if='data.parent'就是递归结束的标识 -->
        <!-- :data='data.parent'是组件所需要的数据 -->
        <!-- @replayComment='sendComment':为了让嵌套组件也能响应当前组件所注册的事件，我们也需要父之前父使用子一样，监听子组件所发射的事件，并进行处理
        这里特别要注意的是：要将当前这一层组件所对应的数据进行传递 -->
      <mycomment
        v-if='data.parent'
        :data='data.parent'
        @replayComment='sendComment(data.parent)'
      ></mycomment>
      <!-- <comm v-if='data.parent' :data='data.parent'></comm> -->
      <p>
        <span>{{data.user.nickname}} &nbsp;&nbsp;2小时前</span>
        <span @click='sendComment(data)'>回复</span>
      </p>
      <div>{{data.content}}</div>
    </div>
</template>

<script>
export default {
  name: 'mycomment',
  props: ['data'],
  components: {

  },
  methods: {
    sendComment (data) {
    //   console.log(data)
      this.$emit('replayComment', data)
    }
  }
}
</script>

<style lang='less' scoped>
.sour {
  border: 1px solid #ddd;
  padding: 5px;
  color: #999;
  line-height: 25px;
  > p {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
  > div {
    font-size: 13px;
  }
}
</style>
