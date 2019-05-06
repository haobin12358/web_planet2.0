import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

let store= new Vuex.Store({
  state: {
    route: null,
    now: null,
    token: '',
    show_login:false,
    version:'1.7.8',
    shop_num: -1,
    tabbar_store: [
      /*{
        name:'素材',
        icon:'/static/images/footer/icon-material.png',
        active_icon:'/static/images/footer/icon-material-active.png',
        url:'material/circle'
      },*//*{
        name:'会员',
        icon:'/static/images/footer/icon-member.png',
        active_icon:'/static/images/footer/icon-member-active.png',
        url:'member'
      },*/{
        name:'店主',
        icon:'/static/images/footer/icon-storekeeper.png',
        active_icon:'/static/images/footer/icon-storekeeper-active.png',
        url:'storekeeper'
      }],


      tabbar_buyer:[{
        name:'首页',
        icon:'/static/images/newFooter/icon-index.png',
        active_icon:'/static/images/newFooter/icon-index-active.png',
        url:'selected'
      },{
        name:'发现',
        icon:'/static/images/newFooter/icon-circle.png',
        active_icon:'/static/images/newFooter/icon-circle-active.png',
        url:'circle'
      },{
        name:'发布',
        icon:'/static/images/newFooter/icon-edit.png',
        active_icon:'/static/images/newFooter/icon-edit-active.png',
        url:'activity'
      },/*{
        name:'装备',
        icon:'/static/images/footer/icon-equipment.png',
        active_icon:'/static/images/footer/icon-equipment-active.png',
        url:'equipment'
      },*/{
        name:'商城',
        icon:'/static/images/newFooter/icon-shop.png',
        active_icon:'/static/images/newFooter/icon-shop-active.png',
        url:'newProduct'
      },{
        name:'我的',
        icon:'/static/images/newFooter/icon-personal.png',
        active_icon:'/static/images/newFooter/icon-personal-active.png',
        url:'newPersonal'
      }
    ],
    // tabbar_select:'素材'
    tabbar_select:'首页'
  },
  mutations: {
    add(state,route) {
      state.tabbar_select=route;
    },
    remove(state,name){
      Vue.delete(state.route,name)
      // delete state.route[name]

      // this.$store.commit('remove',name)调用此方法
    }
  }
});


export default store
