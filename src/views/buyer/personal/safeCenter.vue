<template>
  <div class="m-safeCenter" >
    <div class="m-safeCenter-content">
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
          <div class="m-flex-end">
            <span class="m-grey" v-if="!user.usidentification">未认证</span>
            <span class="m-grey" v-if="user.usidentification">{{user.usidentification}}</span>
            <span class="m-icon-more"></span>
          </div>
        </li>
        <li @click="changeRoute('/personal/editInput', 'phone')">
          <div>
            <span>手机号</span>
          </div>
          <div class="m-flex-end">
            <span class="m-grey" v-if="!user.ustelphone">去绑定</span>
            <span class="m-grey" v-if="user.ustelphone">{{user.ustelphone}}</span>
            <span class="m-icon-more"></span>
          </div>
        </li>
        <li @click="changeRoute('/personal/editInput','password',user.uspaycode)">
          <div>
            <span>支付密码</span>
          </div>
          <div class="m-flex-end">
            <span class="m-grey" v-if="user.uspaycode">更换密码</span>
            <span class="m-grey" v-else>设置密码</span>
            <span class="m-icon-more"></span>
          </div>
        </li>
      </ul>
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
      changeRoute(v, where,code) {
        let _way = '';
        if(code){
          _way = 'change'
        }else{
          _way = 'new';
        }
        if(where) {
          this.$router.push({ path: v, query: { from: where ,way:_way}});
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
@import "../../../common/css/index";
  .m-safeCenter{
    .m-safeCenter-content{
      .m-edit-ul{
        li{
          padding: 30px 24px 30px 40px;
          border-bottom: 1px solid #F2F2F2;
          .flex-row(space-between);
          color: #333;
          .m-icon-more{
            display: inline-block;
            width: 17px;
            height: 30px;
            background: url("/static/images/newpersonal/icon-more.png") no-repeat;
            background-size: 100% 100%;
            margin-left: 20px;
          }
        }
      }
    }
  }
</style>
