<template>
  <div class="m-activity" ref="activity" @touchmove="touchMove">
    <!--<div class="m-activity-top-bg"></div>-->

    <img :src="selecte_nav.actoppic" class="m-activity-top-img" alt="">
    <nav-list :navlist="activityList" :is-scroll="true" :is-act="true" @navClick="navClick"></nav-list>
    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <div  v-if="selecte_nav.actype == 4">
        <div class="m-one-limit" v-if="hot_list.length >0">
          <div class="m-limit-title">
            <span>爆款预售</span>
<!--            <div class="m-flex-end">-->
<!--              <span class="m-active">距离开始</span>-->
<!--              <span class="m-activity-time"><img src="/static/images/index/icon-time.png" class="m-icon-time" alt="">12.34</span>-->
<!--            </div>-->
          </div>
          <div class="m-hot">
           <div class="m-hot-left">
             <p class="m-hot-hot">HOT</p>
             <p class="m-line-left"></p>
             <p> 好物推荐</p>
           </div>
            <div class="m-hot-right">
             <ul>
               <li v-for="(item,index) in hot_list" @click="changeRoute('/productDetail',item)">
                 <img :src="item.prmainpic" class="m-hot-product-img" alt="">
                 <p>{{item.prtitle}}</p>
                 <p class="m-num">¥{{item.prprice | money}}</p>
               </li>
             </ul>
            </div>
          </div>
        </div>
        <div class="m-one-limit" v-for="(items,index) in limit_list" v-if="items.product_list.length >0">
          <div class="m-limit-title">
            <span>{{items.tlaname}}</span>
            <div class="m-flex-end">
              <span class="m-active" v-if="items.duration_start">距离开始</span>
              <span class="m-active" v-else-if="items.duration_end">距离结束</span>
              <span class="m-active" v-else>已结束</span>
              <span class="m-activity-time"><img src="/static/images/index/icon-time.png" class="m-icon-time" alt="">{{items.show_time}}</span>
            </div>
          </div>
          <div class="m-limit-center-content">
            <ul class="m-center-product-ul">
              <li v-for="(item,i) in items.product_list" @click="changeRoute('/limitedProductDetail',item)">
                <img :src="item.prmainpic" class="m-product-img" alt="">
                <p class="m-product-name">{{item.prtitle}}</p>
                <p class="m-flex-between">
                  <span class="m-num">¥{{item.tlpprice}}</span>
                  <s>¥{{item.prlineprice}}</s>
                </p>
              </li>
            </ul>
            <p class="m-more-text" @click="changeRouteLimit('/limitedTime',items)">
              <span>更多折扣</span>
              <img src="/static/images/newpersonal/icon-more.png" class="m-icon-more" alt="">
            </p>
          </div>
        </div>
      </div>
      <div  v-if="selecte_nav.actype == 0">
        <div class="m-one-limit">
          <div class="m-limit-center-content">
            <ul class="m-center-product-ul">
              <li v-for="(item,index) in new_list" @click="changeRoute('/activityProductDetail',item,'new')">
                <img :src="item.prmainpic" class="m-product-img" alt="">
                <p class="m-product-name">{{item.prtitle}}</p>
                <p class="m-flex-between">
                  <span class="m-num">¥{{item.prprice | money}}</span>
                  <img src="/static/images/newActivity/icon-new.png"  class="m-label-img" alt="">
                </p>
              </li>

            </ul>
          </div>
        </div>
      </div>
      <div  v-if="selecte_nav.actype == 3">
        <div class="m-one-limit">
          <div class="m-limit-center-content">
            <ul class="m-center-product-ul">
              <li v-for="(item,index) in try_list" @click="changeRoute('/activityProductDetail',item,'try')">
                <img :src="item.tcmainpic" class="m-product-img" alt="">
                <p class="m-product-name">{{item.tctitle}}</p>
                <p class="m-flex-between">
                  <span class="m-num">{{item.zh_remarks}}</span>
                  <img src="/static/images/newActivity/icon-try.png"  class="m-label-img-try" alt="">
                </p>
              </li>

            </ul>
          </div>
        </div>
      </div>
      <div v-if="selecte_nav.actype == 1" class="m-guess-content">
       <div class="m-guess-box">
         <span class="m-label-left" @click="changeRouteGuess">商品</span>
         <span class="m-label-right" @click="rulePopup = true">规则</span>
         <!--星币规则popup-->
         <mt-popup class="m-rule-popup" v-model="rulePopup" pop-transition="popup-fade">
           <div class="m-rule-title">
             <!--            <div @click="rulePopup = false">取消</div>-->
             规则
           </div>
           <div class="m-rule-text">
             <p v-for="item in rule.acdesc">{{item}}</p>
           </div>
         </mt-popup>
         <div class="m-guess-text">

           <h3 class="m-guess-title">竞猜每日大盘 赢取户外装备</h3>
           <img src="/static/images/newActivity/guess-text.png" class="m-guess-text-image" alt="">
           <template >
             <p class="m-guess-time" v-if="hour && !submit">
               <span>距离本期竞猜结束还有</span>
               <span class="m-main-color">
                <span class="m-time-bg">{{correct_time[0]}}</span>:
                <span class="m-time-bg">{{correct_time[1]}}</span>:
                <span class="m-time-bg">{{correct_time[2]}}</span>
             </span>
             </p>
             <div class="m-num-box" v-if="hour || (!hour && submit)">
               <input ref="pwd" type="tel" maxlength="6" v-model="msg" v-if="hour && !submit" class="guess-num" unselectable="on"  autofocus />
               <ul class="m-input-box" @click="focus">
                 <li :class="msg.length == 0?'psd-blink':''" class="m-guess-num-input"><span v-if="msg.length > 0">{{msg[0]}}</span><s></s></li>
                 <li :class="msg.length == 1?'psd-blink':''" class="m-guess-num-input"><span v-if="msg.length > 1">{{msg[1]}}</span><s></s></li>
                 <li :class="msg.length == 2?'psd-blink':''" class="m-guess-num-input"><span v-if="msg.length > 2">{{msg[2]}}</span><s></s></li>
                 <li :class="msg.length == 3?'psd-blink':''" class="m-guess-num-input"><span v-if="msg.length > 3">{{msg[3]}}</span><s></s></li>
                 <li>.</li>
                 <li :class="msg.length == 4?'psd-blink':''" class="m-guess-num-input"><span v-if="msg.length > 4">{{msg[4]}}</span><s></s></li>
                 <li :class="msg.length == 5?'psd-blink':''" class="m-guess-num-input"><span v-if="msg.length > 5">{{msg[5]}}</span><s></s></li>
               </ul>
             </div>
             <div class="m-guess-btn" v-if="hour && !submit">
               <span @click=submitResult>确认竞猜</span>
             </div>
             <div class="m-guess-result" v-else>
               <p class="m-flex-center m-no-time" v-if="hour">
                 <span>还未到开盘时间，请耐心等待</span>
               </p>
               <p class="m-flex-center" v-if="!hour && record.correct_num">
                 <span>本期大盘指数：</span>
                 <span class="m-guess-result-num">{{record.correct_num.cnnum}}</span>
               </p>
               <p class="m-mr20" v-if="successPopup">
                 您猜对了<span class="m-main-color">{{record.correct_count}}</span>个数字
               </p>
