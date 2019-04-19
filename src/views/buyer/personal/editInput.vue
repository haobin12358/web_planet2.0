<template>
  <div class="m-new-personal m-editInput" >
    <div class="m-personal-content">
      <div class="m-personal-body">
        <div class="m-one-part">
          <ul class="m-edit-ul m-li-flex-start">
            <li v-if="from == 'new' || from == 'phone'|| from == 'password'">
              <span class="m-label">手机号</span>
              <div class="m-flex-between">
                <input type="text" class="m-edit-input   " placeholder="请输入手机号码" v-model="ustelphone">
                <span class="m-get-code active" v-if="!getCode" @click="getInforcode">获取验证码</span>
                <span class="m-get-code" v-if="getCode">{{ count }} 秒后重发</span>
              </div>
            </li>
            <li v-if="from == 'new' || from == 'phone' || from == 'password'">

              <span class="m-label">验证码</span>
              <div>
                <input type="text" class="m-edit-input  " placeholder="请输入验证码" v-model="identifyingcode" maxlength="6">
              </div>
            </li>
<!--            <li v-if="from == 'passwd'">-->
<!--              <div>-->
<!--                <span>新支付密码</span>-->
<!--              </div>-->
<!--              <div>-->
<!--                <input type="password" class="m-edit-input m-input-border" v-model="uspaycode">-->
<!--              </div>-->
<!--            </li>-->
<!--            <li v-if="from == 'passwd'">-->
<!--              <div>-->
<!--                <span>确认支付密码</span>-->
<!--              </div>-->
<!--              <div>-->
<!--                <input type="password" class="m-edit-input m-input-border" v-model="uspaycodeAgain">-->
<!--              </div>-->
<!--            </li>-->
          </ul>
        </div>
        <div class="m-editInput-alert" v-if="from == 'password'">
          <p class="m-ft-28">提示：</p>
          <p class="m-ft-24">支付密码用于星币等支付验证</p>
          <p class="m-ft-24">让您的资金账户更加安全</p>
        </div>
        <div class="m-editInput-alert" v-else>
          <p class="m-ft-28">提示：</p>
          <p class="m-ft-24">微信登录用户请绑定手机号后使用</p>
        </div>
      </div>
    </div>
    <div class="m-foot-btn-save">
      <span @click="saveUser">确 认</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast, MessageBox } from 'mint-ui';

  export default {
    data() {
      return {
        getCode: false,               // 是否已获取验证码
        ustelphone: '',               // 手机号码
        identifyingcode: '',          // 验证码
        uspaycode: '',                // 支付密码
        uspaycodeAgain: '',           // 确认支付密码
        timer: null,                  // 倒计时
        count: "",                    // 倒计时
        from: ''                      // 从哪个页面进入此页面的
      }
    },
    components: {},
    mounted() {

      this.from = this.$route.query.from;
      if(this.from == 'new') {
        this.$store.state.show_login = false;
        common.changeTitle('绑定账号');
        if(localStorage.getItem('ustelphone')) {
          this.ustelphone = localStorage.getItem('ustelphone');
          localStorage.removeItem('ustelphone');
        }
      }else if(this.from == 'phone' || this.from == 'password') {
        common.changeTitle('安全中心');
      }else {
        common.changeTitle('安全中心');
      }
    },
    beforeDestroy() {
      if(this.from == 'new') {
        if(localStorage.getItem('is_new')) {
          Toast('微信登录用户请绑定手机号');
          localStorage.clear();
          window.location.href = window.location.origin + '/#/selected';
          sessionStorage.setItem('new', true)
        }
      }
    },
    methods: {
      // 跳转页面
      changeRoute(v){
        this.$router.push(v);
      },
      // 获取验证码
      getInforcode() {
        if(!this.ustelphone){
          Toast("请先输入手机号码");
          return false;
        }
        // 倒计时60秒
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.getCode = true;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count --;
            } else {
              this.getCode = false;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
        axios.get(api.get_inforcode + "?ustelphone=" + this.ustelphone).then(res => {
          if(res.data.status == 200) {
            Toast(res.data.message);
          }
        });
      },
      // 保存信息
      saveUser() {
        // 更换手机号或者新人绑定手机号
        if(this.from == 'new' || this.from == 'phone' || this.form == 'password') {
          if(!this.ustelphone){
            Toast("请先输入手机号码");
            return false;
          }
          if(!this.identifyingcode){
            Toast("请先输入验证码");
            return false;
          }
        }
        // if(this.from == 'password') {
        //   if(!this.uspaycode){
        //     Toast("请先输入支付密码");
        //     return false;
        //   }
        //   if(!this.uspaycodeAgain){
        //     Toast("请再次输入支付密码");
        //     return false;
        //   }
        //   if(this.uspaycode != this.uspaycodeAgain){
        //     Toast("两次输入的支付密码不一致");
        //     return false;
        //   }
        // }
        let params = {
          ustelphone: this.ustelphone,
          identifyingcode: this.identifyingcode
        };
        if(this.from == 'new') {
          params.openid = localStorage.getItem('openid');
          params.app_from = window.location.origin.substr(8, window.location.origin.length);
          axios.post(api.bing_telphone + '?token=' + localStorage.getItem('token'), params).then(res => {
            if(res.data.status == 200){
              Toast({ message: '绑定成功', duration: 1500 });
              localStorage.setItem('token', res.data.data.token);
              localStorage.removeItem('is_new');
              if(localStorage.getItem('wx_url')){
                localStorage.setItem('url', localStorage.getItem('wx_url').split('&from')[0]);

                if(localStorage.getItem('wx_url').indexOf('fmfpid') > 0) {             // 新人首单
                  localStorage.setItem('share', 'fmfpid');
                }else if(localStorage.getItem('wx_url').indexOf('tcid') > 0) {               // 试用商品
                  localStorage.setItem('share', 'tcid');
                }else if(localStorage.getItem('wx_url').indexOf('neid') > 0) {               // 圈子详情 - 在圈子列表页点击的分享
                  localStorage.setItem('share', 'neid');
                }else if(localStorage.getItem('wx_url').indexOf('prid') > 0) {               // 商品详情
                  localStorage.setItem('share', 'prid');
                }else{
                  localStorage.setItem('ceshi','2')
                }
                localStorage.setItem('ceshi','3')
                this.$router.push('/selected');
              }else{

                this.$router.push('/personal');
              }
              // localStorage.setItem('ceshi','3')
              if(this.$store.state.show_login){
                this.$store.state.show_login = false;
                // this.$router.go(-1);
              }


            }else {
              // 避免code影响
              // window.location.href = window.location.origin + '/#/personal/editInput?from=new';
              this.identifyingcode = ''
            }
          });
        }else if(this.from == 'phone' ) {
          axios.post(api.update_user + '?token=' + localStorage.getItem('token'), params).then(res => {
            if(res.data.status == 200) {
              Toast(res.data.message);
              this.$router.go(-1);
            }
          });
        }else if(this.from == 'password'){
          axios.post(api.check_code + '?token=' + localStorage.getItem('token'), params).then(res => {
            if(res.data.status == 200) {
              // Toast(res.data.message);
              this.$router.push({path:'/personal/setPwd',query:{way:this.$route.query.way}});
            }
          });

        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";
  .m-editInput{
    font-size: 24px;
    .m-edit-input {
      display: inline-block;
      width: 290px;
      height: 42px;
      line-height: 42px;
    }
    .m-editInput-alert{
      padding: 33px 55px;
      color: #999999;
    }
    .m-get-code{
      /*margin-right: -20px;*/
      width: 110px;
      white-space: nowrap;
      display: inline-block;
      padding: 4px 15px;
      /*border-radius: 10px;*/
      background-color: #C1C1C1;
      color: #fff;
      /*box-shadow:0 3px 6px rgba(0,0,0,0.16);*/
      font-size: 24px;
      line-height: 40px;
      &.active{
        background:linear-gradient(270deg,@mainColor  0%,@subColor 100%);
      }
    }

    .m-editInput-alert{
      color: #C1C1C1;
      margin: 30px 0;
    }
    .m-foot-btn-save{
      position: fixed;
      bottom: 68px;
      left: 0;
      width: 100%;
      height: 98px;
      line-height: 98px;
      color: #fff;
      font-size: 30px;
      background:linear-gradient(304deg,@mainColor 0%,@subColor 100%);
    }
  }

</style>
