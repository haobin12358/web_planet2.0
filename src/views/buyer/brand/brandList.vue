<template>
    <div class="m-brandList">
      <div class="m-one-brand" @click="changeRoute('/brandDetail',item)" v-for="(item,index) in brand_list">
        <img :src="item.pbbackgroud" class="m-bg" alt="">
        <img :src="item.pblogo" class="m-brand-logo" alt="">
        <div class="m-brand-info">

          <div class="m-brand-name">{{item.pbname}}</div>
          <ul class="m-brand-product">
            <li class="m-box-shadow" v-if="item.coupon">
              <discount :item="item.coupon" :index="index" @haveDiscount="haveDiscount"></discount>
            </li>
            <li v-for="(i,j) in item.recommend" @click.stop="changeProduct(i)">
              <img :src="i.prmainpic" class="m-product-img" alt="">
              <div class="m-product-name">{{i.prtitle}}</div>
              <div class="m-product-price">
                <span>¥</span>
                <span  class="m-price">{{i.prprice}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>
</template>

<script>
   import discount from '../../../components/common/discount';
   import common from '../../../common/js/common';
   import { Toast} from 'mint-ui';
    export default {
        name: "brandList",
      data(){
          return{
            page_info:{
              page_size: 10,
              page_num:1
            },
            total_count:0,
            brand_list:[]

          }
      },
      components:{discount},
      mounted(){
          common.changeTitle('品牌');
          this.getData();
      },
      methods:{
          changeRoute(v,item){
            this.$router.push({ path: v, query: { pbid:item.pbid }})
          },
        //获取列表
          getData(){
            this.$http.get(this.$api.brand_list,{
              params:{
                page_size:this.page_info.page_size,
                page_num: this.page_info.page_num,
                token:localStorage.getItem('token')
              }
            }).then(res => {
              console.log(res);
              if(res.data.status == 200){
                this.brand_list = res.data.data;
              }
            })
          },
          //领取优惠券
          haveDiscount(item,index){
            console.log(item,index)
            this.$http.post(this.$api.coupon_fetch + '?token=' + localStorage.getItem('token'), { coid: item }).then(res => {
              Toast(res.data.message);
              if(res.data.status == 200){
                this.brand_list[index].coupon.ready_collected = true;

              }
            });
          },
          changeProduct(item){
            if(this.gift) {
              this.$router.push({ path: '/gift', query: { prid: item.prid, from: this.gift }});
            }else if(this.limited || item.tlpid) {
              this.$router.push({ path: '/limitedProductDetail', query: { tlpid: item.tlpid }});
            }else{
              this.$router.push({ path: '/productDetail', query: { prid: item.prid }});

            }
          }
      }
    }
</script>

<style scoped lang="less">
  @import "../../../common/css/resize";
.m-brandList{
  .m-one-brand{
    min-height: 700px;
    position: relative;
    background-color: #fff;
    .m-bg{
      width: 100%;
      height: 350px;
      display: block;
      background-color: #9fd0bf;
    }
    .m-brand-logo{
      position: absolute;
      top: 150px;
      left: 55px;
      width: 150px;
      height: 150px;
      background-color: #fff;
      z-index: 100;
      box-shadow:0px 3px 30px rgba(0,0,0,0.1);
    }
    .m-brand-info{
      position: absolute;
      top:200px;
      left: 25px;
      width: 700px;
      height: 480px;
      padding: 20px ;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow:0px 3px 30px rgba(0,0,0,0.1);
      .m-brand-name{
        text-align: left;
        padding-left: 195px;
        font-size: 36px;
        font-weight: 500;
        margin-bottom: 80px;
      }
      .m-brand-product{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-around;
        li{
          width: 200px;
          height: 300px;
          &.m-box-shadow{
            box-shadow:0px 3px 30px rgba(0,0,0,0.1);
          }
          .m-product-img{
            display: block;
            width: 200px;
            height: 200px;
            background-color: #c1c1c1;
          }
          .m-product-name{
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap;
            text-align: left;
            margin: 10px 0 20px;
          }
          .m-product-price{
            text-align: left;

            .m-price{
              font-size: 28px;
              font-weight: 600;
              color: #000;
            }
          }
        }
      }
    }
  }
}
</style>
