<template>
    <div class="m-starProduct" v-if="integral" @touchmove="touchMove">
      <div class="m-starProduct-head">
        <p class="m-right" @click="rulePopup = true">规则</p>
        <div class="m-flex-center">
          <img src="/static/images/newpersonal/icon-star-total.png" class="m-icon" alt="">
          <span class="m-star-num">{{integral.balance}}</span>
          <span class="m-ft-20">星币</span>
        </div>
        <!--星币规则popup-->
        <mt-popup class="m-rule-popup" v-model="rulePopup" pop-transition="popup-fade">
          <div class="m-rule-title">
<!--            <div @click="rulePopup = false">取消</div>-->
            规则
          </div>
          <div class="m-rule-text">{{integral.rule}}</div>
        </mt-popup>
        <div class="m-head-part">
          <span @click="changeRoute('/personal/starDetail',0)">获取记录</span>
          <span @click="changeRoute('/personal/starDetail',1)">消耗明细</span>
        </div>
      </div>
      <div class="m-mainIndex-edit m-flex-between">
        <div class="m-flex-start">
          <img src="/static/images/newpersonal/icon-star-edit.png" class="m-edit-icon" alt="">
          <span>星币商城</span>
        </div>
<!--        <div class="m-position-relative" @click="labelShow = !labelShow">-->
<!--          <span class="m-label">全部</span>-->
<!--          <img src="/static/images/circle/icon-up-more.png" class="m-up-more" alt="">-->
<!--          <div class="m-scroll" v-show="labelShow">-->
<!--            <ul class="m-label-ul">-->
<!--              <li>-->
<!--                全部-->
<!--              </li>-->
<!--              <li>-->
<!--                游记-->
<!--              </li>-->
<!--              <li>-->
<!--                自由主题-->
<!--              </li>-->
<!--              <li>-->
<!--                全部-->
<!--              </li>-->
<!--              <li>-->
<!--                游记-->
<!--              </li>-->
<!--              <li>-->
<!--                自由主题-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div class="m-product-list" v-if=" product_list.length >0 ">
        <div class="m-one-product"  v-for="(item,index) in product_list" @click="changeRoute('/personal/starProductDetail',item)">
<!--          <img :src="item.prmainpic" class="m-product-img" alt="">-->
          <div class="m-product-img" :style="{backgroundImage:'url(' + item.prmainpic +')'}">

          </div>
          <h3 class="m-product-title">【{{item.pbname}}】{{item.prtitle}}</h3>
          <div class="m-flex-end ">
            <img src="/static/images/newpersonal/icon-star-can.png" v-if="integral.balance >= item.ipprice" class="m-icon" alt="">
            <img src="/static/images/newpersonal/icon-star.png" v-else class="m-icon" alt="">
            <span class="m-star-num" :class="integral.balance >= item.ipprice?'active':''">{{item.ipprice}}币</span>
          </div>
        </div>
        <bottom-line v-if="bottom_show"></bottom-line>
      </div>
      <p class="m-no-data" v-else>暂无商品</p>
    </div>
</template>

<script>
  import common from '../../../common/js/common';
  import {Toast} from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';
    export default {
        name: "starProduct",
      data(){
          return{
            labelShow:false,
            rulePopup:false,
            product_list:[],
            page_info:{
              page_num:1,
              page_size:10
            },
            isScroll:true,
            total_count:0,
            total_page:0,
            bottom_show:false,
            integral:null
          }
      },
      components:{
        bottomLine
      },
      mounted(){
        common.changeTitle('星币商城');
        this.getProduct();
      },
      methods:{
        changeRoute(v,item){
          if(item.ipid){
            this.$router.push({path:v,query:{ipid:item.ipid}});
          }else{
            this.$router.push({path:v,query:{index:item}});
          }

        },
        //滚动加载更多
        touchMove(e){
          let scrollTop = common.getScrollTop();
          let scrollHeight = common.getScrollHeight();
          let ClientHeight = common.getClientHeight();
          if (scrollTop + ClientHeight  >= scrollHeight -10) {
            if(this.isScroll){
              this.isScroll = false;
              if(this.page_info.page_num > this.total_page){
                this.bottom_show = true;
              }else{
                this.getProduct();

              }
            }
          }
        },
        //获取商品列表
        getProduct(){
          let _kw = this.$route.query.kw || '';
          let start = this.page_info.page_num;
          this.$http.get(this.$api.integral_list,{
            params:{
              status:'agree',
              page_size:this.page_info.page_size,
              page_num:start,
              prtitle:_kw,
              token:localStorage.getItem('token')
            }
          }).then(res => {
            if(res.data.status == 200){
              this.integral= res.data.data.integral;
              if(res.data.data.product.length >0){
                this.page_info.page_num =   this.page_info.page_num +1;
              }else{
                return false;
              }
              if(start >1){
                this.product_list = this.product_list.concat(res.data.data.product);
              }else{
                this.product_list = res.data.data.product;
              }
              this.isScroll = true;
              this.total_count = res.data.total_count;
              this.total_page = res.data.total_page;
            }
          },error => {
            Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
          })
        },
      }
    }
