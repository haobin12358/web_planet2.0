<template>
    <div class="m-brandList" @touchmove="touchMove">
      <div class="m-nav isFixed">
        <nav-list :navlist="nav_list" :isScroll="true" :is-get="true" @navClick="navClick"></nav-list>
      </div>
      <div class="m-bandList-content">
        <div class="m-scroll-content">
          <template v-for="(items,index) in brand_list" v-if="items.brands.length">
            <div class="margin" :id="items.itid"></div>
            <div class="m-one-brand-part" :ref="items.itid">
              <h3>{{items.itname}}</h3>
              <ul class="m-brand-ul">
                <li class="m-brand-li" @click="changeRoute('/brandDetail',item)" v-for="item in items.brands">
                  <img :src="item.pblogo" alt="">
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
</template>

<script>
  import common from '../../../common/js/common';
  import navList from '../../../components/common/navlist';
  import axios from 'axios';
  import api from '../../../api/api'
  import {Toast} from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine'
    export default {
      data(){
          return{
            nav_list:[],
            brand_list:null,
          }
        },
      components: {
        navList
      },
      mounted(){
        common.changeTitle('品牌列表');
        this.getBrand();
        this.getNav();
      },
      methods:{
        touchMove(){
          let arr = [].concat(this.nav_list);
          let _i = 0;
          for(let i=0;i<arr.length;i++){
            if(document.getElementById(arr[i].itid)){
              if(document.getElementById(arr[i].itid).offsetTop-20 < common.getScrollTop()){
                _i = i;
                break;
              }
            }
          }
          for(let i=0;i<arr.length;i++){
            arr[i].active = false;
          }
          arr[_i].active = true;
          this.nav_list= [].concat(arr);
        },
        //改变路由
        changeRoute(v,item){
          this.$router.push({path:v,query:{pbid:item.pbid,pbname:item.pbname}})
        },
        //导航切换
        navClick(index){
          let arr = [].concat(this.nav_list);
          for(let i=0;i<arr.length;i++){
            arr[i].active = false;
          }
          arr[index].active = true;
          this.nav_list = [].concat(arr);
          let id = arr[index].itid;
          document.getElementById(id).scrollIntoView();         // 滚动到顶部
        },
      //  获取标签
        getNav(){
          axios.get(api.items_list,{
            params:{
              ittype:40
            }
          }).then(res => {
            if(res.data.status == 200){
              for(let i=0;i<res.data.data.length;i++){
                res.data.data[i].active = false;
              }
              res.data.data[0].active = true;
              this.nav_list = [].concat(res.data.data);
            }
          })
        },
      //  获取品牌列表
        getBrand(){
          axios.get(api.list_with_group).then(res => {
            if(res.data.status == 200){
              this.brand_list = res.data.data;
            }
          })
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../../common/css/index";
  .m-brandList{
    /*padding-top: 120px;*/
    .m-nav{
      padding-left: 35px;
      padding-top: 10px;
      width: 715px;
      box-shadow:0 3px 6px rgba(0,0,0,0.16);
      padding-bottom: 10px;
      margin: 0 0 48px;
      background-color: #fff;
      &.isFixed{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
      }
    }
    .m-bandList-content{
      text-align: left;
      /*height: 1200px;*/
      /*overflow-x: hidden;*/
      /*overflow-y: auto;*/
      position: absolute;
      top: 0;
      left: 0;
      .m-scroll-content{
        height: auto;
        overflow-y: auto;
      }
      .margin {
        height: 70px;
      }
      .m-one-brand-part{
        &:first-child {
          margin-top: 50px;
        }
        h3{
          /*padding:  80px 0 48px 34px;*/
          padding: 40px;
          font-size: 36px;
          font-weight: bold;
        }
        .m-brand-ul{
          margin: 0 40px -70px 40px;
          padding: 30px 45px 0 45px;
          background-color: #ffffff;
          .flex-row(flex-start);
          flex-wrap: wrap;
          li{
            margin: 0 40px 40px 0;
            img{
              /*display: block;*/
              width: 150px;
              height: 150px;
              border-radius: 10px;
              /*background-color: #9fd0bf;*/
            }
          }
        }
      }
    }
  }
</style>
