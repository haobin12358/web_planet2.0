<template>
    <div class="m-setPwd">
      <template v-if="way == 'new'">
        <h3 class="m-setPwd-h3">设置星币支付密码</h3>
        <p v-if="!old_pwd">请输入星币支付密码，用于星币支付验证</p>
        <p v-else>请再次填写以确认</p>
      </template>
      <template v-else>
        <h3 class="m-setPwd-h3">设置新的星币支付密码</h3>
        <p v-if="!old_pwd">请输入新的星币支付密码，用于星币支付验证</p>
        <p v-else>请再次填写以确认</p>
      </template>

<!--      <div class="m-input-box">-->
<!--        <input type="password" class="m-setPwd-input">-->
<!--        <input type="password" class="m-setPwd-input">-->
<!--        <input type="password" class="m-setPwd-input">-->
<!--        <input type="password" class="m-setPwd-input">-->
<!--        <input type="password" class="m-setPwd-input">-->
<!--        <input type="password" class="m-setPwd-input">-->
<!--      </div>-->
      <input ref="pwd" type="tel" maxlength="6" v-model="msg" class="pwd" unselectable="on" />
      <ul class="m-input-box" @click="focus">
        <li :class="msg.length == 0?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 0"></i><s></s></li>
        <li :class="msg.length == 1?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 1"></i><s></s></li>
        <li :class="msg.length == 2?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 2"></i><s></s></li>
        <li :class="msg.length == 3?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 3"></i><s></s></li>
        <li :class="msg.length == 4?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 4"></i><s></s></li>
        <li :class="msg.length == 5?'psd-blink':''" class="m-setPwd-input"><i v-if="msg.length > 5"></i><s></s></li>
      </ul>
      <div class="m-setPwd-btn" v-if="msg.length <6">完成</div>
      <div class="m-setPwd-btn active" v-else @click="sureClick">完成</div>
    </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  import api from '../../../api/api'
    export default {
        name: "setPwd",
      data(){
          return{
            msg: '',
            old_pwd:'',
            new_pwd:'',
            way:''
          }
      },
      watch: {
        msg(curVal) {
          if(/[^\d]/g.test(curVal)) {
            this.msg = this.msg.replace(/[^\d]/g, '');
          }
        },
      },
      mounted(){
        this.way = this.$route.query.way;
      },
      methods: {
        focus() {
          this.$refs.pwd.focus();
        },
        sureClick(){
          if(this.old_pwd){
            this.new_pwd = this.msg;
            if(this.old_pwd == this.new_pwd){
              this.$http.post(api.set_paycode + '?token='+localStorage.getItem('token'),{
                uspaycode:this.new_pwd
              }).then(res => {
                Toast(res.data.message);
                if(res.data.status == 200){
                  this.$router.go(-2);
                }
              })

            }else{
              Toast('两次密码输入不一致，请重新输入');
              this.old_pwd = '';
              this.new_pwd = '';
              this.msg = '';
              this.$refs.pwd.focus();
            }
          }else{
            this.old_pwd = this.msg;
            this.msg = '';
            this.$refs.pwd.focus();
          }
        }
      }
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
.m-setPwd{
  min-height: 100vh;
  background-color: #fff;
  padding-top: 100px;
  box-sizing: border-box;
  color: #000;
  .m-setPwd-h3{
    font-size: 36px;
    margin-bottom: 28px;
  }
  .m-input-box{
    .flex-row(center);
    margin: 90px;
    .m-setPwd-input{
      display: block;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      border: 1px solid @mainColor;
      border-right: none;
      &:last-child{
        border-right: 1px solid @mainColor;
      }
      i {
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: #000;
        display: inline-block;
      }
    }
  }
  input[type=tel] {
    width: 0.1px;
    height: 0.1px;
    color: transparent;
    position: relative;
    top: 23px;
    background: #000000;
    left: 46px;
    border: none;
    font-size: 18px;
    opacity: 0;
    z-index: -1;
  }

    //光标
  .psd-blink {
    display: inline-block;
    /*background: url("./img/blink.gif") no-repeat center;*/
    s:after{
      content: '|';
      color: #000;
      display: inline-block;
      -webkit-animation:gogogo 0.5s infinite  ;
    }
  }


  .m-setPwd-btn{
    width: 100%;
    height: 98px;
    line-height: 98px;
    color: #fff;
    font-size: 30px;
    background:linear-gradient(304deg,rgba(39,174,96,0.5) 0%,rgba(106,206,148,0.5) 100%);
    &.active{
      background:linear-gradient(304deg,@mainColor 0%,@subColor 100%);
    }

  }
}
  @-webkit-keyframes gogogo {
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
</style>
