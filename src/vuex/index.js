import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

let store= new Vuex.Store({
  state: {
    route: null,
    now: null,
    token: '',
    show_login:false,
    version:'2.1.1',
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
        name:'品牌',
        icon:'/static/images/newFooter/icon-brand.png',
        active_icon:'/static/images/newFooter/icon-brand-active.png',
        url:'brandList'
      },
      //   {
      //   name:'发布',
      //   icon:'/static/images/newFooter/icon-edit.png',
      //   active_icon:'/static/images/newFooter/icon-edit-active.png',
      //   url:'activity'
      // },/
      //   {
      //   name:'装备',
      //   icon:'/static/images/footer/icon-equipment.png',
      //   active_icon:'/static/images/footer/icon-equipment-active.png',
      //   url:'equipment'
      // },
        {
        name:'购物车',
        icon:'/static/images/newFooter/icon-shop.png',
        active_icon:'/static/images/newFooter/icon-shop-active.png',
        url:'shop'
      },{
        name:'我的',
        icon:'/static/images/newFooter/icon-personal.png',
        active_icon:'/static/images/newFooter/icon-personal-active.png',
        url:'newPersonal'
      }
    ],
    // tabbar_select:'素材'
    tabbar_select:'首页',
    all_data:null,
    isChange:false,
    activity_data:null,
    activity_change:false,
    activity_scroll:0,
    second_data:null,
    second_change:false,
    second_scroll:0
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
