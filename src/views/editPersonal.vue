<template>
  <div class="edit">
      <myheader title="编辑个人信息">
          <span slot="left" class="iconfont iconjiantou2" @click="$router.back()"></span>
      </myheader>
      <div class="infoimg">
          <div class="userimg">
              <img :src="userobj.head_img" alt />
              <van-uploader :after-read="afterRead" :before-read="beforeRead"/>
           </div>
           <mycell title="昵称" :desc="userobj.nickname" @click='nickshow=true;nickname=userobj.nickname'></mycell>
           <van-dialog
                v-model="nickshow"
                title="修改昵称"
                show-cancel-button
                :closeOnClickOverlay='true'
                @confirm='updatenick'
                >
            <van-cell-group>
          <van-field
            label="用户名"
            required
            clearable
            v-model="nickname"
            placeholder="请输入用户名"
          />
        </van-cell-group>
      </van-dialog>
       <mycell title="密码" :desc="userobj.password" type="password" @click='passshow=true'></mycell>
        <van-dialog
        v-model="passshow"
        title="修改密码"
        show-cancel-button
        :closeOnClickOverlay='true'
        @confirm='updatepass'
        :before-close='beforeClose'
        >
        <van-cell-group>
            <van-field v-model="password" placeholder="请输入原密码" label="原密码"
          required
          clearable/>
            <van-field placeholder="请输入新密码" label="新密码" ref='userpwd'
          required/>
        </van-cell-group>
        </van-dialog>
      <mycell title="性别" :desc="userobj.gender===1?'男':'女'" @click='gendershow=true'></mycell>
      <van-dialog
        v-model="gendershow"
        title="修改性别"
        show-cancel-button
        :closeOnClickOverlay='true'
        @confirm='updategender'
      >
      <van-picker :columns="['女','男']" @change="onChange" :default-index="userobj.gender" />
      </van-dialog>
      </div>
  </div>
</template>

<script>
import mycell from '@/components/mycell.vue'
import { getUserInfoById, updateUserInfo } from '@/apis/users.js'
import myheader from '@/components/myheader.vue'
import { uploadFile } from '@/apis/upload.js'
export default {
  components: {
    myheader,
    mycell
  },
  data () {
    return {
      nickshow: false,
      passshow: false,
      gendershow: false,
      nickname: '',
      password: '',
      id: '',
      userobj: {},
      genderindex: ''
    }
  },
  methods: {
    //   picker选项变化时触发
    async onChange (picker, value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`)
      // 因为gender在数据库中存储就是0和1，类似于索引
      // 为了之后能够使用到这个索引，将索引存储到data中
      this.genderindex = index
    },
    //   修改性别
    async updategender () {
      let res = await updateUserInfo(this.id, { gender: this.genderindex })
      if (res.data.message === '修改成功') {
        this.$toast.success('修改成功')
        this.userobj.gender = this.genderindex
      }
    },
    // 关闭弹窗前触发
    // action:当前操作的类型：cancel  comfirm
    // done:关闭时所执行的操作：done():关闭 done(false):不关闭
    beforeClose (action, done) {
      // 如果密码输入不匹配，则给出提示，并中止本次请求
      // 只有单击确认的时候，才需要进行原密码是否匹配的验证
      if (action === 'confirm' && this.password !== this.userobj.password) {
        this.$toast.success('原密码输入不正确')
        done(false)
      } else {
        done()
      }
    },
    //   修改密码
    async updatepass () {
      // 1.获取用户输入的原密码
      // 2.使用原密码和当前用户数据中的密码进行匹配
      if (this.password === this.userobj.password) {
        // 3.如果匹配成功，则更新密码为用户所输入的新密码
        let pwd = this.$refs.userpwd.$refs.input.value
        let res = await updateUserInfo(this.id, { password: pwd })
        if (res.data.message === '修改成功') {
          this.$toast.success('修改成功')
          this.userobj.password = pwd
        }
      }
    },
    async updatenick () {
    // 修改昵称
    // 获取数据 ，调用api方法
      let res = await updateUserInfo(this.id, { nickname: this.nickname })
      if (res.data.message === '修改成功') {
        this.$toast.success('修改成功')
        this.userobj.nickname = this.nickname
      }
    },
    // 文件读取之前触发
    beforeRead (file) {
      if (file.type.indexOf('image/') !== 0) {
        this.$toast.fail('请选择图片')
        return false
      }
      return true
    },
    async afterRead (file) {
      var formdata = new FormData()
      formdata.append('file', file.file)
      // 发起请求
      let res = await uploadFile(formdata)
      // 如果上传成功，则修改数据，实现页面刷新
      if (res.data.message === '文件上传成功') {
        this.userobj.head_img = localStorage.getItem('heimatoutiao_baseurl') + res.data.data.url
        let res2 = await updateUserInfo(this.id, {
          head_img: res.data.data.url
        })
        if (res2.data.message === '修改成功') {
          this.$toast.success('修改成功')
        } else {
          this.$toast.fail('修改失败')
        }
      }
    }
  },
  async mounted () {
    this.id = this.$route.params.id
    let res = await getUserInfoById(this.id)
    if (res.data.message === '获取成功') {
      this.userobj = res.data.data
      this.userobj.head_img = this.userobj.head_img ? localStorage.getItem('heimatoutiao_baseurl') + this.userobj.head_img : localStorage.getItem('heimatoutiao_baseurl') + '/uploads/image/default.jpeg'
    }
  }
}
</script>

<style lang='less' scoped>
.infoimg {
  background-color: #fff;
  .userimg {
    padding: 30px 0;
    text-align: center;
    position: relative;
    > img {
      width: 70/360 * 100vw;
      height: 70/360 * 100vw;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .van-uploader {
      width: 70px;
      height: 70px;
      position: relative;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
}
</style>
