<template>
  <div class="m-personal m-safeCenter" >
    <div class="m-personal-bg">
      <span class="m-icon-bg"></span>
    </div>
    <div class="m-personal-content m-setUp">
      <div class="m-personal-info">
        <img class="m-personal-head-portrait" :src="user.usheader">
        <div class="m-personal-info-box">
          <div class="m-personal-info-text">
            <div>
              <p>{{user.usname}}</p>
              <p>
                <span class="m-personal-identity animated rubberBand" v-if="user.usidname == '登录 / 注册'" @click="changeRoute('/login')">{{user.usidname}}</span>
                <span class="m-personal-identity active" v-else>{{user.usidname}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="m-personal-body">
        <div class="m-one-part">
          <ul class="m-edit-ul">
            <li>
              <div>
                <span>真实姓名</span>
              </div>
              <div class="m-grey">{{user.usrealname}}</div>
            </li>
            <li @click="changeRoute('/storekeeper/IDCardApprove')">
              <div>
                <span>身份认证</span>
              </div>
              <div>
                <span class="m-grey" v-if="!user.usidentification">未认证</span>
                <span class="m-grey" v-if="user.usidentification">{{user.usidentification}}</span>
                <span class="m-icon-more"></span>
              </div>
            </li>
            <li @click="changeRoute('/personal/editInput', 'phone')">
              <div>
                <span>手机号</span>
              </div>
              <div>
                <span class="m-grey">{{user.ustelphone}}</span>
                <span class="m-icon-more"></span>
              </div>
            </li>
            <!--<li @click="changeRoute('/personal/editInput', 'passwd')">
              <div>
                <span>支付密码</span>
              </div>
              <div>
               <span class="m-grey">去修改</span>
                <span class="m-icon-more"></span>
              </div>
            </li>-->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        user: { usheader: '/static/images/logo.jpg', usidname: '登录 / 注册'},               // 个人信息
      }
    },
    components: {},
    methods: {
      // 跳转页面
      changeRoute(v, where) {
        if(where) {
          this.$router.push({ path: v, query: { from: where }});
        }else {
          this.$router.push(v);
        }
      },
      // 获取个人信息
      getUser() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.user = res.data.data;
          }
        });
      }
    },
    mounted() {
      common.changeTitle('安全中心');
      this.getUser();       // 获取个人信息
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";
  .m-safeCenter{
    .m-edit-input{
      display: inline-block;
      width: 380px;
      height: 40px;
      line-height: 40px;
      font-size: 30px;
    }
  }
</style>
