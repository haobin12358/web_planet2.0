<template>
  <div class="m-integral">
    <div class="m-integral-top">
      <p class="m-integral-top-p">可用星币</p>
      <div class="m-integral-code">
        <span class="m-integral-top-img"></span>
        <span>{{usintegral}}</span>
      </div>
    </div>
    <div class="m-integral-content">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
     <ul class="m-integral-detail-ul">
       <li v-if="uilist.length > 0" v-for="item in uilist">
         <p class="m-integral-detail-p">
           <span>{{item.uiaction}}</span>
           <span>+ {{item.uiintegral}}</span>
         </p>
         <p class="m-grey">{{item.createtime}}</p>
       </li>
       <li v-if="uilist.length == 0">
         <p style="text-align: center">暂无可用星币</p>
       </li>
     </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import navList from '../../../components/common/navlist';
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        nav_list:[
          { name:'全部', params:'all', active:true }, { name:'收入', params:'income', active:false }, { name:'支出', params:'expenditure', active:false }
        ],
        usintegral: "",             // 可用总星币数
        uilist: [],                 // 星币来源list
      }
    },
    components: { navList },
    methods: {
      // navList的点击事件
      navClick(index){
        let arr = [].concat(this.nav_list);
        for(let i = 0; i < arr.length; i ++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.getUserIntegral(arr[index].params);               // 获取星币列表
        this.nav_list = [].concat(arr);
      },
      // 获取星币列表
      getUserIntegral(uifilter) {
        let params = {
          token: localStorage.getItem('token'),
          uifilter: uifilter
        };
        axios.get(api.get_user_integral, { params: params }).then(res => {
          if(res.data.status == 200){
            this.usintegral = res.data.data.usintegral;
            this.uilist = res.data.data.uilist;
          }
        })
      },
    },
    mounted() {
      common.changeTitle('可用星币');
      this.getUserIntegral("all");               // 获取星币列表
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
.m-integral{
  .m-integral-top{
    width: 100%;
    height: 300px;
    background: url("/static/images/icon-integral-bg.png");
    background-size: 100% 100%;
    text-align: left;
    .m-integral-top-p{
      padding: 80px 0 24px 63px;
    }
    .m-integral-top-img{
      display: inline-block;
      width: 71px;
      height: 71px;
      background: url("/static/images/icon-integral.png");
      background-size: 100% 100%;
      margin: 0 40px 0 63px;
      vertical-align: middle;
      color: #333;
    }
    .m-integral-code{
      height: 91px;
      line-height: 91px;
      font-size: 46px;
      font-weight: bold;
    }
  }
  .m-integral-content{
    /*padding: 30px 80px 0;*/
    .m-integral-detail-ul{
      padding: 30px 80px 0;
      li{
        padding: 25px 0;
        text-align: left;
        border-bottom: 1px solid #CCCCCC;
        .m-integral-detail-p{
          .flex-row(space-between);
          padding: 10px 0;
        }
      }
    }
  }
}

</style>
