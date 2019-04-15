<template>
    <div class="m-equipment">
      <!--搜索-->
      <div class="m-selected-search">
        <div class="m-search-input-box"  @click="changeRoute('/search','top')">
          <span class="m-icon-search"></span>
          <span>搜索商品</span>
        </div>
      </div>
      <!--//图片-->
      <div class="m-equipment-img-box">
        <img src="" class="m-equipment-img" alt="">
        <span class="mm-equipment-bg"></span>
      </div>
      <!--图标按钮-->
      <div class="m-equipment-icon-box">
        <ul class="m-equipment-icon-ul">
          <li v-for="(item,index) in icon_list" @click="changeRoute(item)">
            <img :src="item.pcpic" alt="">
            <span class="m-name">{{item.pcname}}</span>
          </li>
        </ul>
      </div>
    </div>

</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api'
    export default {
        data() {
            return {
                name: '',
               icon_list:[
                 {
                   name:'登山徒步',
                   src:'/static/images/equipment/equipment-mountaineering.png',
                   url:''
                 },
                 {
                   name:'露营装备',
                   src:'/static/images/equipment/equipment-camping.png',
                   url:''
                 },
                 {
                   name:'运动健身',
                   src:'/static/images/equipment/equipment-fitness.png',
                   url:''
                 },
                 {
                   name:'旅行用品',
                   src:'/static/images/equipment/equipment-travel.png',
                   url:''
                 },
                 {
                   name:'数码电子',
                   src:'/static/images/equipment/equipment-electronic.png',
                   url:''
                 },
                 {
                   name:'水上运动',
                   src:'/static/images/equipment/equipment-water.png',
                   url:''
                 },
                 {
                   name:'游泳运动',
                   src:'/static/images/equipment/equipment-swim.png',
                   url:''
                 },
                 {
                   name:'儿童户外',
                   src:'/static/images/equipment/equipment-child.png',
                   url:''
                 },
                 {
                   name:'骑行运动',
                   src:'/static/images/equipment/equipment-riding.png',
                   url:''
                 },
                 {
                   name:'户外食品',
                   src:'/static/images/equipment/equipment-outdoor.png',
                   url:''
                 },
                 {
                   name:'滑雪运动',
                   src:'/static/images/equipment/equipment-ski.png',
                   url:''
                 },
                 {
                   name:'潜水运动',
                   src:'/static/images/equipment/equipment-dive.png',
                   url:''
                 }
               ],
            }
        },
        components: {

        },
        mounted(){
          common.changeTitle('装备');
          this.getCategory();
        },
        methods: {
          //跳转路由
          changeRoute(v,name){
            if(name){
              this.$router.push({path: v});
            }else{
              this.$router.push({path:'/equipment/detail',query:{head:v.pcpic,name:v.pcname,pcid:v.pcid}});
            }

          },
          //获取装备信息
          getCategory(){
            axios.get(api.category_list).then(res => {
                if(res.data.status == 200){
                  this.icon_list = [].concat(res.data.data);
                }
            })
          }

        },
        created() {

        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/scroll";
  .m-equipment{
    min-height: 100%;
    background-color: #fff;
    .m-selected-search{
      justify-content: center;
      .m-search-input-box{
        width: 664px;
      }
    }
    .m-equipment-img-box{
      position: relative;
      width: 100%;
      height: 636px;
      .m-equipment-img{
        display: block;
        width: 100%;
        height: 636px;
        background-color: #9fd0bf;
      }
      .mm-equipment-bg{
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 100%;
        height: 67px;
        background: url("/static/images/icon-bg.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .m-equipment-icon-box{
      padding: 0 15px;
      .m-equipment-icon-ul{
        .flex-row(flex-start);
        flex-wrap: wrap;
        li{
          /*margin-right: 10px;*/
          font-size: 21px;
          line-height: 24px;
          letter-spacing: -0.4px;
          position: relative;
          width: 180px;
          height: 180px;
          margin-bottom: 10px;
          img{
            display: block;
            width: 180px;
            height: 180px;
          }
          .m-name{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 180px;
            text-align: center;
          }
        }
      }
    }
  }

</style>
