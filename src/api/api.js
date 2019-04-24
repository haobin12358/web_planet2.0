// const title = 'https://planet.daaiti.cn/api/v1/';
// const title = 'https://www.bigxingxing.com/api/v1/'; //正式
let title = '';
if(location.origin.indexOf('localhost') != -1){
   title = 'https://test.bigxingxing.com/api/v2/'; //测试
}else{
   title = `${location.origin}/api/v2/`
}

const api={
  login: title + 'user/login',                                   // 用户登录
  wx_login: title + 'user/wx_login',                             // 微信登录
  wx_login_silent: title + 'user/wx_login_silent',                             // 微信登录
  get_accesstoken : title + 'user/get_accesstoken',
  get_wxconfig: title + 'user/get_wxconfig',                     // 获取微信参数
  get_inforcode: title + 'user/get_inforcode',                   // 获取验证码
  bing_telphone: title + 'user/bing_telphone',                   // 绑定手机号
  auth_fresh: title + 'auth/fresh',                              // 刷新token
  secret_usid: title + 'user/secret_usid',                       // 获取base64编码后的usid

  category_list: title + 'category/list',                        // 获取分类-装备首页商品列表页
  product_get: title + 'product/get',                            // 获取单条商品-商品详情
  product_list: title + 'product/list',                          // 获取商品列表
  brand_list: title + 'brand/list',                              // 获取商品列表
  search_history: title + 'product/search_history',              // 用户搜索记录
  guess_search: title + 'product/guess_search',                  // 推荐
  del_search_history: title + 'product/del_search_history',      // 删除搜索记录
  get_evaluation: title + 'order/evaluation',                    // 获取商品评价
  get_promotion: title +'product/get_promotion',//推广图
  cart_create: title + 'cart/create',                            // 添加购物车
  cart_update: title +'cart/update',                             // 更新购物车
  cart_list: title + 'cart/list',                                // 购物车列表
  cart_destroy: title + 'cart/destroy',                          // 清空购物车
  order_create: title + 'order/create',                          // 创建订单
  order_delete: title + 'order/delete',                          // 创建订单
  order_coupons: title + 'order/order_coupons',                  // 获取提交订单时候可以使用的优惠券
  order_list: title + 'order/list',                              // 获取订单列表
  order_pay: title + 'order/pay',                                // 订单支付
  order_get: title + 'order/get',                                // 订单详情
  refund_create: title +'refund/create',                         // 申请退款
  order_count: title + 'order/count',                            // 订单数量
  get_preview_commision: title + 'order/get_preview_commision',  // 订单页获取预计佣金
  get_logistic: title + 'logistic/get',                          // 获取物流信息
  cancle_order: title + 'order/cancle',                          // 取消订单
  list_dispute_type: title + 'refund/list_dispute_type',         // 获取退款原因
  refund_cancel: title + 'refund/cancle',                        // 取消(撤销)售后申请
  refund_send: title + 'refund/send',                            // 买家发货(申请退货退款审核通过后,买家发货)
  list_company: title + 'logistic/list_company',                 // 获取快递公司列表
  order_confirm: title + 'order/confirm',                        // 订单确认收货
  create_evaluation: title + 'order/create_evaluation',          // 订单评价
  del_evaluation: title + 'order/del_evaluation',                // 删除订单评价

  items_list: title + 'items/list',                              // 获取标签列表
  scene_list: title + 'scene/list',                              // 获取场景列表
  list_banner_index: title + 'index/list_banner',                // 获取首页轮播图
  list_brand_index: title + 'index/list_brand',                  // 获取首页品牌
  list_product_index: title +'index/list_product',               // 获取首页显示的品牌商品
  brand_recommend_index : title + 'index/brand_recommend',       // 获取首页品牌模块数据

  get_home : title + 'user/get_home',                            // 获取用户个人信息
  upgrade_agent : title + 'user/upgrade_agent',                  // 店主申请
  check_idcode : title + 'user/check_idcode',                    // 实名认证 - 身份证
  get_identifyinginfo : title + 'user/get_identifyinginfo',      // 获取个人身份证详情
  get_cash_notes : title + 'user/get_cash_notes',                // 获取提现记录
  update_user : title + 'user/update_user',                      // 更新用户信息
  get_user_integral : title + 'user/get_user_integral',          // 获取星币列表
  user_sign_in : title + 'user/user_sign_in',                    // 用户签到
  get_discount : title + 'user/get_discount',                    // 获取优惠券中心顶部数据
  get_all_quest : title + 'qa/get_all_quest',                    // 获取所有的问题
  get_answer : title + 'qa/get_answer',                          // 通过问题id获取答案

  list_user_coupon : title + 'coupon/list_user_coupon',          // 获取用户个人的优惠券
  coupon_list : title + 'coupon/list',                           // 获取优惠券列表
  coupon_fetch : title + 'coupon/fetch',                         // 领取优惠券

  create_news: title + 'news/create_news',                       // 发布资讯
  get_all_news: title + 'news/get_all_news',                     // 获取资讯列表
  get_news_content: title +'news/get_news_content',              // 获取资讯详情
  favorite_news: title + 'news/favorite_news',                   // 资讯点赞
  del_news: title + 'news/del_news',                             // 删除自己的资讯
  create_comment: title + 'news/create_comment',                 // 发表评论
  favorite_comment: title +'news/favorite_comment',              // 评论点赞
  del_comment: title + 'news/del_comment',                       // 删除评论
  get_news_comment: title + 'news/get_news_comment',             // 获取资讯评论
  news_banner: title + 'news/banner',                            // 获取素材页轮播（店主）

  list_with_group: title + 'brand/list_with_group',              // 获取品牌列表
  get_one_brand: title + 'brand/get',                            // 获取一个品牌

  add_address: title + 'user/add_address',                       // 添加用户收货地址
  get_all_address: title + 'user/get_all_address',               // 获取用户所有地址
  get_one_address: title + 'user/get_one_address',               // 获取单条地址记录
  update_address: title + 'user/update_address',                 // 修改用户收货地
  get_provinces: title + 'address/get_provinces',                // 获取所有省份
  get_citys: title + 'address/get_citys',                        // 获取省份下城市
  get_areas: title + 'address/get_areas',                        // 获取城市下的区县

  create_guess_num: title + 'guess_num/create',                  // 查看猜数字单日参与记录
  get_guess_num: title + 'guess_num/get',                        // 参与猜数字
  recv_award: title + 'guess_num/recv_award',                    // 领取猜数字奖品
  history_join: title + 'guess_num/history_join',                // 获取历史参与结果(以月为单位)
  today_gnap: title + 'guess_num/today_gnap',                    // 用户获取今天猜数字活动所有商品
  guess_num_get_discount: title + 'guess_num/get_discount',      // 猜数字活动-获取折扣价
  get_commodity: title + 'commodity/get',                        // 获取试用商品列表
  get_commodity_detail: title + 'commodity/get_commodity',       // 获取试用商品详情
  activity_list: title + 'activity/list',                        // 获取正在进行中的活动
  get_activity: title + 'activity/get',                          // 魔盒礼盒与竞猜活动详情 - 规则
  join_magicbox: title + 'magicbox/join',                        // 参与魔盒活动(获取分享所需的url参数)
  open_magicbox: title + 'magicbox/open',                        // 好友帮拆魔盒
  magicbox_recv_award: title + 'magicbox/recv_award',            // 领取魔术礼盒奖品
  create_order: title + 'commodity/create_order',                // 试用商品下单
  fresh_man_list: title + 'fresh_man/list',                      // 获取新人首单商品列表
  fresh_man_get: title + 'fresh_man/get',                        // 新人首单商品详情
  add_order: title + 'fresh_man/add_order',                      // 购买新人商品(返回支付参数)

  upload_file: title + 'file/upload',                            // 上传图片
  get_share_params: title + 'shareparams/get',                   // 获取微信分享参数

  get_agent_center: title + 'user/get_agent_center',             // 获取卖家版个人中心
  apply_cash: title + 'user/apply_cash',                         // 提现申请
  get_bankname: title + 'user/get_bankname',                     // 根据卡号获取银行名称
  get_salesvolume_all: title + 'user/get_salesvolume_all',       // 获取团队销售额
  get_agent_commission: title + 'user/get_agent_commission_list',// 获取店主收益详情
  list_act_code: title + 'act_code/list_act_code',               // 获取个人激活码列表
  act_code_list: title + 'act_code/get_list',                    // 获取激活码申请列表
  get_code_rule: title + 'act_code/get_rule',                    // 获取个人激活码购买规则(购买申请页)
  act_code_apply: title + 'act_code/apply',                      // 购买激活码申请 - 打款凭证

  timelimited_list_product:title + 'timelimited/list_product',//获取限时活动列表
  timelimited_get:title +'timelimited/get',                      //获取限时活动详情
  timelimited_list_activity:title +'timelimited/list_activity',//获取所有限时活动


  collection_collect: title +'collection/collect',         ///收藏
  get_home_top: title + 'user/get_home_top',             ///用户主页数据
  collection_show: title + 'collection/show',           //获取关注的人和粉丝
  check_code: title +'user/check_code',        //验证手机
  set_paycode: title + 'user/set_paycode',    //设置密码
  integral_list: title +'integral/list',       //获取星币商城列表
  integral_get: title +'integral/get',         //获取星币商城详情
  integral_order: title + 'integral/order',     //星币下单
  list_hypermarket_banner: title +'index/list_hypermarket_banner', //获取商城顶部轮播图
  integral_pay_preview: title +'order/integral_pay_preview',  ///可抵用星币数
};


export default api
