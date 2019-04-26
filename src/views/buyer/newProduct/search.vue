<template>
    <div class="m-product">
      <div class="m-selected-search left">
        <div class="m-search-input-box" @click="changeRoute('/search')" >
          <span class="m-icon-search"></span>
          <span class="m-search-text">{{$route.query.kw}}</span>
        </div>
        <!--        <span class="m-icon-upload" @click="changeRoute('/circle/newEdit')"></span>-->
      </div>
      <nav-list  :navlist="nav_list" @navClick="navClick"></nav-list>
      <product :list="product_list"></product>
      <bottom-line v-if="bottom_show"></bottom-line>
      <!--<div class="m-modal-select" v-if="show_modal" @click="changeModal('show_modal',false)">-->
      <div class="m-modal-select" v-if="show_modal" @click.self="show_modal = false">
        <div class="m-modal-state">
          <div class="m-state-content">
            <template v-for="(items,index) in category_list">
              <div class="m-one-select" v-if="items.subs">
                <p >{{items.pcname}}</p>
                <div class="m-sku-list">
                  <span class="m-one-sku" :class="item.active?'active':''" v-for="(item,i) in items.subs" @click.stop="categoryClick(index,i)">{{item.pcname}}</span>
                </div>
              </div>
            </template>
            <!--<div class="m-one-select">-->
            <!--<p>防风衣/运动外套</p>-->
            <!--<div class="m-sku-list">-->
            <!--<input type="text" placeholder="最低价">-->
            <!--<span class="m-grey">——</span>-->
            <!--<input type="text" placeholder="最低价">-->
            <!--</div>-->
            <!--</div>-->
          </div>
          <div class="m-state-foot">
            <div class="m-product-detail-btn">
              <span @click="resetPrid">重 置</span>
              <span class="active" @click="searchProduct">确 定</span>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  import product from '../components/product';
  import navList from '../../../components/common/navlist';
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api'
  import {Toast} from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';
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
    data(){
      return{
        nav_list:[
          {
            name:'销量',
            params:'sale_value',
            active:true,
            icon:true,
            desc_asc:true
          },
          {
            name:'新品',
            params:'time',
            active:false,
            icon:true,
            desc_asc:true
          },
          {
            name:'价格',
            params:'price',
            active:false,
            icon:true,
            desc_asc:true
          },
          {
            name:'筛选',
            params:'',
            active:false,
            desc_asc:true
          }
        ],
        pcid: '',
        show_modal: false,
        // brand_info:null,
        pcidList:[],
        product_list:[],
        page_info:{
          page_num:0,
          page_size:10
        },
        isScroll:true,
        total_count:0,
        total_page:0,
        bottom_show:false,
        category_list:null,
        temp: []
      }
    },
    components:{
      product,
      navList,
      bottomLine
    },
    mounted(){
      common.changeTitle('商城');
      this.getProduct(1,'sale_value|asc');
    },
    activated() {
      this.getProduct(1,'sale_value|asc');
    },
    methods:{
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
              for(let i=0;i<this.nav_list.length;i++){
                if(this.nav_list[i].active){
                  this.getProduct(this.page_info.page_num,this.nav_list[i].params + (this.nav_list[i].desc_asc?'|asc':'|desc'));
                }
              }
            }
          }
        }
      },
      // 页面跳转
      changeRoute(v){
        this.$router.push(v)
      },
      //导航切换
      navClick(index){
        let arr = [].concat(this.nav_list);
        for(let i=0;i<arr.length;i++){
          arr[i].active = false;
        }
        arr[index].active = true;
        arr[index].desc_asc = !arr[index].desc_asc;
        this.nav_list = [].concat(arr);
        this.page_info.page_num = 1;
        this.bottom_show = false;
        if(index == 3){
          this.changeModal('show_modal',true);
          this.getCategory();
        }else{
          if(arr[index].desc_asc){
            // this.getProduct(1,arr[index].params +'|asc')
            this.getProduct(1,arr[index].params +'|desc')
          }else{
            // this.getProduct(1,arr[index].params +'|desc')
            this.getProduct(1,arr[index].params +'|asc')
          }
        }
      },
      //显示隐藏模态框
      changeModal(v,bool) {
        this[v] = bool;
        if(bool){
          scroll.afterOpen();
        }else{
          scroll.beforeClose();
        }
      },
      //获取商品列表
      getProduct(start,desc_asc){
        let _pcid = this.$route.query.pcid || this.pcid;
        let _kw = this.$route.query.kw || '';
        axios.get(api.product_list,{
          params:{
            pcid:_pcid,
            page_size:this.page_info.page_size,
            order_type:desc_asc,
            page_num:start,
            kw:_kw,
            token:localStorage.getItem('token')
          }
        }).then(res => {
          if(res.data.status == 200){
            if(res.data.data.length >0){
              this.page_info.page_num =   this.page_info.page_num +1;
            }else{
              return false;
            }
            if(start >1){
              this.product_list = this.product_list.concat(res.data.data);
            }else{
              this.product_list = res.data.data;
            }
            this.isScroll = true;
            this.total_count = res.data.total_count;
            this.total_page = res.data.total_page;
          }
        },error => {
          Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
        })
      },
      //获取装备信息
      getCategory(){
        axios.get(api.category_list + '?deep=2').then(res => {
          if(res.data.status == 200){
            this.category_list = res.data.data;
            this.resetPrid();
            for(let i = 0; i < this.temp.length; i ++) {
              this.category_list[this.temp[i][0]].subs[this.temp[i][1]].active = true;
              this.category_list = this.category_list.concat();
            }
          }
        });
      },
      // 重置二级分类
      resetPrid() {
        for(let i = 0; i < this.category_list.length; i ++) {
          if(this.category_list[i].subs) {
            for(let j = 0; j < this.category_list[i].subs.length; j ++) {
              this.category_list[i].subs[j].active = false;
              this.category_list = this.category_list.concat();
            }
          }
        }
      },
      // 筛选点击
      categoryClick(index,i) {
        this.category_list[index].subs[i].active = !this.category_list[index].subs[i].active;
        this.category_list = this.category_list.concat();
      },
      // 确定按钮
      searchProduct() {
        this.pcid = '';
        this.temp = [];
        this.pcidList = [];
        for(let i = 0; i < this.category_list.length; i ++) {
          if(this.category_list[i].subs) {
            let temp = [];
            for(let j = 0; j < this.category_list[i].subs.length; j ++) {
              if(this.category_list[i].subs[j].active) {
                temp = [i, j];
                this.temp.push(temp);
                this.pcidList.push(this.category_list[i].subs[j].pcid);
              }
            }
          }
        }
        for(let i = 0; i < this.pcidList.length; i ++) {
          this.pcid = this.pcid + this.pcidList[i] + '|';
        }
        this.pcid = this.pcid.substr(0, this.pcid.length - 1);
        this.getProduct(1,'sale_value|asc');
        this.pcidList = [];
        this.show_modal = false;
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  .m-product{
    width: 100%;
    overflow-x: hidden;
    .m-nav-list{
      padding: 0 75px;
    }
    .m-modal-select{
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0,0,0,0.2);
      z-index: 1001;
      transition: opacity .5s;
      .m-modal-state{
        width: 563px;
        position: absolute;
        top:0;
        right: 0;
        height: 100vh;
        background-color: #fff;
        .m-state-content{
          margin-top: 50px;
          padding: 26px 30px;
          text-align: left;
          height: 75%;
          overflow-y: auto;
          .m-one-select{
            padding: 21px 0;
            border-bottom: 1px solid #ccc;
            &:last-child{
              border-bottom: none;
            }
            input{
              display: inline-block;
              width: 200px;
              height: 40px;
              background-color: #e9e9e9;

              text-align: center;
              margin: 20px 10px;
            }
            .m-one-sku{
              display: inline-block;
              padding: 6px 34px;
              background-color: #E9E9E9;
              margin-right: 20px;
              margin-top: 20px;
              &.active {
                color: #ffffff;
                background-color: @mainColor;
              }
            }
          }
        }
        .m-state-foot{
          position: absolute;
          bottom: 100px;
          right: 36px;
          .m-product-detail-btn{
            display: inline-block;
            height: 62px;
            line-height: 62px;
            span{
              color: #ffffff;
              display: inline-block;
              width: 171px;
              text-align: center;
              background-color: @subColor;
              margin: 0;
              &.active{
                background-color: @mainColor;
                margin-left: -8px;
              }
            }
          }
        }
      }
    }
    input::-webkit-input-placeholder{
      color: #999;
      text-align: center;
    }
  }
</style>
