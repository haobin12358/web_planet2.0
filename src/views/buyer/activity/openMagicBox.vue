<template>
  <div class="w-openmb">
    <!-- <div class="w-openmb-bg"></div> -->
    <img src="/static/images/newActivity/icon-magic-text.png" class="m-magic-title-img" alt="">
    <div class="w-openmb-headbtn">
      <span class="w-openmb-headbtn-left" @click="changeRoute('/activity')">参加</span>
      <span class="w-openmb-headbtn-right" @click="changeModal('show_rule',true)">规则</span>
    </div>

    <div class="w-openmb-product">
      <div class="w-openmb-product-img">
        <img :src="product_info.prmainpic" />
        <span class="w-openmb-product-orprice">原价¥{{product_info.prprice || 0}}</span>
      </div>
      <div class="w-openmb-price">
        <span class="w-openmb-price-lowest">最低价¥{{product_info.mbadeposit || 0}}</span>
        <span class="w-openmb-price-current">当前价¥ <b class="m-ft-36">{{product_info.currentprice || 0}}</b></span>
        <span class="w-openmb-price-bought">可购价¥{{product_info.purchaseprice || 0}}</span>
      </div>
      <div class="w-openmb-choice">
        <span class="w-openmb-choice-a" :class="select == '1'?'off':''" @click="selectOne('1')"></span>
        <span class="w-openmb-choice-b" :class="select == '2'?'off':''" @click="selectOne('2')"></span>
        <span class="w-openmb-choice-c" :class="select == '3'?'off':''" @click="selectOne('3')"></span>
      </div>
      <div class="w-openmb-tips">
        <span>点击任意一个帮好友拆盒</span>
      </div>
      <div class="m-rule">
        <p v-if="product_info.gearone_str">{{product_info.gearone_str}}</p>
        <p v-if="product_info.geartwo_str">{{product_info.geartwo_str}}</p>
        <p v-if="product_info.gearthree_str">{{product_info.gearthree_str}}</p>
      </div>
    </div>

    <div class="m-record-box">
      <img src="/static/images/newActivity/icon-magic-label.png" class="m-magic-label" alt="">
      <h3 class="m-cai-title">拆盒记录</h3>
      <ul>
        <li v-for="(item,index) in product_info.records">
          <span class="m-sort">{{index +1}}</span>
          <img :src="item.usheader" class="m-head" alt="">
          <span>{{item.record_str}}</span>
        </li>
      </ul>
    </div>
    <div class="w-openmb-popup" v-if="popupVisible" @click.self="changeModal('popupVisible',false)">
      <div class="w-openmb-popup-box">
        <span class="w-openmb-popup-text">您为您的好友<span v-if="action == 0">减少</span><span v-else-if="action == 10">增加</span>了<span class="w-openmb-popup-num">{{final_reduce}}元</span>购买金额！</span>
        <span class="w-openmb-popup-btn" @click.self="changeModal('popupVisible',false)">知道了</span>
      </div>
    </div>
    <!-- <mt-popup v-model="popupVisible"></mt-popup> -->
    <div class="m-modal-img" v-if="show_rule" @click.self="changeModal('show_rule',false)">
      <div class="m-modal-state">
        <span class="m-close" @click="changeModal('show_rule',false)"> X</span>
        <div class="m-group-rule">
          {{product_info.rules}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Popup
  } from 'mint-ui';
  let scroll = (function (className) {
    let scrollTop;
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
    data() {
      return {
        popupVisible: false,
        product_info:'',
        select:null,
        final_reduce:null,
        show_rule:false,
        action:0
      }
    },
    mounted(){
      localStorage.removeItem('share');
      localStorage.removeItem('url');
      localStorage.removeItem('login_to');
      this.getDetail();
    },
    methods:{
      getDetail(){
        this.$http.get(this.$api.magicbox_get,{
          params:{
            token: localStorage.getItem('token'),
            mbjid: this.$route.query.mbjid
          }
        }).then(res => {
          if(res.data.status == 200){
            this.product_info = res.data.data;
          }
        })
      },
      changeRoute(v){
       this.$router.push({path:v,query:{actype:2}});
      },
      // 改变模态框 - 商品sku
      changeModal(v,bool) {
        this[v] = bool;
        if(bool){
          scroll.afterOpen();
        }else{
          scroll.beforeClose();
        }
      },
      selectOne(value){
        this.$http.post(this.$api.open_magicbox + '?token='+localStorage.getItem('token'),{
            mbjid: this.$route.query.mbjid,
           level:value
        }).then(res => {
          if(res.data.status == 200){
            this.select = value;
            // this.product_info.currentprice = res.data.data.final_price;
            this.final_reduce = res.data.data.final_reduce;
            this.action = res.data.data.action;
            this.getDetail();
            this.changeModal('popupVisible',true);
          }
        })
      }
    }

  }

</script>

<style lang="less" scoped>
  @import "../../../common/css/index";

  .w-openmb {
    width: 100%;
    min-height: 100vh;

    //   position: fixed;
    //   width: 100%;
    //   height: 100%;
    //   left: 0;
    //   top: 0;
    padding-bottom: 30px;
    background: url('/static/images/newActivity/icon-magic-bc.png') no-repeat;
    /*background-size: 100% 100%;*/
    //   z-index: -1;
    .m-magic-title-img{
      position: absolute;
      top:20px;
      left: 132px;
      width: 477px;
      height: 200px;
    }

    .w-openmb-headbtn {
      width: 100%;
      padding-top: 30px;
      background-color: rgba(0, 0, 0, 0);
      .flex-row(space-between);

      .w-openmb-headbtn-left {
        display: inline-block;
        color: #fff;
        font-size: 28px;
        width: 56px;
        height: 40px;
        padding: 9px 25px;
        border: 5px solid #fff;
        border-radius: 0 30px 30px 0;
        border-left: none;

      }

      .w-openmb-headbtn-right {
        display: inline-block;
        color: #fff;
        font-size: 28px;
        width: 56px;
        height: 40px;
        padding: 9px 25px;
        border: 5px solid #fff;
        border-radius: 30px 0 0 30px;
        border-right: none;
      }
    }

    .w-openmb-product {
      width: 644px;
      /*height: 844px;*/
      padding: 20px;
      box-sizing: border-box;
      margin: 130px 54px 60px;
      background-color: #fff;
      position: relative;
      border-radius: 20px;

      .w-openmb-product-img {
        position: relative;
        width: 600px;
        height: 600px;
        img{
          display: inline-block;
          width: 600px;
          height: 600px;
        }
        .w-openmb-product-orprice {
          display: inline-block;
          position: absolute;
          bottom: 0;
          right: 0;
          width: 181px;
          height: 40px;
          color: @mainColor;
          background: #fff;
          font-size: 28px;
          border-radius: 40px 0 0 0;
          box-shadow:-6px -6px 6px rgba(0,0,0,0.16);
        }
      }

      .w-openmb-price {
        height: 100px;
        .flex-row(space-between);
        border-bottom: 1px solid #F2F2F2;

        span {
          display: inline-block;
          width: 162px;
          height: 40px;
          font-size: 28px;
          line-height: 40px
        }

        .w-openmb-price-lowest {}

        .w-openmb-price-current {
          background: linear-gradient(90deg, @subColor 0%, @mainColor 100%);
          border-radius: 20px;
          color: #fff;
        }

        .w-openmb-price-bought {}
      }

      .w-openmb-choice {
        padding: 18px 50px 0;
        .flex-row(space-between);
        // span {
        //   display: inline-block;
        //   width: 100px;
        //   height: 100px;
        //   background: green;
        //   position: relative;
        //   font-color: #fff;
        // }

        // span:before {
        //   display: inline-block;
        //   content: "";
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   border-bottom: 29px solid green;
        //   border-left: 29px solid #fff;
        //   border-right: 29px solid #fff;
        //   width: 42px;
        //   height: 0;
        // }

        // span:after {
        //   display: inline-block;
        //   content: "";
        //   position: absolute;
        //   bottom: 0;
        //   left: 0;
        //   border-top: 29px solid green;
        //   border-left: 29px solid #eee;
        //   border-right: 29px solid #eee;
        //   width: 42px;
        //   height: 0;
        // }
        .w-openmb-choice-a {
          display: inline-block;
          width: 130px;
          height: 130px;
          background: url('/static/images/activity/mb-a-on.png') no-repeat;
          background-size: 100% 100%;

          &.off {
            background: url('/static/images/activity/mb-a-off.png') no-repeat;
            background-size: 100% 100%;
          }
        }

        .w-openmb-choice-b {
          display: inline-block;
          width: 130px;
          height: 130px;
          background: url('/static/images/activity/mb-b-on.png') no-repeat;
          background-size: 100% 100%;

          &.off {
            background: url('/static/images/activity/mb-b-off.png') no-repeat;
            background-size: 100% 100%;
          }
        }

        .w-openmb-choice-c {
          display: inline-block;
          width: 130px;
          height: 130px;
          background: url('/static/images/activity/mb-c-on.png') no-repeat;
          background-size: 100% 100%;

          &.off {
            background: url('/static/images/activity/mb-c-off.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }

      .w-openmb-tips {
        /*width: 550px;*/
        /*position: absolute;*/
        /*bottom: 0;*/
        font-size: 24px;
        font-weight: 300;
        color: @mainColor;
      }
    }

    .w-openmb-popup {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.16);
      .flex-col(center, center);
      .w-openmb-popup-box {
        width: 450px;
        height: 165px;
        padding: 91px 85px 44px;
        background-color: #fff;
        .flex-col(space-between);
        .w-openmb-popup-text {
          display: inline-block;
          width: 450px;
          font-size: 28px;

          .w-openmb-popup-num {
            color: @mainColor;
          }
        }

        .w-openmb-popup-btn {
          display: inline-block;
          width: 230px;
          height: 60px;
          line-height: 60px;
          font-size: 28px;
          color: @mainColor;
          border: 1px solid @mainColor;
        }
      }
    }
    .m-modal-img{
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left:0;
      right: 0;
      background-color: rgba(0,0,0,0.4);
      .m-modal-state{
        position: absolute;
        left: 50%;
        margin-left: -250px;
        top:50%;
        margin-top: -350px;
        width: 500px;
        height: 700px;
        background-color: #fff;
        border-radius: 10px;
        .m-close{
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 40px;
        }
        .m-group-rule{
          margin: 80px 20px 20px 20px;
          height: 600px;
          overflow-y: scroll;
          text-align: left;
        }
      }
    }
    .m-rule{
      padding: 20px;
      text-align: left;
      p{
        font-size: 20px;
        line-height: 28px;
      }
    }
    .m-record-box{
      width: 644px;
      margin: 0 44px;
      padding: 10px 0;
      background-color: #6ACE94;
      border: 20px solid #fff;
      color: #fff;
      position: relative;
      .m-magic-label{
        position: absolute;
        top: -40px;
        left: 31px;
        width: 99px;
        height: 39px;
      }
      .m-cai-title{
        text-align: center;
        margin-bottom: 30px;
        font-size: 28px;
        font-weight: 400;
      }
      ul{
        li{
          .flex-row(flex-start);
          padding: 5px 14px;
          font-size: 24px;
          .m-sort{
            display: inline-block;
            width: 50px;
            height: 50px;
            color: #fff;
            font-size: 28px;
            line-height: 50px;
            border-radius: 50%;
            text-align: center;
            background-color: #27AE60;
          }
          .m-head{
            display: inline-block;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin: 0 10px;
          }
        }
      }
    }
  }

</style>
