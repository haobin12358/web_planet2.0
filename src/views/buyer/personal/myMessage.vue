<template>
  <div class="m-my-message" >
    <div class="m-shop-content" @touchmove="touchMove">
<!--      <p class="m-no-data" v-if="message_list.length == 0">暂无消息</p>-->
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
      <template v-if="nav_list[0].active" >
<!--        <div class="m-supplier-item"  >-->
<!--          <img src="/static/images/logo.jpg" class="m-avator-img" alt="">-->
<!--          <h3>供应商沟通</h3>-->
<!--        </div>-->
        <p class="m-no-data" v-if="room_list.length == 0">暂无消息</p>
        <template v-else>
          <div class="m-shop-product"  v-for="(item,index) in room_list" data-type="0">
            <div class="m-product-info"    @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="skip">
              <img :src="item.headlist ? item.headlist[0] :'/static/images/logo.jpg'" class="m-avator-img" alt="">
              <div class="m-text-info"  @click="changeRoute('/personal/messageDetail',item)">
                <h3 class="m-flex-between">
                  <span class="m-user-name">{{item.roomname}}</span>
                  <span class="m-grey">{{item.updatetime}}</span>
                </h3>
                <p class="m-grey m-flex-between">
                  <span class="m-msg-text">
                    {{item.umsgtext}}
                  </span>
                  <span class="m-count" v-if="item.count">{{item.count}}</span>
                </p>
              </div>

            </div>
            <span class="m-delete" @click.stop="DestroyCart(item)">删除</span>
          </div>
        </template>


      </template>
      <div class="m-in-message" v-if="nav_list[1].active" >
        <div class="m-one-message" v-for="(item,index) in  message_list">
          <div class="m-flex-between">
            <div class="m-flex-between">
              <img src="/static/images/logo.jpg" v-if="item.pmhead == ''" class="m-avator-img" alt="">
              <img :src="item.pmhead " v-else class="m-avator-img" alt="">
              <span>{{item.pmname}} </span>
            </div>
            <span class="m-grey">{{item.createtime}}</span>
          </div>
          <div class="m-one-message-content" v-html="item.pmtext">

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import { Toast, MessageBox } from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';
  import navList from '../../../components/common/navlist';
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
    name: 'ShopIndex',
    data() {
      return {
        message_list: [],
        room_list:[],
        page_info:{
          page_num:1,
          page_size:10
        },
        isScroll:true,
        total_count:0,
        bottom_show:false,
        select_value:null,
        startX : 0 ,
        endX : 0 ,
        nav_list:[
          {
            name:'私信',
            value:'',
            active:true,
            count:0
          },
          {
            name:'站内信',
            value:'',
            active:false,
            count:0
          }
        ],
      }
    },
    components: { navList, bottomLine },
    mounted(){
      common.changeTitle('消息');
      this.getMessage();

    },
    created(){
      this.setSession();


    },
    sockets: {
      message_list(data){
        if(data){
          this.nav_list[1].count = 1;
          this.nav_list = [].concat(this.nav_list);
        }
      },
      notice(data){
        if(data){
          this.nav_list[0].count = 1;
          this.nav_list = [].concat(this.nav_list);
        }
        let _arr = [...this.room_list];
        let index = -1;
        for(let i in _arr){
          if(_arr[i].roid == data.roid){
            index = i;
            break;
          }
        }
        data.count = data.count ? Number(data.count) + 1 : 1;
        if(index == -1){
          _arr.unshift(data);
        }else{
          _arr.splice(index,1);
          _arr.unshift(data);
        }
        this.room_list = [..._arr];
      }
    },
    methods: {
      setSession(){
        this.$socket.emit('setsession', localStorage.getItem('token'),function (res) {
          //如果连接失败，重新连接
          if(res.status != 200){
            this.setSession();
          }
          // else{
          // this.$socket.emit('get_message');
          // }
        });
      },
      changeRoute(v, item){
        // this.$socket.emit('get_message');
          this.$router.push({path:v,query:{roid:item.roid}});
      },
      // 获取站内信信息
      getAppMessage(){
        this.$http.get(this.$api.message_get,{
          params:{
            token:localStorage.getItem('token'),
            page_size:this.page_info.page_size,
            page_num: this.page_info.page_num
          }
        }).then(res => {
          if(res.data.status == 200){
            this.nav_list[1].count = 0;
            this.nav_list = [].concat(this.nav_list);
            if(res.data.data.length >0){
              if(this.page_info.page_num >1){
                this.message_list = this.message_list.concat(res.data.data);
              }else{
                this.message_list = res.data.data;
              }
              this.page_info.page_num = this.page_info.page_num +1;
            }else{
              this.message_list = [];
              this.page_info.page_num = 1;
              this.total_count = 0;
            }
            // let arr = [].concat(this.message_list);
            // for(let i = 0;i<arr.length;i++){
            //   arr[i].active = false;
            //   for(let j =0;j<arr[i].cart.length;j++){
            //     arr[i].cart[j].active = false;
            //   }
            // }
            // this.message_list = [].concat(arr);
            this.isScroll = true;
            this.total_count = res.data.total_count;
          }
        })
      },
      // 获取信息
      getMessage(){
        this.$http.get(this.$api.get_room_list,{
          params:{
            token:localStorage.getItem('token'),
            page_size:this.page_info.page_size,
            page_num: this.page_info.page_num
          }
        }).then(res => {
          if(res.data.status == 200){
            this.nav_list[0].count = 0;
            this.nav_list = [].concat(this.nav_list);
            if(res.data.data.length >0){
              if(this.page_info.page_num >1){
                this.room_list = this.room_list.concat(res.data.data);
              }else{
                this.room_list = res.data.data;
              }
              this.page_info.page_num = this.page_info.page_num +1;
            }else{
              this.room_list = [];
              this.page_info.page_num = 1;
              this.total_count = 0;
              return false;
            }
            this.isScroll = true;
            this.total_count = res.data.total_count;
          }
        })
      },
      //滚动加载更多
      touchMove(e){
        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll){
            this.isScroll = false;
           let _index = 0;
           for(let i in this.nav_list){
             if(this.nav_list[i].active){
               _index = i;
             }
           }
           let length = (_index == 0? this.room_list.length:this.message_list.length);
            if(length == this.total_count){
              this.bottom_show = true;
            }else{
              if(_index == 0){
                this.getMessage();
              }else{
                this.getAppMessage();
              }
            }
          }

        }
      },

      /*删除*/
      DestroyCart(item) {
        let caid = [];
        // for(let i = 0; i < this.cart_list.length; i ++) {
        //   for(let j = 0; j < this.cart_list[i].cart.length; j ++) {
        //     if(this.cart_list[i].cart[j].active) {
        //       caid.push(this.cart_list[i].cart[j].caid);
        //     }
        //   }
        // }
        caid.push(item.caid);
        if(caid.length > 0) {
          MessageBox.confirm('确认删除吗?').then(() => {
            this.$http.post(this.$api.cart_destroy + '?token=' + localStorage.getItem('token'), { caids: caid }).then(res => {
              if(res.data.status == 200){
                this.page_info.page_num = 1;
                this.total_count = 1;
                this.getAppMessage();
                this.allRadio = false;
              }
            });
          }).catch(() => {

          });
        }else {
          Toast("请先选择商品");
        }
      },
      //点击以后重置滑动事件相关
      skip(){
        if( this.checkSlide() ){
          this.restSlide();
        }
      },
      //滑动开始
      touchStart(e){
        // 记录初始位置
        this.startX = e.touches[0].clientX;
      },
      //滑动结束
      touchEnd(e){
        // 当前滑动的父级元素
        let parentElement = e.currentTarget.parentElement;
        // 记录结束位置
        this.endX = e.changedTouches[0].clientX;
        // 左滑
        if( parentElement.dataset.type == 0 && this.startX - this.endX > 30 ){
          this.restSlide();
          parentElement.dataset.type = 1;
        }
        // 右滑
        if( parentElement.dataset.type == 1 && this.startX - this.endX < -30 ){
          this.restSlide();
          parentElement.dataset.type = 0;
        }
        this.startX = 0;
        this.endX = 0;
      },
      //判断当前是否有滑块处于滑动状态
      checkSlide(){
        let listItems = document.querySelectorAll('.m-shop-product');
        for( let i = 0 ; i < listItems.length ; i++){
          if( listItems[i].dataset.type == 1 ) {
            return true;
          }
        }
        return false;
      },
      //复位滑动状态
      restSlide(){
        let listItems = document.querySelectorAll('.m-shop-product');
        // 复位
        for( let i = 0 ; i < listItems.length ; i++){
          listItems[i].dataset.type = 0;
        }
      },
      // 导航点击
      navClick(index) {
        this.page_info.page_num = 1;
        this.total_count = 0;
        this.bottom_show = false;
        let arr = [].concat(this.nav_list);
        if(arr[index].active && arr[index].count == 0) {
          return false;
        }
        for(let i = 0; i < arr.length; i ++) {
          arr[i].active = false;
        }
        arr[index].active = true;
        this.nav_list = [].concat(arr);
        this.page_info.page_num = 1;
        if(index == 1){
          this.getAppMessage();
        }else if(index == 0){
          this.getMessage()
        }
      },
    }
  }
