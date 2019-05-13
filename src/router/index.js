import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/index';

Vue.use(Router)


export const constantRouterMap = [
  // { path: '/login', component: () => import('../views/login/login'), hidden: true },
  // { path: '/register', component: () => import('../views/login/register'),hidden: true  },
  // { path: '/forget', component: () => import('../views/login/forget'),hidden: true  },
  { path: '/first', component: () => import('../views/login/first'), hidden: true },
  { path: '/search', component: () => import('../views/search/search'), hidden: true },
  // 店主版 - 素材
  {
    path: '/material/circle',
    component: Layout,
    redirect: 'material/circle',
    children: [
      { path: '/material', component: () => import('../views/store/material/index'), hidden: true },
      { path: '/material/circle', component: () => import('../views/store/material/circle'), meta: { keepAlive: true },name:'/material/circle', hidden: true }
    ],
  },
  // 店主版 - 会员
  {
    path: '/member',
    component: Layout,
    redirect: 'member',
    children: [
      { path: '/member', component: () => import('../views/store/member/index'), hidden: true }
    ],
  },
  // 店主版 - 会员 - 商品详情
  { path: '/member/productDetail', component: () => import('../views/store/member/productDetail'), hidden: true },
  // 店主版 - 店主
  {
    path: '/storekeeper',
    component: () => import('../views/store/storekeeper/index'),
    meta: { keepAlive: false },
    // children: [{
    //   path: '/storekeeper', component: () => import('../views/store/storekeeper/index'), meta: { keepAlive: false }, hidden: true }
    // ],
  },
  // 店主版 - 申请成为店主
  { path: '/storekeeper/applyOwner', component: () => import('../views/store/storekeeper/applyOwner'), hidden: true },
  // 店主版 - 申请成为店主 - 身份证认证
  { path: '/storekeeper/IDCardApprove', component: () => import('../views/store/storekeeper/IDCardApprove'), hidden: true },
  // 店主版 - 店主 - 收益详情
  { path: '/storekeeper/incomeDetail', component: () => import('../views/store/storekeeper/incomeDetail'), hidden: true },
  // 店主版 - 店主 - 活动管理
  { path: '/storekeeper/activityManagement', component: () => import('../views/store/storekeeper/activityManagement'), hidden: true },
  // 店主版 - 店主 - 粉丝管理
  { path: '/storekeeper/fansManagement', component: () => import('../views/store/storekeeper/fansManagement'), hidden: true },
  // 店主版 - 店主 - 团队管理
  { path: '/storekeeper/group', component: () => import('../views/store/storekeeper/group'), hidden: true },
  // 店主版 - 店主 - 购买激活码
  { path: '/storekeeper/activationCode', component: () => import('../views/store/storekeeper/activationCode'), hidden: true },
  // 店主版 - 店主 - 我的激活码
  { path: '/storekeeper/myActivationCode', component: () => import('../views/store/storekeeper/myActivationCode'), hidden: true },
  // 店主版 - 店主 - 提现
  { path: '/storekeeper/withDraw', component: () => import('../views/store/storekeeper/withDraw.vue'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: 'selected',
    children: [{ path: '/selected', component: () => import('../views/buyer/selected/index'), meta: { keepAlive: true },name:'/selected', hidden: true }
    ],
  },
  { path: '/gift', component: () => import('../views/buyer/selected/gift'), hidden: true },
  { path: '/giftBox', component: () => import('../views/buyer/selected/giftBox'), hidden: true },
  { path: '/scene', component: () => import('../views/buyer/selected/scene'), hidden: true },
  { path: '/brandList', component: () => import('../views/buyer/selected/brandList'), hidden: true },
  { path: '/brandDetail', component: () => import('../views/buyer/selected/brandDetail'), hidden: true },
  { path: '/activityDetail', component: () => import('../views/buyer/selected/activityDetail'), hidden: true },
  {
    path: '/circle',
    component: Layout,
    redirect: 'circle',
    children: [
      { path: '/circle', component: () => import('../views/buyer/circle/index'),  meta: { keepAlive: true },name:'/circle', hidden: true }
    ],
  },
  { path: '/circle/detail', component: () => import('../views/buyer/circle/detail'), hidden: true },
  { path: '/circle/circleSort', component: () => import('../views/buyer/circle/circleSort'), hidden: true },
  { path: '/circle/createTopic', component: () => import('../views/buyer/circle/createTopic'), hidden: true },
  { path: '/equipment/detail', component: () => import('../views/buyer/newProduct/detail'), hidden: true , meta: { keepAlive: true },name:'/equipment/detail'},
  // { path: '/product', component: () => import('../views/buyer/product/product'), meta: { keepAlive: true }, hidden: true },
  { path: '/productDetail', name: 'productDetail', component: () => import('../views/buyer/newProduct/productDetail'), meta: { keepAlive: false }, hidden: true },
  { path: '/evaluate', component: () => import('../views/buyer/newProduct/evaluate'), hidden: true },
  {
    path: '/newProduct',
    component: Layout,
    redirect: 'newProduct',
    children: [
      { path: '/newProduct', component: () => import('../views/buyer/newProduct/index'),meta: { keepAlive: true},name:'newProduct' , hidden: true}
    ],
  },
  { path: '/searchProduct', component: () => import('../views/buyer/newProduct/search'), hidden: true },
  { path: '/shop', component: () => import('../views/buyer/shop/index'), meta: { keepAlive: true }, hidden: true },
  { path: '/submitOrder', component: () => import('../views/buyer/shop/submitOrder'), hidden: true },
  { path: '/orderList', component: () => import('../views/buyer/shop/orderList'), meta: { keepAlive: false }, hidden: true },
  { path: '/addComment', component: () => import('../views/buyer/product/addComment'), hidden: true },
  { path: '/logisticsInformation', component: () => import('../views/buyer/shop/logisticsInformation'), hidden: true },
  { path: '/orderDetail', component: () => import('../views/buyer/shop/orderDetail'), hidden: true },
  { path: '/selectBack', component: () => import('../views/buyer/shop/selectBack'), hidden: true },
  { path: '/editBack', component: () => import('../views/buyer/shop/editBack'), hidden: true },
  { path: '/backDetail', component: () => import('../views/buyer/shop/backDetail'), hidden: true },
  {
    path: '/personal',
    component: Layout,
    redirect: 'personal',
    children: [
      { path: '/newPersonal', component: () => import('../views/buyer/personal/newIndex'), meta: { keepAlive: true },name:'newPersonal', hidden: true }
    ],
  },
  { path: '/personal/code', component: () => import('../views/buyer/personal/code'), hidden: true },
  // 竞猜记录
  { path: '/personal/guess', component: () => import('../views/buyer/personal/guess'), hidden: true },
  { path: '/personal/history', component: () => import('../views/buyer/personal/history'), hidden: true },
  { path: '/personal/codeHistory', component: () => import('../views/buyer/personal/codeHistory'), hidden: true },
  { path: '/personal/codeHistory/codeDetail', component: () => import('../views/buyer/personal/codeDetail.vue'), hidden:true },
  // 售后
  { path: '/personal/afterSales', component: () => import('../views/buyer/personal/afterSales'), meta: { keepAlive: false }, hidden: true },
  { path: '/personal/about', component: () => import('../views/buyer/personal/about'), hidden: true },
  { path: '/personal/setUp', component: () => import('../views/buyer/personal/setUp'), hidden: true },
  { path: '/personal/personalInfo', component: () => import('../views/buyer/personal/personalInfo'), hidden: true },
  { path: '/personal/addressManagement', component: () => import('../views/buyer/personal/addressManagement'), hidden: true },
  { path: '/personal/addAddress', component: () => import('../views/buyer/personal/addAddress'), hidden: true },
  { path: '/personal/coupon', component: () => import('../views/buyer/personal/coupon'), hidden: true },
  { path: '/personal/integral', component: () => import('../views/buyer/personal/integral'), hidden: true },
  { path: '/personal/serviceCenter', component: () => import('../views/buyer/personal/serviceCenter'), hidden: true },
  { path: '/personal/serviceCenterDetail', component: () => import('../views/buyer/personal/serviceCenterDetail'), hidden: true },
  { path: '/personal/safeCenter', component: () => import('../views/buyer/personal/safeCenter'), hidden: true },
  { path: '/personal/editInput', component: () => import('../views/buyer/personal/editInput'), hidden: true },
  { path: '/personal/couponCenter', component: () => import('../views/buyer/personal/couponCenter'), hidden: true },
  //个人主页
  { path: '/personal/mainIndex', component: () => import('../views/buyer/personal/mainIndex'), hidden: true },
  { path: '/personal/otherMain', component: () => import('../views/buyer/personal/otherMain'), hidden: true },
  { path: '/collect', component: () => import('../views/buyer/personal/collect'), hidden: true },
  { path: '/personal/starProduct', component: () => import('../views/buyer/starProduct/starProduct'), hidden: true },  ///星币商城
  { path: '/personal/orderStar', component: () => import('../views/buyer/starProduct/orderStar'), hidden: true },  ///星币商城下单
  { path: '/personal/starDetail', component: () => import('../views/buyer/starProduct/starDetail'), hidden: true },  ///星币商城记录
  { path: '/personal/starProductDetail', component: () => import('../views/buyer/starProduct/starProductDetail'), hidden: true },  ///星币商品详情
  { path: '/personal/setPwd', component: () => import('../views/buyer/personal/setPwd'), hidden: true },  ///设置密码
  { path: '/personal/myWallet', component: () => import('../views/buyer/personal/myWallet'), hidden: true ,meta: { keepAlive: true },name:'myWallet'},  ///设置密码
  { path: '/personal/followUser', component: () => import('../views/buyer/personal/followUser'), hidden: true },  ///关注

  {
    path: '/circle',
    component: Layout,
    redirect: '',
    children: [{ path: 'newEdit', component: () => import('../views/buyer/circle/newEdit'),hidden: true , meta: { keepAlive: true },name:'newEdit'}
    ],
  },
  // 活动模块
  { path: '/activity', component: () => import('../views/buyer/activity/index'), hidden: true},
  { path: '/limitedTime', component: () => import('../views/buyer/activity/limitedTime'), hidden: true },            // 限时活动
  { path: '/dailyGuess', component: () => import('../views/buyer/activity/dailyGuess'), hidden: true },        // 每日竞猜
  { path: '/guessProduct', component: () => import('../views/buyer/activity/guessProduct'), hidden: true },    // 每日竞猜的商品列表
  { path: '/guessProductDetail', component: () => import('../views/buyer/activity/guessProductDetail'), hidden: true },    // 每日竞猜的商品详情
  { path: '/pandora', component: () => import('../views/buyer/activity/pandora'), hidden: true },              // 魔法礼盒
  // { path: '/activityProduct', component: () => import('../views/buyer/activity/activityProduct'), hidden: true },      // 免费试用 - 商品
  { path: '/activityProductDetail', component: () => import('../views/buyer/activity/activityProductDetail'), hidden: true },        // 免费试用 - 商品详情
  { path: '/activityOrder', component: () => import('../views/buyer/activity/activityOrder'), meta: { keepAlive: false }, hidden: true },        // 活动订单
  { path: '/limitedProductDetail', component: () => import('../views/buyer/activity/limitedProductDetail'), hidden: true },        // 免费试用 - 商品详情


  { path: '/systemfix', component: () => import('../views/systemfix'), hidden: true },
];

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: constantRouterMap
})
