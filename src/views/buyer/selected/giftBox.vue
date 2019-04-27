<template>
  <div class="m-gift-box">
    <product :list="giftList" :gift="true"></product>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import api from '../../../api/api';
  import axios from 'axios';
  import product from '../components/product';
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        name: 'gift',
        giftList: []
      }
    },
    components: { product },
    methods: {
      // 获取商家礼包列表
      getProduct() {
        let params = {
          itid: 'upgrade_product',
          page_num: 1,
          page_size: 200
        };
        axios.get(api.product_list, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.giftList = res.data.data;
          }
        });
      },
      // 获取身份
      getUser() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            if(res.data.data.uslevel == "1") {            // 1 - 买家 - 去商家大礼包list页面

            }else if(res.data.data.uslevel == "2") {      // 2 - 卖家 - 去卖家版首页

            }else if(res.data.data.uslevel == "3") {      // 3 - 申请成为卖家中
              this.$router.push("/selected");
            }else if(res.data.data.uslevel == "4") {      // 4 - 已购买大礼包，但是未认证 - 去认证
              // Toast('请完成店主身份认证');
              this.$router.push("/selected");
            }
          }
        });
      }
    },
    mounted() {
      common.changeTitle('购买礼包');
      this.getProduct();            // 获取商家礼包列表
      this.getUser();               // 获取身份
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-gift-box {
    min-height: 100vh;
    background-color: #fff;
  }
</style>
