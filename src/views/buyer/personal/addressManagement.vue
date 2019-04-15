<template>
  <div class="m-personal " >
    <div class="m-personal-bg">
      <span class="m-icon-bg"></span>
    </div>

    <div class="m-personal-content m-setUp m-address">
      <div class="m-no-coupon" v-if="addressList.length == 0">
        <span class="m-no-img m-address-no-img"></span>
        <p>暂无地址哦,<span class="m-red" @click="changeRoute('/personal/addAddress')">去新增地址</span>吧~</p>
      </div>
      <!--<p class="m-set-box">
        <span class="m-right">管理</span>
      </p>-->

      <div class="m-personal-body" v-if="addressList.length > 0">
        <div class="m-one-part m-address-part">
          <ul class="m-edit-ul m-address-edit-ul">
           <li v-for="(item, index) in addressList" @click="chooseAddress(item)">
             <div class="m-left">
               <div class="m-address-name">
                 <div>
                   <span class="m-border"></span>
                   <span>收货人：{{item.uaname}}</span>
                 </div>
                 <span>{{item.uaphone}}</span>
               </div>
               <p class="m-address-p">{{item.addressinfo}}</p>
             </div>
             <div class="m-address-edit-box">
               <div @click.stop="defaultAddress(item, index)">
                 <span class="m-icon-radio" :class="item.uadefault == '1' ? 'active' : ''"></span>
                 <span>默认地址</span>
               </div>
               <div>
                 <span class="m-mr-40 m-ft-22" @click.stop="changeRoute('/personal/addAddress', item)">编辑</span>
                 <span class="m-ft-22" @click.stop="deleteAddress(item, index)">删除</span>
               </div>
             </div>
           </li>
          </ul>
        </div>
        <div class="m-address-btn" @click="changeRoute('/personal/addAddress')">
          <span>新增地址</span>
        </div>
      </div>
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
        name: '',
        addressList: [],
        from: "",                 // 是否是从下单页进来
        uaid: ""
      }
    },
    components: {},
    methods: {
      // 跳转页面
      changeRoute(v, item){
        if(item) {
          this.$router.push({ path: v, query: { uaid: item.uaid }})
        }else {
          this.$router.push(v);
        }
      },
      // 选择该地址
      chooseAddress(item) {
        if(this.from) {
          this.$router.go(-1);
          localStorage.setItem("uaid", item.uaid);
        }
      },
      // 默认地址的设置
      defaultAddress(item, index) {
        let params = { uaid: item.uaid };
        if(item.uadefault == "0") {
          params.uadefault = "1";
        }else if(item.uadefault == "1") {
          params.uadefault = "0";
        }
        axios.post(api.update_address + '?token=' + localStorage.getItem('token'), params).then(res => {
          if(res.data.status == 200){
            Toast("设置成功");
            for(let i = 0; i< this.addressList.length; i ++) {
              this.addressList[i].uadefault = "0";
            }
            this.addressList[index].uadefault = params.uadefault;
          }
        });
      },
      // 删除地址
      deleteAddress(item, index) {
        MessageBox.confirm('是否删除该收货地址?').
        then(() => {
          let params = { uaid: item.uaid, uaisdelete: "1" };
          axios.post(api.update_address + '?token=' + localStorage.getItem('token'), params).then(res => {
            if(res.data.status == 200){
              Toast("删除成功");
              this.addressList.splice(index, 1);
            }
          });
        }).catch(() => {

        });
      },
      // 获取用户所有地址
      getAllAddress() {
        let params = { token: localStorage.getItem('token'), page_num: 1, page_size: 30 };
        axios.get(api.get_all_address, { params: params }).then(res => {
          if(res.data.status == 200){
            this.addressList = res.data.data;
          }
        })
      }
    },
    mounted() {
      common.changeTitle('地址管理');
      this.getAllAddress();         // 获取用户所有地址

      this.from = this.$route.query.from;
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";
  .m-personal {
    background-color: #EEEEEE;
    min-height: 100vh;
  }
  .m-address{
    /*padding-bottom: 350px;*/
    .m-no-coupon{
      margin-top: 350px;
      margin-left: 105px;
    }
  }
  .m-address-btn{
    text-align: center;
    margin-top: 153px;
    span{
      color: #ffffff;
      display: inline-block;
      width: 700px;
      height: 106px;
      line-height: 106px;
      background-color: @mainColor;
      font-size: 38px;
      font-weight: bold;
      border-radius: 10px;
      box-shadow:0 5px 6px rgba(0,0,0,0.16);
    }
  }
</style>
