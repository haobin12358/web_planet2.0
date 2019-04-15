<template>
  <div>
    <!--顶部左上角买家、店主身份切换-->
    <span class="m-icon-home" @click="buyerStore" v-if="buyer_store"></span>

    <mt-tabbar v-model="selected" :fixed="true" v-if="is_weixin">
      <template v-for="(item,index) in tabbar" >
        <mt-tab-item :id="item.name" >
          <img slot="icon" :src="item.active_icon" v-if="item.name == selected">
          <img slot="icon" :src="item.icon" v-else>
          {{item.name}}
        </mt-tab-item>
      </template>
    </mt-tabbar>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../common/js/common';
  import axios from 'axios';
  import api from '../../api/api';
  import { Toast } from 'mint-ui';

  export default {
    data() {
      return {
        name: '',
        selected: this.$store.state.tabbar_select,
        tabbar: this.$store.state.tabbar_buyer,
        // tabbar: this.$store.state.tabbar_store,
        buyer_store: true,
        is_weixin: true
      }
    },
    components: {},
    methods: {
      // 左上角买家首页和卖家首页的切换
      buyerStore() {
        if(this.selected == this.$store.state.tabbar_buyer[0].name) {       // 目前在买家版首页
          axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
            if(res.data.status == 200) {
              if(res.data.data.uslevel == "1") {            // 1 - 买家 - 去商家大礼包list页面
                this.$router.push("/giftBox");
              }else if(res.data.data.uslevel == "2") {      // 2 - 卖家 - 去卖家版首页
                this.tabbar = this.$store.state.tabbar_store;
                this.selected = this.tabbar[0].name;
                this.$router.push("storekeeper");
                // this.$router.push("material/circle");
              }else if(res.data.data.uslevel == "3") {      // 3 - 申请成为卖家中
                this.$router.push("storekeeper/applyOwner");
              }else if(res.data.data.uslevel == "4") {      // 4 - 已购买大礼包，但是未认证 - 去认证
                Toast('请完成店主身份认证');
                this.$router.push("storekeeper/IDCardApprove");
              }
            }
          });
        }else if(this.selected == this.$store.state.tabbar_store[0].name) {     // 目前在卖家版首页
          this.tabbar = this.$store.state.tabbar_buyer;
          this.selected = this.tabbar[0].name;
          this.$router.push("/selected");
        }
      }
    },
    mounted() {
      // 如果是买家版的精选或者店主版的素材页，则显示身份切换的左上角按钮
      if(window.location.hash.indexOf("storekeeper") == 2 || window.location.hash.indexOf("selected") == 2) {
      // if(window.location.hash.indexOf("material/circle") == 2 || window.location.hash.indexOf("selected") == 2) {
        this.buyer_store = true;
      }else {
        this.buyer_store = false;
      }
      // this.selected = '精选';
      this.selected = document.title;
      let selectedUrl = window.location.href.split('#/')[1];
      // 当前在买家版
      for(let i = 0; i < this.$store.state.tabbar_buyer.length; i ++) {
        if(selectedUrl == this.$store.state.tabbar_buyer[i].url) {
          this.tabbar = this.$store.state.tabbar_buyer;
        }
      }
      // 当前在卖家版
      for(let i = 0; i < this.$store.state.tabbar_store.length; i ++) {
        if(selectedUrl == this.$store.state.tabbar_store[i].url){
          this.tabbar = this.$store.state.tabbar_store;
        }
      }
    },
    computed:{
      select(){
        return this.$store.state.tabbar_select
      },
      tabbars(){
        return this.$store.state.tabbar_store;
      }
    },
    watch: {
      selected: function (val, oldVal) {
        if(val == "精选" || val == "店主") {
        // if(val == "精选" || val == "素材") {
          this.buyer_store = true;
        }else {
          this.buyer_store = false;
        }
        // this.$route.meta.keepAlive = !this.$route.meta.keepAlive;
        // this.$nextTick(()=>{
        //   this.$route.meta.keepAlive = !this.$route.meta.keepAlive;
        // });
        this.$store.state.tabbar_select = val;
        common.changeTitle(val);
        switch(val){
          case '素材':
            this.$router.push('/material/circle');
            break;
          case '会员':
            this.$router.push('/member');
            break;
          case '店主':
            this.$router.push('/storekeeper');
            break;
          case '精选':
            this.$router.push('/selected');
            break;
          case '圈子':
            this.$router.push('/circle');
            break;
          case '装备':
            this.$router.push('/equipment');
            break;
          case '活动':
            this.$router.push('/activity');
            break;
          case '购物车':
            this.$router.push('/shop');
            break;
          case '我的':
            this.$router.push('/personal');
            break;
        }
      },
      select: function (val) {
        this.selected = this.$store.state.tabbar_select
      },
      // 监听路由变化
      $route: {
        handler: function(val, oldVal) {
          if(val.path == '/activity') {
            this.is_weixin = common.isWeixin();
          }else {
            this.is_weixin = true;
          }
          switch (val.path) {
            case '/selected':
              this.selected = '精选';
              this.tabbar = this.$store.state.tabbar_buyer;
              break;
            case '/circle':
              if(localStorage.getItem('fresh')  && localStorage.getItem('token')) {
                this.$router.go(0);
                localStorage.removeItem('fresh');
              }
              this.selected = '圈子';
              this.tabbar = this.$store.state.tabbar_buyer;
              break;
            case '/activity':
              this.selected = '活动';
              this.tabbar = this.$store.state.tabbar_buyer;
              break;
            case '/shop':
              if(sessionStorage.getItem('shop')){
                this.$router.go(0)
                sessionStorage.removeItem('shop')
              }
              this.selected = '购物车';
              this.tabbar = this.$store.state.tabbar_buyer;
              break;
            case '/personal':
              this.selected = '我的';
              this.tabbar = this.$store.state.tabbar_buyer;
              break;
            case '/material/circle':
              this.selected = '素材';
              this.tabbar = this.$store.state.tabbar_store;
              break;
            case '/storekeeper':
              this.selected = '店主';
              this.tabbar = this.$store.state.tabbar_store;
              break;
          }
        },
        // 深度观察监听
        deep: true
      },
      tabbars:function () {
        this.tabbar =this.$store.state.tabbar;
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/css/index";

  .m-icon-home {
    /*border: 1px red solid;*/
    display: block;
    width: 50px;
    height: 50px;
    background: url("/static/images/icon-home.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 22px;
    left: 33px;
  }
</style>
