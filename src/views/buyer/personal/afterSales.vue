<template>
  <div class="m-after-sales" >
    <div class="m-no-coupon" v-if="order.length == 0">
      <span class="m-no-img m-order-no-img"></span>
      <p>暂无订单哦,<span class="m-red">去下单</span>吧~</p>
    </div>

    <div class="m-order-box" v-else @touchmove="touchMove">
      <mt-loadmore :top-method="loadTop">
        <div class="m-order-item" v-for="item in order">
          <div class="m-store-box" @click.stop="changeRoute('/brandDetail', item)">
            <img class="m-store-img" src="/static/images/icon-store.png" alt="">
            <div class="m-store-name m-ft-24">{{item.pbname}}</div>
            <img class="m-more-img" src="/static/images/icon-more.png" alt="">
          </div>
          <div class="m-product-box" @click.stop="changeRoute('/backDetail', item)" v-for="product in item.order_part">
            <div>
              <img class="m-product-img" :src="product.prmainpic" alt="">
            </div>
            <div class="m-product-text-box">
              <div class="m-product-text m-ft-24">{{product.prtitle}}</div>
              <div class="m-product-text m-ft-21">规格：
                <span v-for="(sku, index) in product.skuattritedetail">{{product.prattribute[index]}}：{{sku}} </span>
              </div>
            </div>
          </div>
          <div class="m-btn-box">
            <img class="m-after-sales-img" src="/static/images/icon-order-after-sale.png" alt="">
            <div class="m-after-sales-text m-ft-22">{{item.order_refund_apply.orastate_zh}} {{item.order_refund_apply.orastatus_zh}}</div>
            <div class="m-after-sales-btn" @click.stop="changeRoute('/backDetail', item)">查看详情</div>
          </div>
        </div>
        <bottom-line v-if="bottom_show"></bottom-line>
      </mt-loadmore>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import api from '../../../api/api'
  import bottomLine from '../../../components/common/bottomLine';
  import axios from 'axios';

  export default {
    data() {
      return {
        name: '',
        page_num: 1,
        page_size: 10,
        order: [],
        isScroll: true,
        total_count: 0,
        bottom_show: false,
      }
    },
    inject: ['reload'],
    components: { bottomLine },
    methods: {
      // 跳转页面
      changeRoute(v, item) {
        switch (v){
          case '/brandDetail':
            this.$router.push({ path: v, query: { pbid: item.pbid }});
            break;
          case '/orderDetail':
            this.$router.push({ path: v, query: { omid: item.omid, from: 'afterSales' }});
            break;
          case '/backDetail':
            this.$router.push({ path: v, query: { omid: item.omid }});
            break;
        }
      },
      // 获取订单列表
      getOrderList() {
        let params = {
          token: localStorage.getItem('token'),
          page_num: this.page_num,
          page_size: this.page_size,
          omstatus: "inrefund"
        };
        axios.get(api.order_list, { params: params }).then(res => {
          if(res.data.status == 200) {
            this.isScroll = true;
            if(res.data.data.length > 0){
              if(this.page_num > 1){
                this.order = this.order.concat(res.data.data);
              }else{
                this.order = res.data.data;
              }
              this.page_num = this.page_num + 1;
              this.total_count = res.data.total_count;
            }else{
              this.order = [];
              this.page_num = 1;
              this.total_count = 0;
              return false;
            }
          }
        })
      },
      //滚动加载更多
      touchMove(e) {
        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll) {
            this.isScroll = false;
            if(this.order.length == this.total_count) {
              this.bottom_show = true;
            }else{
              this.getOrderList();
            }
          }
        }
      },
      // 下拉刷新
      loadTop() {
        this.reload();
      }
    },
    mounted() {
      common.changeTitle('售后');
      this.getOrderList();             // 获取订单列表
    },
    activated() {
      common.changeTitle('售后');
      this.getOrderList();             // 获取订单列表
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";

  .m-after-sales {
    min-height: 100vh;
    background-color: #EEEEEE;
    .m-no-coupon{
      /*margin-top: 300px;*/
      margin-left: 50px;
    }
    .m-order-box {
      .m-order-item {
        background-color: #ffffff;
        padding: 24px 29px 33px 35px;
        margin-bottom: 20px;
        box-shadow: 0 5px 5px rgba(0,0,0,0.16);
        .m-store-box {
          display: flex;
          align-items: center;
          padding-bottom: 17px;
          border-bottom: 1px #CCCCCC solid;
          .m-store-img {
            width: 31px;
            height: 29px;
          }
          .m-store-name {
            margin: 0 25px;
          }
          .m-more-img {
            width: 22px;
            height: 22px;
          }
        }
        .m-product-box {
          padding-top: 35px;
          display: flex;
          .m-product-img {
            width: 140px;
            height: 140px;
            margin-right: 42px;
          }
          .m-product-text-box {
            text-align: left;
            .m-product-text {
              color: #666666;
              line-height: 40px;
            }
          }
        }
        .m-btn-box {
          display: flex;
          align-items: center;
          padding-top: 30px;
          .m-after-sales-img {
            width: 22px;
            height: 18px;
          }
          .m-after-sales-text {
            flex: 1;
            text-align: left;
            margin-left: 15px;
          }
          .m-after-sales-btn {
            width: 100px;
            height: 35px;
            line-height: 40px;
            padding: 5px 16px;
            margin-left: 20px;
            border: 1px #999999 solid;
            border-radius: 30px;
            color: #999999;
            font-size: 24px;
          }
        }
      }
    }
  }
</style>
