<template>
  <div class="m-my-message" >
    <div class="m-shop-content" @touchmove="touchMove">
<!--      <p class="m-no-data" v-if="message_list.length == 0">暂无消息</p>-->
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
      <template v-if="nav_list[0].active" >
        <div class="m-supplier-item"  >
          <img src="/static/images/logo.jpg" class="m-avator-img" alt="">
          <h3>供应商沟通</h3>
        </div>
        <div class="m-shop-product" data-type="0">
          <div class="m-product-info"    @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="skip">
            <img src="/static/images/logo.jpg" class="m-avator-img" alt="">
            <div class="m-text-info"  @click="changeRoute('/personal/messageDetail')">
              <h3 class="m-flex-between">
                <span class="m-user-name">123123</span>
                <span class="m-grey">4-01</span>
              </h3>
              <p class="m-grey">q2e</p>
            </div>

          </div>
          <span class="m-delete" @click.stop="DestroyCart(item)">删除</span>
        </div>
      </template>
      <div class="m-in-message" v-if="nav_list[1].active" >
        <div class="m-one-message" v-for="(item,index) in  message_list">
          <div class="m-flex-between">
            <div class="m-flex-between">
              <img src="/static/images/logo.jpg" v-if="item.pmhead == ''" class="m-avator-img" alt="">
              <img :src="item.pmhead " v-else class="m-avator-img" alt="">
              <span>{{item.pmname}} </span>
            </div>
            <span class="m-grey">{{item.createtime}}</span>
          </div>
          <div class="m-one-message-content" v-html="item.pmtext">

          </div>
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
  import bottomLine from '../../../components/common/bottomLine';
  import navList from '../../../components/common/navlist';
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
        message_list: [],
        page_info:{
          page_num:1,
          page_size:10
        },
        isScroll:true,
        total_count:0,
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
        select_num:0,
        startX : 0 ,
        endX : 0 ,
        nav_list:[
          {
            name:'私信',
            value:'',
            active:true,
            count:0
          },
          {
            name:'站内信',
            value:'',
            active:false,
            count:0
          }
        ],
      }
    },
    components: { navList, bottomLine },
    mounted(){
      common.changeTitle('消息');


    },
    created(){
      this.setSession();


    },
    sockets: {
      message_list(data){
        if(data){
          this.nav_list[1].count = 1;
          this.nav_list = [].concat(this.nav_list);
        }
        console.log(data,'message')
      }
    },
    methods: {
      setSession(){
        this.$socket.emit('setsession', localStorage.getItem('token'),function (res) {
          //如果连接失败，重新连接
          if(res.status != 200){
            this.setSession();
          }
          // else{
          // this.$socket.emit('get_message');
          // }
        });
      },
      changeRoute(v, item){
        this.$socket.emit('get_message');
          // this.$router.push(v);
      },
      // 获取站内信信息
      getAppMessage(){
        axios.get(api.message_get,{
          params:{
            token:localStorage.getItem('token'),
            page_size:this.page_info.page_size,
            page_num: this.page_info.page_num
          }
        }).then(res => {
          if(res.data.status == 200){
            this.nav_list[1].count = 0;
            this.nav_list = [].concat(this.nav_list);
            if(res.data.data.length >0){
              if(this.page_info.page_num >1){
                this.message_list = this.message_list.concat(res.data.data);
              }else{
                this.message_list = res.data.data;
              }
              this.page_info.page_num = this.page_info.page_num +1;
            }else{
              this.message_list = [];
              this.page_info.page_num = 1;
              this.total_count = 0;
              return false;
            }
            // let arr = [].concat(this.message_list);
            // for(let i = 0;i<arr.length;i++){
            //   arr[i].active = false;
            //   for(let j =0;j<arr[i].cart.length;j++){
            //     arr[i].cart[j].active = false;
            //   }
            // }
            // this.message_list = [].concat(arr);
            this.isScroll = true;
            this.total_count = res.data.total_count;
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
            if(this.message_list.length == this.total_count){
              this.bottom_show = true;
            }else{
              this.getAppMessage();
            }
          }

        }
      },

      /*删除*/
      DestroyCart(item) {
        let caid = [];
        // for(let i = 0; i < this.cart_list.length; i ++) {
        //   for(let j = 0; j < this.cart_list[i].cart.length; j ++) {
        //     if(this.cart_list[i].cart[j].active) {
        //       caid.push(this.cart_list[i].cart[j].caid);
        //     }
        //   }
        // }
        caid.push(item.caid);
        if(caid.length > 0) {
          MessageBox.confirm('确认删除吗?').then(() => {
            axios.post(api.cart_destroy + '?token=' + localStorage.getItem('token'), { caids: caid }).then(res => {
              if(res.data.status == 200){
                this.page_info.page_num = 1;
                this.total_count = 1;
                this.getAppMessage();
                this.allRadio = false;
              }
            });
          }).catch(() => {

          });
        }else {
          Toast("请先选择商品");
        }
      },
      //点击以后重置滑动事件相关
      skip(){
        if( this.checkSlide() ){
          this.restSlide();
        }
      },
      //滑动开始
      touchStart(e){
        // 记录初始位置
        this.startX = e.touches[0].clientX;
      },
      //滑动结束
      touchEnd(e){
        // 当前滑动的父级元素
        let parentElement = e.currentTarget.parentElement;
        // 记录结束位置
        this.endX = e.changedTouches[0].clientX;
        // 左滑
        if( parentElement.dataset.type == 0 && this.startX - this.endX > 30 ){
          this.restSlide();
          parentElement.dataset.type = 1;
        }
        // 右滑
        if( parentElement.dataset.type == 1 && this.startX - this.endX < -30 ){
          this.restSlide();
          parentElement.dataset.type = 0;
        }
        this.startX = 0;
        this.endX = 0;
      },
      //判断当前是否有滑块处于滑动状态
      checkSlide(){
        let listItems = document.querySelectorAll('.m-shop-product');
        for( let i = 0 ; i < listItems.length ; i++){
          if( listItems[i].dataset.type == 1 ) {
            return true;
          }
        }
        return false;
      },
      //复位滑动状态
      restSlide(){
        let listItems = document.querySelectorAll('.m-shop-product');
        // 复位
        for( let i = 0 ; i < listItems.length ; i++){
          listItems[i].dataset.type = 0;
        }
      },
      // 导航点击
      navClick(index) {
        this.page_info.page_num = 1;
        this.total_count = 0;
        this.bottom_show = false;
        let arr = [].concat(this.nav_list);
        if(arr[index].active && arr[index].count == 0) {
          return false;
        }
        for(let i = 0; i < arr.length; i ++) {
          arr[i].active = false;
        }
        arr[index].active = true;
        this.nav_list = [].concat(arr);
        this.page_info.page_num = 1;
        if(index == 1){
          this.getAppMessage();
        }
      },
    }
  }
