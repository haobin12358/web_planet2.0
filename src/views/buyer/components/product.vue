<template>
  <ul class="m-recommend">
    <li @click="changeRoute(item)" v-for="(item,index) in list">
<!--      <div class="m-one-product-img">-->
      <div class="m-one-product-img" :style="{backgroundImage:'url('+item.prmainpic+')'}">
<!--        <img :src="item.prmainpic"  width="330" height="440" border="0" alt="">-->
      </div>
<!--      </div>-->

      <div class="m-one-product-text">
        <!--<h3>【{{item.brand.pbname}}】{{item.prtitle}} </h3>-->
        <h3>
          <span class="m-brand-name">【{{item.brand.pbname}}】</span>
          <span>{{item.prtitle}}</span>
        </h3>
        <p class="m-flex-between">
          <span class="money-text" v-if="isAct && item.tlpprice">￥{{item.tlpprice | money}}</span>
          <span class="money-text" v-else>￥{{item.prprice | money}}</span>
          <s class="money-text m-grey" v-if="item.prlineprice">￥{{item.prlineprice | money}}</s>
          <s class="money-text m-grey" v-else>￥{{item.prprice | money}}</s>
        </p>
      </div>
    </li>
  </ul>

</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                name: ''
            }
        },
        props: {
          list:{
            type:Array,
            default:null
          },
          gift:{
            type:Boolean,
            default:false
          },
          limited:{
            type:Boolean,
            default:false
          },
          isAct:{
            type:Boolean,
            default:false
          }
        },
        methods: {
          changeRoute(item){
            if(this.gift) {
              this.$router.push({ path: '/gift', query: { prid: item.prid, from: this.gift }});
            }else if(this.limited || item.tlpid) {
              this.$router.push({ path: '/limitedProductDetail', query: { tlpid: item.tlpid }});
            }else{
                this.$router.push({ path: '/productDetail', query: { prid: item.prid }});

            }
          }
        },
        created() {

        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  .m-recommend{
    display: flex;
    flex-flow: row;
    align-items: center;
    flex-wrap: wrap;
    padding: 30px 24px ;
    li{
      list-style: none;
      width: 330px;
      height: auto;
      /*border-radius: 10px;*/
      /*box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.16);*/
      background-color: #ffffff;
      margin-bottom: 30px;
      &:nth-child(odd){
        margin-right: 20px;
      }
      .m-one-product-img{
        display: block;
        width: 330px;
        height: 440px;
        /*padding-bottom: 100%;*/
        overflow:hidden;

        background-position: center center;
        background-repeat: no-repeat;
        -webkit-background-size:cover;
        -moz-background-size:cover;
        background-size:cover;
        /*background-color: #fff;*/
        /*.flex-row(center);
        img{*/
        /*  width: auto;*/
        /*  height: auto;*/
        /*  max-width: 100%;*/
        /*  max-height: 100%;*/
        /*}*/
        /*background-color: #edb3b1;*/
        /*border-radius: 10px;*/
      }
      .m-one-product-text{
        /*padding: 15px;*/
        .m-flex-between {
          font-size: 21px;
          text-align: left;
          width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .m-brand-name {
          color: @mainColor;
          margin: 0 -5px;
        }
      }
      h3{
        width: 300px;
        margin-top: 38px;
        font-size: 21px;
        text-align: left;
        /*height: auto;*/
        height: 66px;
        line-height: 33px;
        //overflow: hidden;
        //text-overflow: ellipsis;
        //white-space: nowrap;
        white-space: normal;
        overflow: hidden; // 超出的文本隐藏
        word-break: break-word;  // 英文换行
        text-overflow: ellipsis;    // 溢出用省略号显示
        display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
        -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
      }
    }
    .money-text {
      /*width: 200px;*/
      overflow: hidden; // 超出的文本隐藏
      text-overflow: ellipsis;    // 溢出用省略号显示
    }
  }
</style>
