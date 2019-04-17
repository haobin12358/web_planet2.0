<template>
    <div class="m-starProduct">
      <div class="m-starProduct-head">
        <p class="m-right" @click="rulePopup = true">规则</p>
        <div class="m-flex-center">
          <img src="/static/images/newpersonal/icon-star-total.png" class="m-icon" alt="">
          <span class="m-star-num">1200</span>
          <span class="m-ft-20">星币</span>
        </div>
        <!--星币规则popup-->
        <mt-popup class="m-rule-popup" v-model="rulePopup" pop-transition="popup-fade">
          <div class="m-rule-title">
<!--            <div @click="rulePopup = false">取消</div>-->
            规则
          </div>
          <div class="m-rule-text">是放松的方式</div>
        </mt-popup>
        <div class="m-head-part">
          <span @click="changeRoute('/personal/starDetail')">获取记录</span>
          <span @click="changeRoute('/personal/starDetail')">消耗明细</span>
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
      <div class="m-product-list">
        <div class="m-one-product">
          <img src="" class="m-product-img" alt="">
          <h3 class="m-product-title">【TAWA】TAWA防水帐篷户外野营必备TAWA防水帐篷户外野营必备</h3>
          <div class="m-flex-end ">
            <img src="/static/images/newpersonal/icon-star-can.png" class="m-icon" alt="">
            <span class="m-star-num active">160币</span>
          </div>
        </div>
        <div class="m-one-product">
          <img src="" class="m-product-img" alt="">
          <h3 class="m-product-title">【TAWA】TAWA防水帐篷户外野营必备TAWA防水帐篷户外野营必备</h3>
          <div class="m-flex-end ">
            <img src="/static/images/newpersonal/icon-star.png" class="m-icon" alt="">
            <span class="m-star-num">160币</span>
          </div>
        </div>
        <div class="m-one-product">
          <img src="" class="m-product-img" alt="">
          <h3 class="m-product-title">【TAWA】TAWA防水帐篷户外野营必备TAWA防水帐篷户外野营必备</h3>
          <div class="m-flex-end ">
            <img src="/static/images/newpersonal/icon-star.png" class="m-icon" alt="">
            <span class="m-star-num">160币</span>
          </div>
        </div>
        <div class="m-one-product">
          <img src="" class="m-product-img" alt="">
          <h3 class="m-product-title">【TAWA】TAWA防水帐篷户外野营必备TAWA防水帐篷户外野营必备</h3>
          <div class="m-flex-end ">
            <img src="/static/images/newpersonal/icon-star.png" class="m-icon" alt="">
            <span class="m-star-num">160币</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "starProduct",
      data(){
          return{
            labelShow:false,
            rulePopup:false
          }
      },
      methods:{
        changeRoute(v){
          this.$router.push(v);
        }
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
          background-color: #9fd0bf;
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