</script>
<style lang="less" rel="stylesheet/less" >
  @import "../../../common/css/index";

  .m-my-message{
    width: 100%;
    min-height: 100vh;
    background-color: #ffffff;
    overflow-x: hidden;
    position: relative;
    .m-shop-content{
      padding: 0 0 200px 0;
      text-align: left;
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
      .m-avator-img{
        display: block ;
        width: 80px;
        height: 80px;
        background-color: #edb3b1;
        margin-right: 30px;
      }
      .m-supplier-item{
        display: flex;
        flex-flow: row;
        align-items: flex-start;
        justify-content: flex-start;
        width: 750px;
        box-sizing: border-box;
        margin-top: 20px;
        padding: 20px 30px;
        background-color: #fff;
        border-bottom: 10px solid #F4F4F4;
        h3{
          font-size: 28px;
          font-weight: 400;
        }
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
        position: relative;
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
        .m-delete{
          width: 144px;
          height: 121px;
          line-height: 121px;
          background: #D83A3A;
          font-size: 28px;
          color: #fff;
          text-align: center;
          position: absolute;
          top:0;
          right: -147px;
        }
        .m-product-info{
          display: flex;
          flex-flow: row;
          align-items: flex-start;
          justify-content: flex-start;
          width: 750px;
          box-sizing: border-box;
          padding: 20px 30px;
          background-color: #fff;
          border-bottom: 1px solid #F2F2F2;
          .m-text-info{
            width: 570px;

          }
        }
        &.m-shop-product[data-type="0"]{
          transform: translate3d(0,0,0);
        }
        &.m-shop-product[data-type="1"]{
          transform: translate3d(-147px,0,0);
        }
      }
      .m-in-message{
        margin-top: 30px;
        .m-one-message{
          background-color: #fff;
          padding: 20px 30px;
          border-bottom: 1px solid #F2F2F2;
          font-size: 28px;
          color: #000000;
          .m-one-message-content{
            padding: 30px 0;
            color: #666666;
            img{
              display: block;
              width: 680px;
              height: 400px;
            }
          }
        }
      }
    }

  }
</style>
