<template>
 <input
  class="inp"
  type="text"
  :placeholder="placeholder"
  :value="value"
  @input="handlerinput"
  :class="{red:statu==='error',green:statu==='success'}"
  @blur='handlerblur'
  >
 </template>

<script>
export default {
  props: [
    'placeholder',
    'value',
    'rules',
    'msg_err'
  ],
  data () {
    return {
      statu: ''
    }
  },
  methods: {
    // 处理输入
    handlerinput (event) {
      let v = event.target.value
      // 为了在使用封装组件时能够使用双向绑定，事件名称只能叫input
      this.$emit('input', v)
      if (this.rules && typeof this.rules === 'object') {
        if (this.rules.test(v)) {
          this.statu = 'success'
        } else {
          this.statu = 'error'
        }
      }
    },
    // 处理失去焦点
    handlerblur (event) {
      if (this.rules) {
        if (!this.rules.test(event.target.value)) {
          this.statu = 'error'
          this.$toast.fail(this.msg_err)
        }
      }
    }
  }
}
</script>

<style lang='less'>
.inp {
  width: 100%;
  height: 40px;
  border: none;
  border-bottom: 2px #999 solid;
  line-height: 40px;
  font-size: 18px;
  outline: none;
  padding-left: 10px;
  box-sizing: border-box;
}
.red {
  border-color: Red;
}
.green {
  border-color: green;
}
</style>