<!--      ，可减免<span class="m-main-color">2</span>元         -->
               <p class="m-mr20" v-if="failPopup">
                 很遗憾， 上次竞猜失败，请再接再厉吧！
               </p>
               <p class="m-mr20" v-if="nonePopup">
                 本期未参与/昨日未开奖
               </p>
               <p v-if="successPopup">
                 <span class="m-guess-result-btn" @click="changeRouteGuess">前往选购</span>
               </p>
               <p v-if="failPopup ||( hour && submit)">
                 <span class="m-guess-result-btn" >我知道了</span>
               </p>
             </div>
           </template>
           <p class="m-guess-time" v-if="!hour && !submit">
             <span>本期竞猜活动已结束，请明天15：00点再参与！</span>
           </p>

         </div>
       </div>
      </div>
      <bottom-line v-if="bottom_show"></bottom-line>
    </mt-loadmore>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import navList from '../../../components/common/navlist';
  import bottomLine from '../../../components/common/bottomLine';
  import { Toast } from 'mint-ui';
  import wx from 'weixin-js-sdk';
  import wxapi from '../../../common/js/mixins';
  export default {
    name: 'activityIndex',
    data() {
      return {
        name: '',
        activityList: [],
        selecte_nav:{},
        page_info:{
          page_num:1,
          page_size:10
        },
        isScroll: true,
        total_count: 0,
        bottom_show: false,
        limit_list:[],
        new_list:[],
        hot_list:[],
        try_list:[],
      //  guess
        msg: "",               // 猜测的数字 2710.51
        result: "",            // 光标
        count: "",
        submit: false,         // 是否已提交
        successPopup: false,   // 猜对啦
        failPopup: false,      // 猜错啦
        hour: false,           // 当前的小时是否在竞猜时间内
        rule: { acdesc: [] },
        today: '',
        record: { price: '' },
        uaid: '',
        guess: {},
        correct_time:'',
        rulePopup:false,
        secret_usid:'',
        nonePopup:false
      }
    },
    components: {navList,bottomLine},
    watch: {
      msg(curVal) {
        if(/[^\d]/g.test(curVal)) {
          this.msg = this.msg.replace(/[^\d]/g, '');
        }
        if(this.msg.length == 6){
          // this.submitOrder();
        }
      },
    },
    beforeDestroy(){
      for(let i in this.limit_list){
        clearInterval(this.limit_list[i].timer);
      }
    },
    methods: {
      // 分享
      shareAct() {
        let items = this.selecte_nav;
        if(localStorage.getItem('token')) {
          let options = {
            title: items.acname,
            desc: items.acdesc,
            imgUrl: items.actoppic,       // 初步考虑用用户头像
            link: location.href.split('#')[0] + '?actype=' + items.actype
          };
          // if(!this.secret_usid){
            this.$http.get(this.$api.secret_usid + '?token=' + localStorage.getItem('token')).then(res => {
              if(res.data.status == 200) {
                this.secret_usid = res.data.data.secret_usid;
                options.link += '&secret_usid=' + res.data.data.secret_usid;
              }
            });
          // }
          // 倒计时
          const TIME_COUNT = 3;
          let count = TIME_COUNT;
          let time = setInterval(() => {
            if (count > 0 && count <= TIME_COUNT) {
              count --;
            } else {
              this.show_invite = false;
              clearInterval(time);
            }
          }, 1000);
          // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
          if(wx.updateAppMessageShareData) {
            wx.updateAppMessageShareData(options);
          }
          // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
          if(wx.updateTimelineShareData) {
            wx.updateTimelineShareData(options);
          }
          // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
          if(wx.onMenuShareAppMessage) {
            wx.onMenuShareAppMessage(options);
          }
          // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
          if(wx.onMenuShareTimeline) {
            wx.onMenuShareTimeline(options);
          }
        }else {
          // Toast('请登录后再试');
          // if(!localStorage.getItem('token')){
          //   let url = location.href.split('#')[0] + '?actype=' + items.actype
          //   // localStorage.setItem('login_to',url);
          //   // this.$router.push('/login');
          //   this.$store.state.show_login = true;
          //   return false;
          // }
        }
      },
      // 跳转页面
      changeRoute(v,item,which) {
        if(which){
          switch(which) {
            case 'new':
              this.$router.push({ path: v, query: { fmfpid: item.fmfpid, which: which }});
              break;
            case 'try':
              this.$router.push({ path: v, query: { tcid: item.tcid, which: which }});
              break;
          }
        }else{
          switch(v) {
            case '/productDetail':
              this.$router.push({ path: v, query: { prid: item.prid}});
              break;
            case '/limitedProductDetail':
              this.$router.push({ path: v, query: { tlpid: item.tlpid }});
              break;
          }
        }

      },
      // 导航点击
      navClick(index) {
        this.page_info.page_num = 1;
        this.total_count = 0;
        this.bottom_show = false;
        let arr = [].concat(this.activityList);
        if(arr[index].active) {
          return false;
        }
        for(let i = 0; i < arr.length; i ++) {
          arr[i].active = false;
        }
        arr[index].active = true;
        this.activityList = [].concat(arr);
        this.selecte_nav = this.activityList[index];
        let name = this.selecte_nav.actype;
        for(let i in this.limit_list){
          clearInterval(this.limit_list[i].timer);
        }
        this.shareAct(this.activityList[index]);
        switch (name) {
          case 4:
            this.getLimited();
            break;
          case 0:
            this.getNew();
            break;
          case 3:
            this.getTry();
            break;
          case 1:
            if(!this.rule){
              this.getRule();
            }
            this.getGuessAll();
            break;
        }
      },
      // 获取当前时间
      getTime() {
        let hour = new Date().getHours();
        if(hour < 15) {
          this.hour = true;
          let that = this;
          let timer = setInterval(function () {
            let now = new Date();
            let date = now.getFullYear() + '-'
              + ((now.getMonth()+1) >9?(now.getMonth()+1):'0'+(now.getMonth()+1)) +'-'
              + now.getDate()+ ' ' + '15:00:00'
            let endDate = new Date(date);

            let leftTime = endDate.getTime()-now.getTime();
            let hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
            let mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
            let ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            hh = that.checkTime(hh);
            mm = that.checkTime(mm);
            ss = that.checkTime(ss);//小于10的话加0
            if(hh == '00' && mm== '00' && ss =='00'){
              that.hour = false;
              clearInterval(timer)
            }else{
              that.correct_time= [hh,mm,ss];
            }

          },1000)
        }
      },
      // 跳转页面
      changeRouteGuess() {
        localStorage.setItem('guess', JSON.stringify(this.guess));
        this.$router.push({ path: '/guessProduct',query:{which:'guess'} });
      },
      changeRouteLimit(v,item){
        let endDate,status;
        if(item.duration_start){
          endDate = item.tlastarttime;
          status = '开始'
        }else if(item.duration_end){
          endDate = item.tlaendtime;
          status = '结束'
        }
        this.$router.push({ path: '/limitedTime',query:{tlaid:item.tlaid,tlatoppic:item.tlatoppic,tlaname:item.tlaname,status:status,endDate:endDate,tlastarttime:item.tlastarttime,tlaendtime:item.tlaendtime} });
      },
      // 用户获取今天猜数字活动所有商品
      getTodayProduct() {
        this.$http.get(this.$api.today_gnap + '?token='+ localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            this.guess = res.data.data;
            this.productImages = [];
            for(let i in res.data.data.fresh_man) {
              this.productImages.push(res.data.data.fresh_man[i].product)
            }
          }
        });
      },
      // 提交猜测的结果
      submitResult() {
        if(!localStorage.getItem('token')){
          Toast("请先登录");
          this.$store.state.show_login = true;
          return false;
        }
        if(!this.submit) {
          this.getTime();    // 获取当前时间
          if(this.hour) {
            if(this.msg) {
              this.submit = true;
              this.result = "";
              this.$http.post(this.$api.create_guess_num + '?token=' + localStorage.getItem('token'), { gnnum: this.msg }).then(res => {
                if(res.data.status == 200){
                  Toast(res.data.message);
                }
              });
            }else {
              Toast("请先输入竞猜数字");
            }
          }else {
            Toast("每日开放时间：00:00-14:50");
          }
        }
      },
      // 获取今日参与记录
      getGuess(date) {
        let params = {
          token: localStorage.getItem('token'),
          date: '' || date
        };
        this.$http.get(this.$api.get_guess_num, { params: params }).then(res => {
          if(res.data.status == 200) {

            if(!date && res.data.data) {
              this.msg = res.data.data.gnnum;
              this.submit = true;
              this.record = res.data.data;
              if(res.data.data.result == 'uncorrect') {
                this.failPopup = true;        // 猜错啦
              }else if(res.data.data.result == 'correct') {
                this.successPopup = true;     // 猜对啦
              }else if(res.data.data.result == 'not_open') {
                this.nonePopup = true;
                Toast('今日未开奖');
              }
            }
            // if(date && localStorage.getItem('tipDate') != this.today) {
            //   this.record = res.data.data;
            //   if(res.data.data.result == 'uncorrect') {
            //     this.failPopup = true;        // 猜错啦
            //   }else if(res.data.data.result == 'correct') {
            //     this.successPopup = true;     // 猜对啦
            //   }else if(res.data.data.result == 'not_open') {
            //     this.nonePopup = true;
            //     Toast('昨日未开奖');
            //   }
            // }
          }
          if(res.data.status == 404) {
            if(localStorage.getItem('yesterday')) {
              if(localStorage.getItem('yesterday') == this.today) {

              }else {
                Toast(res.data.message);
                localStorage.setItem('yesterday', this.today)
              }
            }else {
              Toast(res.data.message);
              localStorage.setItem('yesterday', this.today)
            }
          }
        });
      },
      // 获取该活动的规则
      getRule() {
        this.$http.get(this.$api.get_activity + "?actype=1").then(res => {
          if(res.data.status == 200) {
            // console.log(res.data.data);
            this.rule = res.data.data;
          }
        });
      },
      //每日竞猜
      getGuessAll(){
        this.today = new Date();
        this.today.setTime(this.today.getTime()-24*60*60*1000);
        this.today = this.today.getFullYear().toString() + (this.today.getMonth()+1).toString() + this.today.getDate().toString();
        // this.today = new Date().getFullYear().toString() + (new Date().getMonth() + 1).toString() + (new Date().getDate() - 1).toString();
        this.uaid = localStorage.getItem('uaid');
        localStorage.removeItem('uaid');
        if(localStorage.getItem('token')) {
          this.getGuess();                   // 获取今日参与记录
          // if(localStorage.getItem('tipDate') != this.today) {
          //   this.getGuess(this.today);         // 获取昨日参与记录
          // }
        }
        this.getTime();                    // 获取当前时间
        this.getTodayProduct();
      },
      // 获取活动list
      getActivit() {
        this.$http.get(this.$api.activity_list + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.activityList = res.data.data;
            let index = 0;
            for(let i in this.activityList){
              this.activityList[i].active = false;
              if(this.activityList[i].actype == this.$route.query.actype){
                index = i;
              }
            }
            this.navClick(index);
            // this.$refs.activity.style.height = this.activityList.length * 520 + 'px';
          }
        });
      },
      //获取限时活动列表
      getLimited(){
        this.$http.get(this.$api.brand_recommend_index).then(res => {
          if(res.data.status == 200){
            this.hot_list = res.data.data.hot;
          }
        })
        this.$http.get(this.$api.list_activity_product).then(res => {
          if(res.data.status == 200){
            this.limit_list = res.data.data;
            this.timeOut();
          }
        })
      },
      //获取新人首单列表
      getNew(){
        this.$http.get(this.$api.fresh_man_list).then(res => {
          if(res.data.status == 200){
            this.new_list = res.data.data.fresh_man;
          }
        })
      },
      //获取新人首单列表
      getTry(){
        let params = {};
        if(localStorage.getItem('token')) {
          params = {
            token: localStorage.getItem('token'),
            page_num: this.page_info.page_num,
            page_size: this.page_info.page_size
          }
        }else {
          params = {
            page_num: this.page_num,
            page_size: this.page_size
          };
        }
        this.$http.get(this.$api.get_commodity,{
          params:params
        }).then(res => {
          if(res.data.status == 200){
            this.isScroll = true;
            if(res.data.data.commodity.length > 0) {
              if(this.page_info.page_num > 1) {
                this.try_list = this.try_list.concat(res.data.data.commodity);
              }else{
                this.try_list = res.data.data.commodity;
              }
              this.page_info.page_num = this.page_info.page_num + 1;
              this.total_count = res.data.total_count;
            }else{
              this.try_list = [];
              this.page_info.page_num = 1;
              this.total_count = 0;
              return false;
            }
          }
        })
      },
      //滚动加载更多
      touchMove(e) {
        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll){
            this.isScroll = false;
            if(this.hot_list.length == this.total_count){
              this.bottom_show = true;
            }else{
              let name = this.selecte_nav.acname;
              for(let i in this.limit_list){
                clearInterval(this.limit_list[i].timer);
              }
              switch (name) {
                case '试用商品':
                  this.getTry();
                  break;
              }

            }
          }
        }
      },
      // 下拉刷新
      loadTop() {
        this.page_info.page_num = 1;
        this.total_count = 0;
        this.bottom_show = false;
        let name = this.selecte_nav.acname;
        for(let i in this.limit_list){
          clearInterval(this.limit_list[i].timer);
        }
        switch (name) {
          case 4:
            this.getLimited();
            break;
          case 0:
            this.getNew();
            break;
          case 3:
            this.getTry();
            break;
          case 1:
            this.getGuessAll();
            break;
        }
        this.$refs.loadmore.onTopLoaded();
      },
      focus() {
        if(!this.submit){
          this.$refs.pwd.focus();
        }
      },
      // 倒计时
      timeOut() {
        let arr = [].concat(this.limit_list);
        let that = this;
        for(let i in arr){

          if(arr[i].duration_start || arr[i].duration_end){
            if(arr[i].timer){
              clearInterval(arr[i].timer);
            }
            arr[i].timer = setInterval(function () {
              let now = new Date();
              let endDate;
              if(arr[i].duration_start){
                endDate = new Date(arr[i].tlastarttime);
              }else if(arr[i].duration_end){
                endDate = new Date(arr[i].tlaendtime);
              }

              let leftTime = endDate.getTime()-now.getTime();
              let dd = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
              let hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
              let mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
              let ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
              dd = that.checkTime(dd);
              hh = that.checkTime(hh);
              mm = that.checkTime(mm);
              ss = that.checkTime(ss);//小于10的话加0
              let str =  `${dd}天${hh}:${mm}:${ss}`;
              if(dd == '00' && hh == '00' && mm== '00' && ss =='00'){
                if(arr[i].duration_start){
                  delete arr[i].duration_start;
                  arr[i].duration_end = '00';
                  clearInterval(arr[i].timer);
                  that.timeOut();
                }else if(arr[i].duration_end){
                 that.getLimited();
                }
              }else{
                arr[i].show_time = str;
              }
              that.limit_list = [].concat(arr);
            },1000)
          }
        }

      },
      checkTime(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }
    },
    mounted() {
      common.changeTitle('活动');
      if(this.$route.query.token) {
        localStorage.setItem('token', this.$route.query.token);
      }
      this.getActivit();                // 获取活动list
      wxapi.wxRegister(location.href.split('#')[0]);
      // localStorage.removeItem('share');
      // localStorage.removeItem('url');

      if(localStorage.getItem('token')) {
        // 倒计时
        const TIME_COUNT = 1;
        let count = TIME_COUNT;
        let time = setInterval(() => {
          if(count > 0 && count <= TIME_COUNT) {
            count --;
          }else {
            this.shareAct();
            clearInterval(time);
          }
        }, 500);
      }
      if(localStorage.getItem('secret_usid') == '/#/'){
        localStorage.removeItem('secret_usid');
      }
      localStorage.removeItem('share');
      localStorage.removeItem('url');
      localStorage.removeItem('login_to');
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-activity {
    /*height: 100%;*/
    /*overflow-y: hidden;*/
    min-height: 100vh;
    background-color: #ffffff;
    color: #000;
    .m-activity-top-img{
      display: block;
      width: 750px;
      height: 250px;
    }
    .m-one-limit{
      width: 100%;
      border-bottom: 10px solid #F4F4F4;
      .m-limit-title{
        .flex-row(space-between);
        padding: 5px 0 5px 20px;
        border-bottom: 1px solid #F2F2F2;
        font-weight: 600;
        font-size: 28px;
        .m-active{
          color: @mainColor;
          font-size: 24px;
          font-weight: 400;
          margin-right: 20px;
        }
        .m-activity-time{
          color: #fff;
          padding: 0 15px;
          background:linear-gradient(270deg,@mainColor 0%,@subColor 100%);
          font-size: 20px;
          .flex-row(center);
          .m-icon-time{
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
      }
      .m-hot{
        .flex-row(space-between);
        padding: 20px;
        .m-hot-left{
          width: 88px;
          height: 258px;
          padding: 10px;
          box-sizing: border-box;
          background: url("/static/images/newActivity/icon-hot.png") no-repeat;
          background-size: 100% 100%;
          text-align: left;
          margin-right: 30px;
          .m-hot-hot{
            font-size: 28px;
            font-weight: 600;
          }
          .m-line-left{
            border-left: 1px solid #000;
            height: 117px;
            margin: 7px 0 7px 10px;
          }
        }
        .m-hot-right{
          overflow: hidden;
          ul{
            .flex-row(flex-start);
            overflow-x: auto;
            li{
              margin-right: 20px;
              width: 180px;
              text-align: left;
              &:last-child{
                margin-right: 0;
              }
              .m-hot-product-img{
                display: block;
                width: 180px;
                height: 180px;
              }
              .m-num{
                font-weight: 600;
                font-size: 32px;
              }
            }
          }
        }
      }
      .m-limit-center-content{
        padding: 0 45px;
        .m-more-text{
          color: #C1C1C1;
          font-size: 24px;
          .flex-row(flex-end);
          margin: 20px 0;
          .m-icon-more{
            display: inline-block;
            width: 17px;
            height: 30px;
            margin-left: 10px;
          }
        }
        ul.m-center-product-ul{
          .flex-row(flex-start);
          flex-flow: wrap;
          li{
            margin: 20px 20px 0 0;
            width: 150px;
            &:nth-child(4n){
              margin-right: 0;
            }
            .m-product-img{
              display: block;
              width: 150px;
              height: 150px;
            }
            .m-product-name{
              width: 150px;
              height: 28px;
              line-height: 28px;
              font-size: 20px;
              overflow: hidden;
              text-overflow: ellipsis;    // 溢出用省略号显示
              white-space:nowrap;
              text-align: left;
            }
            .m-num{
              font-size: 24px;
            }
            s{
              font-size: 16px;
              color: #C1C1C1;
            }
            .m-label-img{
              display: inline-block;
              width: 90px;
              height: 40px;
            }
            .m-label-img-try{
              display: inline-block;
              width: 40px;
              height: 40px;
            }
          }
        }
      }
      &:last-child{
        border-bottom: none;
        .m-limit-center-content{
          ul.m-center-product-ul{
            .flex-row(flex-start);
            flex-flow: wrap;
            li{
              margin: 20px 20px 0 0;
              width: 320px;
              &:nth-child(2n){
                margin-right: 0;
              }
              .m-product-img{
                display: block;
                width: 320px;
                height: 450px;
              }
              .m-product-name{
                width: 320px;
                height: 28px;
                line-height: 28px;
                font-size: 20px;
                overflow: hidden;
                text-overflow: ellipsis;    // 溢出用省略号显示
                white-space:nowrap;
              }
              .m-num{
                font-size: 24px;
              }
              s{
                font-size: 16px;
                color: #C1C1C1;
              }
            }
          }
        }
      }
    }
    .m-guess-content{
       width: 750px;
      overflow-x: hidden;
      height: 80vh;
      position: relative;
      color: #fff;
      .m-guess-box{
        /*position: absolute;*/
        width: 899px;
        height: 80vh;
        box-sizing: border-box;
        background: url("/static/images/newActivity/guess-bg.png") no-repeat;
        background-size: 100% 100%;
        filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
        padding-top: 100px;
        .m-label-left{
          position: absolute;
          top: 40px;
          left: 0;
          width: 105px;
          height: 50px;
          line-height: 50px;
          color: #fff;
          font-size: 28px;
          font-weight: 500;
          border: 3px solid #fff;
          border-left: none;
          border-bottom-right-radius: 50px;
          border-top-right-radius: 50px;
        }
        .m-label-right{
          position: absolute;
          top: 40px;
          right: 0;
          width: 105px;
          height: 50px;
          line-height: 50px;
          color: #fff;
          font-size: 28px;
          font-weight: 500;
          border: 3px solid #fff;
          border-right: none;
          border-bottom-left-radius: 50px;
          border-top-left-radius: 50px;
        }
       .m-guess-text{
         width: 750px;
         .m-guess-title{
           font-size: 40px;
           font-weight: 800;
         }
         .m-guess-text-image{
           display: inline-block;
           width: 534px;
           height: 197px;
         }
         .m-guess-time{
           margin-top: 100px;
           font-size: 28px;
           .m-main-color{
             color: @mainColor;
             .m-time-bg{
               display: inline-block;
               width: 44px;
               height: 44px;
               line-height: 44px;
               border-radius: 5px;
               background-color: #fff;
               margin-right: 5px;
             }
           }
         }
         .m-num-box{
           margin-top: 30px;
           .m-input-box{
             .flex-row(center);
             /*margin: 90px;*/
             font-size: 48px;
             margin-bottom: 30px;
             color: #fff;
             .m-guess-num-input{
               width: 80px;
               height: 80px;
               line-height: 80px;
               background: url("/static/images/newActivity/guess-num.png") no-repeat;
               background-size: 100% 100%;
               position: relative;
               margin-right: 10px;
               color: #000;
             }
           }
           input[type=tel] {
             width: 0.1px;
             height: 0.1px;
             color: transparent;
             position: relative;
             top: 23px;
             background: #000000;
             left: 46px;
             border: none;
             font-size: 18px;
             opacity: 0;
             z-index: -1;
           }
           //光标
           .psd-blink {
             display: inline-block;
             /*background: url("./img/blink.gif") no-repeat center;*/
             /*border-right: 1px solid #ccc;*/
             width: 80px;

             s:after{
               content: '|';
               color: #000;
               display: inline-block;
               -webkit-animation:gogogo 0.5s infinite  ;
             }
           }
         }
         .m-guess-btn{
           margin-top: 186px;
           span{
             display: inline-block;
             font-size: 48px;
             width: 460px;
             height: 90px;
             line-height: 90px;
             font-weight: 600;
             color: @mainColor;
             background: url("/static/images/newActivity/guess-btn.png") no-repeat;
             background-size: 100% 100%;
           }
         }
         .m-guess-result{
           width: 550px;
           height: 340px;
           box-sizing: border-box;
           background: url("/static/images/newActivity/guess-result.png") no-repeat;
           background-size: 100% 100%;
           margin-left: 100px;
           padding: 54px 0 64px;
           color: #000;
           .m-guess-result-num{
             font-weight: 600;
             font-size: 48px;
             color: @mainColor;
           }
           .m-no-time{
             margin: 70px 0;
             font-size: 28px;
           }
           .m-main-color{
             color: @mainColor;
           }
           .m-mr20{
             margin: 20px 0 53px;
           }
           .m-guess-result-btn{
             color: @mainColor;
             font-size: 30px;
             font-weight: 500;
           }
         }
       }
      }
    }
    .m-rule-popup {
      width: 600px;
      height: 800px;
      margin: -300px 0 0 75px;
      /*border-radius: 30px;*/
      color: #000;
      .m-rule-title{
        font-size: 28px;
        text-align: center;
        margin: 50px 0 30px;
      }
      .m-rule-text {
        font-size: 28px;
        /*text-indent: 2em;*/
        padding: 20px 50px;
        line-height: 40px;
        text-align: left;
      }
    }
  }
</style>
