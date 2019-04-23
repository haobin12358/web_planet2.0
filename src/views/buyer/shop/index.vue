<template>
    <div class="m-shop" >
      <div class="m-shop-content" @touchmove="touchMove">
<!--        <h3 class="m-shop-title">-->
<!--          <span class="m-title">购物车</span>-->
<!--          <span class="m-ft-26" v-if="!isManage" @click="changeManage">管理</span>-->
<!--          <span class="m-ft-26" v-if="isManage" @click="changeManage">完成</span>-->
<!--        </h3>-->
<!--        <p class="m-p">共{{total_number}}件商品</p>-->


          <p class="m-no-data" v-if="cart_list.length == 0">购物车内暂无商品，<span class="m-main-color" @click="changeRoute('/newProduct')">去选购</span></p>
        <template v-for="(items, index) in cart_list" v-if="cart_list != 0">
          <div class="m-shop-one" >
            <div class="m-shop-store-name">
              <span class="m-icon-radio" :class="items.active?'active':''" @click="radioClick('store',index)"></span>
              <span>{{items.pb.pbname}}</span>
<!--              <span @click="changeRoute('brandDetail', items)">{{items.pb.pbname}}</span>-->
<!--              <span class="m-icon-more"></span>-->
            </div>
            <template v-for="(item,i) in items.cart" >
              <div class="m-shop-product" v-if="item.product.tlastatus != -10">
                <div class="m-product-info">
                  <span class="m-icon-radio m-radio-margin" :class="item.active?'active':''" @click.stop="radioClick('product',index,i)"></span>
                  <img :src="item.sku.skupic" class="m-product-img" alt="" @click="changeRoute('product',item)">
                  <div class="m-text-info">
                    <h3 @click="changeRoute('product',item)">{{item.product.prtitle}}</h3>
                    <p class="m-product-sku-select-p" @click="changeRoute('product',item)">
                      <span class="m-product-sku-select" @click.stop="skuSelect(index,i,item)">
                        <template v-for="(key,k) in item.sku.skuattritedetail" >
                          <span >{{key}}</span>
                          <span v-if="k < item.sku.skuattritedetail.length-1">；</span>
                        </template>
                        <!--<span class="m-sku-more"></span>-->
                      </span>
                    </p>
                    <div class="m-sku-num">
                      <span class="m-red" @click="changeRoute('product',item)" v-if="item.sku.tlsprice">￥{{item.sku.tlsprice | money}}</span>
                      <span class="m-red" @click="changeRoute('product',item)" v-else>￥{{item.sku.skuprice | money}}</span>
                      <div class="m-num">
                        <span class="m-icon-cut" @click.stop="changeNum(-1,index,i)">-</span>
                        <input type="number" v-model="item.canums" class="m-num-input" >
                        <span class="m-icon-add" @click.stop="changeNum(1,index,i)">+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <!--<bottom-line v-if="bottom_show"></bottom-line>-->
        <!--<sku v-if="show_sku" :now_select="select_value" :now_num="canums" :product="product_info" @changeModal="changeModal" @sureClick="sureClick"></sku>-->
      </div>
      <div class="m-shop-foot">
        <div class="m-flex-start">
          <span class="m-icon-radio" :class="allRadio?'active':''" @click="radioClick('all')"></span>
          <span class="m-grey">全选</span>
        </div>

         <div >
           <span>共计{{select_num}}件商品</span>
           <span>合计</span>
           <span >￥{{total_money | money}}</span>
           <span class="m-shop-btn" @click.stop="payOrder">结算</span>
         </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import sku from '../components/sku';
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast, MessageBox } from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';
  var scroll = (function (className) {
    var scrollTop;
    return {
      afterOpen: function () {
        scrollTop = document.scrollingElement.scrollTop || document.body.scrollTop;
        document.body.classList.add(className);
        document.body.style.top = -scrollTop + 'px';
      },
      beforeClose: function () {
        document.body.classList.remove(className);
        document.scrollingElement.scrollTop = scrollTop;
        document.body.scrollTop = scrollTop;
      }
    };
  })('scroll');
    export default {
      name: 'ShopIndex',
      data() {
        return {
          cart_list: [],
          page_info:{
            page_num:1,
            page_size:10
          },
          isScroll:true,
          total_count:0,
          total_number:0,
          bottom_show:false,
          show_sku:false,
          select_value:null,
          canums:1,
          product_info:null,
          sku_pb_index:null,
          sku_pr_index:null,
          allRadio:false,
          total_money:0,
          isManage:false,
          select_num:0
        }
      },
      components: { sku, bottomLine },
  mounted(){
        common.changeTitle('购物车');

      },
      activated() {
        this.allRadio = false;
        this.isManage = false;
        this.total_money = 0;
        this.page_info.page_num = 1;
        this.getCart();
        if(sessionStorage.getItem('shop')) {
          this.$router.push('/shop');
          sessionStorage.removeItem('shop')
        }
      },

      methods: {
        changeRoute(v, item){
          if(item) {
            if(v == "brandDetail") {
              this.$router.push({ path: '/brandDetail', query: { pbid: item.pb.pbid, pbname: item.pb.pbname }});
            }else if(v == "product") {
              if(item.cafrom == 4){
                this.$router.push({ path: '/limitedProductDetail', query: { tlpid: item.contentid }});
              }else{
                this.$router.push({ path: '/productDetail', query: { prid: item.prid }});
              }

            }
          }else {
            this.$router.push(v);
          }
        },
        // 结算
        payOrder() {
          let caid = [];
          for(let i = 0; i < this.cart_list.length; i ++) {
            for(let j = 0; j < this.cart_list[i].cart.length; j ++) {
              if(this.cart_list[i].cart[j].active) {
                if(caid[i]) {
                  caid[i].cart.push(this.cart_list[i].cart[j]);
                }else {
                  caid[caid.length] = { cart: [this.cart_list[i].cart[j]],
                    pb: this.cart_list[i].pb };
                }
              }
            }
          }
          if(caid.length > 0) {
            localStorage.setItem('product', JSON.stringify(caid));
            this.$router.push({ path: '/submitOrder', query: { from: '0' }});
            // this.$router.push({ path: '/submitOrder', query: { product: JSON.stringify(caid), from: '0' }});
          }else {
            Toast('请先选择商品');
          }
        },
        // 获取购物车信息
        getCart(){
          axios.get(api.cart_list,{
            params:{
              token:localStorage.getItem('token'),
              page_size:this.page_info.page_size,
              page_num: this.page_info.page_num
            }
          }).then(res => {
            if(res.data.status == 200){
              if(res.data.data.length >0){
                if(this.page_info.page_num >1){
                  this.cart_list = this.cart_list.concat(res.data.data);
                }else{
                  this.cart_list = res.data.data;
                }
                this.page_info.page_num = this.page_info.page_num +1;
              }else{
                this.cart_list = [];
                this.page_info.page_num = 1;
                this.total_count = 0;
                this.total_number =  0;
                return false;
              }
              let arr = [].concat(this.cart_list);
              for(let i = 0;i<arr.length;i++){
                arr[i].active = false;
                for(let j =0;j<arr[i].cart.length;j++){
                  arr[i].cart[j].active = false;
                }
              }
              this.cart_list = [].concat(arr);
              this.isScroll = true;
              this.total_count = res.data.total_count;
              this.total_number = res.data.product_num || 0;
              // 简化显示的商品名称
              for(let i = 0; i < this.cart_list.length; i ++) {
                for(let j = 0; j < this.cart_list[i].cart.length; j ++) {
                  if(this.cart_list[i].cart[j].product.prtitle) {
                    if(this.cart_list[i].cart[j].product.prtitle.length > 38) {
                      this.cart_list[i].cart[j].product.prtitle = this.cart_list[i].cart[j].product.prtitle.substring(0, 38) + "..";
                    }
                  }
                }
              }
            }
          })
        },
        //滚动加载更多
        touchMove(e){
          let scrollTop = common.getScrollTop();
          let scrollHeight = common.getScrollHeight();
          let ClientHeight = common.getClientHeight();
          if (scrollTop + ClientHeight  >= scrollHeight -10) {
            if(this.isScroll){
              this.isScroll = false;
              if(this.cart_list.length == this.total_count){
                this.bottom_show = true;
              }else{
                this.getCart();
              }
            }

          }
        },
      //  sku唤起
        skuSelect(index,i,item){
          this.sku_pb_index = index;
          this.sku_pr_index = i;
          this.select_value = item.sku;
          this.product_info = item.product;
          this.canums = item.canums;
          this.show_sku = true;
        },
        // 改变模态框
        changeModal(v,bool) {
          this[v] = bool;
          if(bool){
            scroll.afterOpen();
          }else{
            scroll.beforeClose();
          }
        },
        //购物车确定
        sureClick(item,num){
          this.show_sku = false;
          this.updateCart(item,num)
        },
      //  更新购物车
        updateCart(item,num,isNum,caid){
          axios.post(api.cart_update +'?token=' + localStorage.getItem('token'),{
            caid:caid || this.cart_list[this.sku_pb_index].cart[this.sku_pr_index].caid,
            skuid:item.skuid,
            canums:num
          }).then(res => {
            if(res.data.status == 200){
              if(isNum){

              }else{
                let _arr = [].concat(this.cart_list);
                _arr[this.sku_pb_index].cart[this.sku_pr_index].canums = num;
                _arr[this.sku_pb_index].cart[this.sku_pr_index].sku = item;
                this.cart_list = [].concat(_arr);
              }

            }
          })
        },
        /*改变合计价格*/
        dealMoney(){
          let arr = [].concat(this.cart_list);
          let _total = 0;
          for(let a =0;a<arr.length;a++){
            for(let b =0;b<arr[a].cart.length;b++){
              if(arr[a].cart[b].active ){
                if(arr[a].cart[b].sku.tlsprice){
                  _total = _total + Number(arr[a].cart[b].sku.tlsprice) * arr[a].cart[b].canums
                }else{
                  _total = _total + Number(arr[a].cart[b].sku.skuprice) * arr[a].cart[b].canums
                }

              }
            }
          }
          this.total_money = _total;
        },
        /*选择框点击*/
        radioClick(name,index,i){
          let arr = [].concat(this.cart_list);

          switch (name){
            case 'all':
              this.allRadio = !this.allRadio;
              for(let a =0;a<arr.length;a++){
                arr[a].active = this.allRadio;
                for(let b =0;b<arr[a].cart.length;b++){
                  arr[a].cart[b].active = this.allRadio;
                }
              }
              this.cart_list = [].concat(arr);
              break;
            case 'store':
              arr[index].active = !arr[index].active;
              for(let a =0;a<arr[index].cart.length;a++){
                arr[index].cart[a].active = arr[index].active;
              }
              break;
            case 'product':
              arr[index].cart[i].active = !arr[index].cart[i].active;
              let length = 0;
              for(let x = 0;x<arr[index].cart.length;x++){
                if(  arr[index].cart[i].active == arr[index].cart[x].active){
                  length = length + 1
                }
              }
              if(arr[index].cart[i].active){
                if(length == arr[index].cart.length){
                  arr[index].active = arr[index].cart[i].active;
                }
              }else{
                if(length > 0 && length <= arr[index].cart.length ){
                  this.allRadio = false;
                  arr[index].active = false;
                }
              }
              break;
          }
          if(name != 'all'){
            let store_length = 0;
            for(let y = 0;y<arr.length;y++){
              if(  arr[y].active == arr[index].active){
                store_length = store_length + 1
              }
            }
            if(store_length == arr.length){
              this.allRadio = arr[index].active ;
            }
            this.cart_list = [].concat(arr);
          }
          let num = 0;
          for(let i in this.cart_list){
            for(let j in this.cart_list[i].cart){
              if(this.cart_list[i].cart[j].active){
                num += 1;
              }
            }

          }
          this.select_num = num;
          this.dealMoney();
        },
        //数量改变
        changeNum(v, index, i) {
          if(v == -1 && this.cart_list[index].cart[i].canums ==1){
            return false;
          }
          this.cart_list[index].cart[i].canums = this.cart_list[index].cart[i].canums+ v;
          this.updateCart(this.cart_list[index].cart[i].sku,this.cart_list[index].cart[i].canums,'num',this.cart_list[index].cart[i].caid);
          this.dealMoney();
        },
        /*删除*/
        DestroyCart() {
          let caid = [];
          for(let i = 0; i < this.cart_list.length; i ++) {
            for(let j = 0; j < this.cart_list[i].cart.length; j ++) {
              if(this.cart_list[i].cart[j].active) {
                caid.push(this.cart_list[i].cart[j].caid);
              }
            }
          }
          if(caid.length > 0) {
            MessageBox.confirm('确认删除吗?').then(() => {
              axios.post(api.cart_destroy + '?token=' + localStorage.getItem('token'), { caids: caid }).then(res => {
                if(res.data.status == 200){
                  this.page_info.page_num = 1;
                  this.total_count = 1;
                  this.getCart();
                  this.allRadio = false;
                }
              });
            }).catch(() => {

            });
          }else {
            Toast("请先选择商品");
          }
        },
      }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-shop{
    width: 100%;
    min-height: 100vh;
    background-color: #ffffff;
    position: relative;
    .m-main-color{
      color: @mainColor;
      text-decoration: underline;
    }
    .m-shop-content{
      padding: 0 25px 200px 25px;
      text-align: left;
      .m-no-coupon{
        margin: 200px 80px 0 100px;
      }
      .m-shop-title{
        .flex-row(space-between);
        padding: 20px 0;
        .m-title{
          font-size: 38px;
          font-weight: bold;
        }
      }
      .m-p{
        padding: 0 0 40px;
      }
      .m-shop-one{
        background-color: #fff;
        width: 654px;
        padding: 23px;
        color: #333;
        margin-bottom: 20px;
        .m-icon-radio{
          margin-right: 35px;
        }
        .m-icon-more{
          display: inline-block;
          width: 23px;
          height: 23px;
          background: url("/static/images/icon-more.png") no-repeat;
          background-size: 100% 100%;
          margin-left: 25px;
          vertical-align: text-top;
        }
        .m-shop-store-name{
          font-weight: 400;
        }
        .m-shop-product{
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: flex-start;
          margin: 30px 0;
          .m-product-info{
            display: flex;
            flex-flow: row;
            align-items: flex-start;
            justify-content: flex-start;
            .m-product-img{
              display: block ;
              width: 153px;
              height: 153px;
              background-color: #edb3b1;
              margin-right: 30px;
            }
            .m-text-info{
              width: 410px;
              .m-sku-num{
                text-align: center;
              }
              h3{
                font-weight: 400;
              }
              .m-product-sku-select-p{
                margin: 30px 0 30px;
                .m-product-sku-select{
                  padding: 2px 20px;
                  color: @mainColor;
                  border: 1px solid @mainColor;
                  .m-sku-more{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background: url("/static/images/icon-down.png") no-repeat;
                    background-size: 100% 100%;
                    margin-left: 23px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .m-shop-foot{
      position: fixed;
      bottom: 0;
      left: 0;
      height: 98px;
      padding: 0  0 0 50px;
      width: 750px;
      box-sizing: border-box;
      background-color: #fff;
      z-index: 10;
      .flex-row(space-between);
      color: #000;
      line-height: 60px;
      .m-red{
        color: @priceColor;
        font-size: 30px;
        margin: 0 10px;
      }
      .m-shop-btn{
        display: inline-block;
        width: 210px;
        height: 98px;
        line-height: 98px;
        background:linear-gradient(90deg, @subColor 0%, @mainColor 100%);
        font-size: 30px;
        color: #ffffff;
        margin-left: 30px;
      }
      .m-icon-radio{
        margin-right: 20px;
      }
    }
    .m-icon-radio{
      display: inline-block;
      width: 34px;
      height: 34px;
      background: url("/static/images/order/icon-radio.png") no-repeat;
      background-size: 100% 100%;
      vertical-align: text-top;
      &.active{
        background: url("/static/images/order/icon-radio-active.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .m-radio-margin {
      margin-top: 65px;
    }
  }
</style>
