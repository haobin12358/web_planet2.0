import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

let store= new Vuex.Store({
  state: {
    route: null,
    now: null,
    token: '',
    show_login:false,
    version:'1.2.1',
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
        name:'精选',
        icon:'/static/images/footer/icon-material.png',
        active_icon:'/static/images/footer/icon-material-active.png',
        url:'selected'
      },{
        name:'圈子',
        icon:'/static/images/footer/icon-circle.png',
        active_icon:'/static/images/footer/icon-circle-active.png',
        url:'circle'
      },{
        name:'活动',
        icon:'/static/images/footer/icon-activity.png',
        active_icon:'/static/images/footer/icon-activity-active.png',
        url:'activity'
      },/*{
        name:'装备',
        icon:'/static/images/footer/icon-equipment.png',
        active_icon:'/static/images/footer/icon-equipment-active.png',
        url:'equipment'
      },*/{
        name:'购物车',
        icon:'/static/images/footer/icon-member.png',
        active_icon:'/static/images/footer/icon-member-active.png',
        url:'shop'
      },{
        name:'我的',
        icon:'/static/images/footer/icon-storekeeper.png',
        active_icon:'/static/images/footer/icon-storekeeper-active.png',
        url:'personal'
      }
    ],
    // tabbar_select:'素材'
    tabbar_select:'精选'
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
