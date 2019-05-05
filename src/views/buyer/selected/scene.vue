<template>
    <div class="m-scene" id="header" @touchmove="touchMove">
      <div class="m-scroll m-margin">
        <ul class="m-selected-scene-ul">
          <li v-for="(item,index) in scene_list" @click="sceneClick(index)">
            <img :src="item.pspic" class="m-selected-scene-img" :class="item.active?'active':''" alt="">
            <img src="/static/images/icon-hot.png" class="m-hot" v-if="item.countdown" alt="">
            <div class="m-time-box" v-if="item.countdown">
              <img src="/static/images/icon-time.png" class="m-time" alt="">
              <span>{{item.hour}}:{{item.min}}:{{item.sec}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="m-scroll-l">
        <ul class="m-scene-label">
          <li v-for="(item,index) in nav_list" :class="item.active?'active':''" @click="navClick(index)">{{item.itname}}</li>
        </ul>
      </div>
      <product v-if="product_list.length >0 " :list="product_list"></product>
      <p class="m-no-data" v-else>该场景下无数据</p>
      <bottom-line v-if="bottom_show"></bottom-line>
      <span class="m-icon-top" @click="returnTop"></span>
    </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import product from '../components/product';
  import axios from 'axios';
  import api from '../../../api/api'
  import {Toast} from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';
  export default {
    data() {
      return {
        scene_list:'',
        nav_list:'',
        product_list:[],
        page_info:{
          page_num:1,
          page_size:10
        },
        isScroll:true,
        total_count:0,
        bottom_show:false,
      }
    },
    components: {
      product,
      bottomLine
    },
    mounted(){
        common.changeTitle('场景推荐');
        this.getScene();
    },
    methods: {
      //获取场景
      getScene(){
        axios.get(api.scene_list,{
          params:{
            token:localStorage.getItem('token') || ''
          }
        }).then(res => {
          if(res.data.status == 200){
            let index = 0;
            for(let i=0;i<res.data.data.length;i++){
              res.data.data[i].active = false;
              if(res.data.data[i].psid == this.$route.query.psid){
                index = i;
              }
            }
            res.data.data[index].active = true;
            this.scene_list = [].concat(res.data.data);
            this.getNav(res.data.data[index].psid);
            for(let i = 0; i < this.scene_list.length; i ++) {
              if(this.scene_list[i].countdown) {
                this.timeOut();       // 倒计时
              }
            }
          }
        })
      },
      // 倒计时
      timeOut() {
        let arr = [].concat(this.scene_list);
        for(let i in arr) {
          let arr_int = [];
          if(arr[i].countdown) {
            if(arr[i].countdown.substr(0, 1) > -1) {
              arr[i].hour = 0;
              arr[i].min = 0;
              arr[i].sec = 0;
              arr_int = arr[i].countdown.split(':');
              arr[i].hour = arr_int[0];
              arr[i].min = arr_int[1];
              arr[i].sec = arr_int[2];
              let TIME_OUT = Number(arr[i].min) * 60 + Number(arr[i].sec);
              let count = TIME_OUT;
              if(arr[i].time_interVal){
                clearInterval(arr[i].time_interVal);
              }
              arr[i].time_interVal  = setInterval(() => {
                if(count > 0 && count <= TIME_OUT) {
                  count --;
                  arr[i].sec --;
                  if(this.scene_list[i].sec < 10 && this.scene_list[i].sec > -1) {
                    arr[i].sec = '0' + arr[i].sec;
                  }
                  if(this.scene_list[i].sec == -1) {
                    arr[i].sec = 59;
                    if(this.scene_list[i].min > 0) {
                      arr[i].min -= 1;
                    }
                    if(this.scene_list[i].min < 10) {
                      if(this.scene_list[i].min !== '00') {
                        arr[i].min = '0' + arr[i].min;
                      }else {
                        arr[i].countdown = null;
                      }
                    }
                  }
                  this.scene_list = [].concat(arr);
                }else {
                  this.scene_list[i].countdown = null;
                  clearInterval(arr[i].time_interVal);
                }
              }, 1000);
              console.log(this.scene_list)
            }else {
              this.scene_list[i].countdown = null
            }
          }
        }
      },
      //获取商品标签
      getNav(psid){
        axios.get(api.items_list,{
          params:{
            ittype:0,
            psid:psid
          }
        }).then(res => {
          if(res.data.status == 200){
            if(res.data.data.length == 0){
              this.nav_list = [];
              this.product_list = [];
              this.total_count = 1;
              this.page_info.page_num = 1;
            }else{
              for(let i=0;i<res.data.data.length;i++){
                res.data.data[i].active = false;
              }
              res.data.data[0].active = true;
              this.nav_list = [].concat(res.data.data);
              this.getProduct(this.nav_list[0].itid);
            }
          }
        })
      },
      //获取商品列表
      getProduct(itid){
        let start = this.page_info.page_num;
        let psid  = '';
        for(let i=0;i<this.scene_list.length;i++){
          if(this.scene_list[i].active){
            psid = this.scene_list[i].psid;
          }
        }
        axios.get(api.product_list,{
          params:{
            page_size:this.page_info.page_size,
            page_num:start,
            token:localStorage.getItem('token'),
            itid:itid,
            psid:psid
          }
        }).then(res => {
          if(res.data.status == 200){
            if(res.data.data.length >0){
              if(start >1){
                this.product_list = this.product_list.concat(res.data.data);
              }else{
                this.product_list = res.data.data;
              }
              this.isScroll = true;
              this.total_count = res.data.total_count;
              this.page_info.page_num = this.page_info.page_num +1;
            }else{
              this.product_list = [];
              this.total_count = 1;
              this.page_info.page_num = 1;
              return false;
            }
          }
        },error => {
          Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
        })
      },
    //  导航点击
      sceneClick(index){
        this.page_info.page_num = 1;
        if(this.scene_list[index].active){
          return false;
        }
        let arr = [].concat(this.scene_list);
        for(let i =0;i<arr.length;i++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.scene_list = [].concat(arr);
        this.getNav(arr[index].psid);
      },
      //  导航点击
      navClick(index){
        if(this.nav_list[index].active){
          return false;
        }
        let arr = [].concat(this.nav_list);
        for(let i =0;i<arr.length;i++){
          arr[i].active = false;
        }
        arr[index].active = true;
        this.nav_list = [].concat(arr);
        this.page_info.page_num = 1;
        this.getProduct(arr[index].itid);
      },
      //滚动到顶部
      returnTop:function(){
        document.querySelector("#header").scrollIntoView(true);
      },
      //滚动加载更多
      touchMove(e){
        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll){
            this.isScroll = false;
            if(this.product_list.length == this.total_count){
              this.bottom_show = true;
            }else{
              for(let i =0;i<this.nav_list.length;i++){
                if(this.nav_list[i].active ){
                  this.getProduct(this.nav_list[i].itid);
                }
              }
            }
          }
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/scroll";
  .m-scene{
    min-height: 100vh;
    /*background-color: #eeeeee;*/
    .m-margin{
      margin: 0 0 10px 33px;
      .m-selected-scene-ul{
        padding: 10px 0;
      }
    }
  }
  .m-scroll-l{
    margin: 0 0 0 33px ;
    width: 717px;
    overflow-x: auto;
    overflow-y: hidden;
    text-align: left;
    .m-scene-label{
      height: 53px;
      min-width: 101%;
      overflow-y: hidden;
      text-align: left;
      display: inline;
      white-space: nowrap;
      overflow-x: scroll;
      li{
        display: inline-block;
        padding: 0 27px;
        /*width: 150px!important;*/
        height: 53px;
        line-height: 53px;
        background-color: #ccc;
        margin-right: 30px;
        /*border-radius: 10px;*/
        &.active{
          background-color: @mainColor;
          color: #fff;
        }
      }
    }
  }
 .m-icon-top{
   position: fixed;
   bottom: 40px;
   right: 15px;
   width: 78px;
   height: 78px;
   background: url("/static/images/icon-top.png") no-repeat;
   background-size: 100% 100%;
 }
</style>