</script>
<style lang="less" rel="stylesheet/less" >
  @import "../../../common/css/index";

  .m-my-message{
    width: 100%;
    min-height: 100vh;
    background-color: #ffffff;
    overflow-x: hidden;
    position: relative;
    .m-shop-content{
      padding: 0 0 200px 0;
      text-align: left;
      .m-shop-title{
        .flex-row(space-between);
        padding: 20px 0;
        .m-title{
          font-size: 38px;
          font-weight: bold;
        }
      }
      .m-p{
        padding: 0 0 40px;
      }
      .m-avator-img{
        display: block ;
        width: 80px;
        height: 80px;
        background-color: #edb3b1;
        margin-right: 30px;
      }
      .m-supplier-item{
        display: flex;
        flex-flow: row;
        align-items: flex-start;
        justify-content: flex-start;
        width: 750px;
        box-sizing: border-box;
        margin-top: 20px;
        padding: 20px 30px;
        background-color: #fff;
        border-bottom: 10px solid #F4F4F4;
        h3{
          font-size: 28px;
          font-weight: 400;
        }
      }
      .m-icon-more{
        display: inline-block;
        width: 23px;
        height: 23px;
        background: url("/static/images/icon-more.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 25px;
        vertical-align: text-top;
      }
      .m-shop-store-name{
        font-weight: 400;
      }
      .m-shop-product{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
        margin-top: 20px;
        .m-delete{
          width: 144px;
          height: 121px;
          line-height: 121px;
          background: #D83A3A;
          font-size: 28px;
          color: #fff;
          text-align: center;
          position: absolute;
          top:0;
          right: -147px;
        }
        .m-product-info{
          display: flex;
          flex-flow: row;
          align-items: flex-start;
          justify-content: flex-start;
          width: 750px;
          box-sizing: border-box;
          padding: 20px 30px;
          background-color: #fff;
          border-bottom: 1px solid #F2F2F2;
          .m-text-info{
            width: 570px;
            font-size: 28px;
            .m-grey{
              font-size: 20px;
            }
            .m-msg-text{
              display: block;
              width: 500px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .m-count{
              display: block;
              width: 30px;
              height: 30px;
              line-height: 30px;
              border-radius: 50%;
              background-color: #D83A3A;
              color: #fff;
            }
          }
        }
        &.m-shop-product[data-type="0"]{
          transform: translate3d(0,0,0);
        }
        &.m-shop-product[data-type="1"]{
          transform: translate3d(-147px,0,0);
        }
      }
      .m-in-message{
        margin-top: 30px;
        .m-one-message{
          background-color: #fff;
          padding: 20px 30px;
          border-bottom: 1px solid #F2F2F2;
          font-size: 28px;
          color: #000000;
          .m-one-message-content{
            padding: 30px 0;
            color: #666666;
            img{
              display: block;
              width: 680px;
              height: 400px;
            }
          }
        }
      }
    }

  }
</style>