</script>
<style scoped lang="less">
  @import "../../../common/css/index";
  .m-starProduct{
    min-height: 100vh;
    background-color: #fff;
    .m-starProduct-head{
      background: url("/static/images/newpersonal/icon-starProduct-bg.png") no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 250px;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: space-around;
      color: #fff;
      padding: 0 30px 20px;
      box-sizing: border-box;
      font-size: 24px;
      .m-right{
        width: 100%;
        text-align: right;
      }
      .m-star-num{
        font-size: 40px;
        margin:0 10px;
      }
      .m-head-part{
        width: 100%;
        span{
          display: inline-block;
          width: 48%;
          text-align: center;
          &:first-child{
            border-right: 1px solid #fff;
          }
        }
      }
    }
    .m-rule-popup {
      width: 600px;
      height: 800px;
      margin: -300px 0 0 75px;
      /*border-radius: 30px;*/
      color: #000;
      .m-rule-title{
        font-size: 28px;
        text-align: center;
        margin: 50px 0 30px;
      }
      .m-rule-text {
        font-size: 28px;
        /*text-indent: 2em;*/
        padding: 20px 50px;
        line-height: 40px;
        text-align: left;
      }
    }
    .m-icon{
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
    .m-mainIndex-edit{
      padding: 30px 30px 30px 60px;
      /*border-bottom: 1px solid #F2F2F2;*/
      font-size: 28px;
      .m-edit-icon{
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-right: 20px;
      }
      .m-label{
        font-size: 24px;
      }
      .m-up-more{
        display: inline-block;
        width: 24px;
        height: 14px;
        margin-left: 10px;
      }
      .m-position-relative{
        position: relative;
        .m-scroll{
          height: 250px;
          overflow: scroll;
          background-color: #fff;
          width: 180px;
          text-align: center;
          position: absolute;
          bottom: -270px;
          right: -30px;
          font-size: 24px;
          transition: height 0.1s ease-out;
          .m-label-ul{
            overflow-y: scroll;
            overflow-x: hidden;
            li{
              padding: 15px 0;
            }
          }
        }
      }
    }
    .m-product-list{
      padding: 0 24px;
      .flex-row(flex-start);
      flex-wrap: wrap;
      .m-one-product{
        width: 340px;
        margin-bottom: 30px;
        &:nth-child(odd){
          margin-right: 20px;
        }
        .m-product-img{
          display: block;
          width: 340px;
          height: 450px;
          overflow:hidden;

          background-position: center center;
          background-repeat: no-repeat;
          -webkit-background-size:cover;
          -moz-background-size:cover;
          background-size:cover;
        }
        .m-product-title{
          white-space: normal;
          margin: 20px 0 10px 0;
          width: 340px;
          font-size: 24px;
          text-align: left;
          overflow: hidden; // 超出的文本隐藏
          word-break: break-word;  // 英文换行
          text-overflow: ellipsis;    // 溢出用省略号显示
          display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
          -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
          -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
        }
        .m-star-num{
          color: #C1C1C1;
          font-size: 24px;
          &.active{
            color: @mainColor;
          }
        }
      }
    }
  }

</style>
