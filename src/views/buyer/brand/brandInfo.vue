<template>
    <div class="m-brandInfo">
      <div class="m-brand-info" :style="{'background':brand_info.pbthemecolor?brand_info.pbthemecolor: (brand_info.pbbackgroud? 'url('+ brand_info.pbbackgroud +') no-repeat': 'url(/static/images/index/brand-top-bg.png) no-repeat'),'backgroundSize':'100% 100%'}" >
        <img :src="brand_info.pblogo" class="m-logo"  alt="">
        <div class="m-info">
          <div class="m-flex-between">
            <span class="m-name">{{brand_info.pbname}}</span>
<!--            <span class="m-btn" @click="changeRoute('/brandInfo')">查看更多</span>-->
          </div>
          <div class="m-desc">{{brand_info.pbslogan}}</div>
        </div>
      </div>
      <img :src="item" class="m-img" v-for="(item,index) in brand_info.pbpublicity" alt="">
    </div>
</template>

<script>
  import { Toast} from 'mint-ui';
    export default {
        name: "brandInfo",
      data(){
          return{
            brand_info:{},

          }
      },
      mounted(){
        this.getData(this.$route.query.pbid);
      },
      methods:{
        //获取品牌详情
        getData(id){
          this.$http.get(this.$api.get_one_brand,{
            params:{
              pbid:id,
              token:localStorage.getItem('token')
            }
          }).then(res => {
            if(res.data.status == 200){

              this.brand_info = res.data.data;
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
  .m-brandInfo{
    .m-brand-info{
      padding: 40px 30px;
      .flex-row(flex-start);
      /*background-color: #0084D6;*/
      background: url("/static/images/index/brand-top-bg.png") no-repeat;
      background-size: 100% 100%;
      .m-logo{
        display: block;
        width: 120px;
        height: 120px;
        box-shadow:0px 3px 30px rgba(0,0,0,0.1);
        margin:0 30px;
      }
      .m-info{
        width: 500px;
        height: 120px;
        color: #fff;
        .flex-col(space-between);
        text-align: left;
        align-items: flex-start;
        .m-name{
          width: 400px;
          font-size: 40px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .m-btn{
          font-size: 20px;
          padding: 0 10px;
          display: inline-block;
          border: 1px solid #fff;
        }
      }
    }
    .m-img{
      display: block;
      width: 100%;
      /*min-height: 85vh;*/
      /*background-color: #9fd0bf;*/
    }
  }

</style>
