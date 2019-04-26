<template>
  <div class="m-editCircle">
    <div class="m-editCircle-content">
<!--      <div class="m-select m-one" @click="circlePopup = true">-->
<!--        <span>{{circle}}</span>-->
<!--        <span class="m-select-more"></span>-->
<!--      </div>-->
      <div class="m-one m-flex-end">
        <span class="m-edit-btn" @click="createNews">发布</span>
      </div>
      <!--圈子类别-->
      <mt-popup class="m-circle-popup" v-model="circlePopup" position="bottom">
        <div class="m-popup-btn">
          <div @click="circlePopup = false">取消</div>
          <div @click="circleDone">确认</div>
        </div>
        <mt-checklist class="m-checklist" v-model="circleList" :options="options"></mt-checklist>
      </mt-popup>

      <div class="m-input m-one m-ft-24">
        <input type="text" v-model="title" placeholder="请输入标题">
      </div>

      <div class="m-edit-content" >
        <div  class="m-add-cut m-flex-between" style="margin-bottom: 20px;">
          <span >编辑内容：</span>
          <div class="m-add">
            <img src="/static/images/circle/icon-add.png" class="m-icon" alt="" @click="showIcon('show_add')">
            <div class="m-edit-icon" v-if="show_add">
              <div class="m-icon-one" @click.stop="addRow(-1,'text')"><img src="/static/images/circle/icon-text.png" alt=""></div>
              <div class="m-icon-one" @click.stop="addRow(-1,'image')"><img src="/static/images/circle/icon-pic.png" alt=""></div>
              <div class="m-icon-one" v-if="show_video" @click.stop="addRow(-1,'video')"><img src="/static/images/circle/icon-video.png" alt=""></div>
            </div>
          </div>
        </div>
        <div class="m-row" v-for="(item,index) in edit_data">
          <textarea  :id="forId(index)" class="m-textarea" placeholder="请输入内容..." :class="index == edit_data.length -1?'m-last':''" v-model="item.content" v-if="item.type == 'text'" ></textarea >
          <div class="m-selectBack-img-box" v-if="item.type == 'image'">
            <div class="img-box" v-for="(i,j) in item.content">
              <img class="circle-img" :src="i" alt="" @click="previewImage(j,index, item.content)">
              <img class="del-img" src="/static/images/icon-close.png" alt="" @click="deleteImg(index,j)">
            </div>
            <div class="m-selectBack-camera" >
              <input type="file" name="file" class="m-upload-input" value="" accept="image/*" multiple=""  @change="uploadImg($event,index)" :ref="forId(index)">
            </div>
          </div>
          <div class="m-selectBack-img-box" v-if="item.type == 'video'">
            <div class="img-box" v-if="item.content.thumbnail">
              <img class="circle-img" :src="item.content.thumbnail" alt="">
              <img class="del-img" src="/static/images/icon-close.png" alt="" @click="deleteVideo(index)">
            </div>
            <div class="m-selectBack-video" v-else>
              <input type="file" name="file" class="m-upload-input" value="" accept="video/*" multiple="" @change="uploadVideo($event,index)">
            </div>
          </div>
          <div class="m-add-cut">
            <div class="m-add">
              <img src="/static/images/circle/icon-add.png" class="m-icon" alt="" @click="showIcon(index)">
              <div class="m-edit-icon" v-if="item.click">
                <div class="m-icon-one" @click.stop="addRow(index,'text')"><img src="/static/images/circle/icon-text.png" alt=""></div>
                <div class="m-icon-one" @click.stop="addRow(index,'image')"><img src="/static/images/circle/icon-pic.png" alt=""></div>
                <div class="m-icon-one" v-if="show_video" @click.stop="addRow(index,'video')"><img src="/static/images/circle/icon-video.png" alt=""></div>
              </div>
            </div>
            <div class="m-cut" >
              <img src="/static/images/circle/icon-cut.png" class="m-icon" alt="" @click="cutType(index)">
            </div>
          </div>
        </div>
      </div>
      <div class="m-edit-select-box">
        <ul>
          <li>
            <span>
              <img src="/static/images/circle/icon-label.png" class="m-icon" alt="">
              <span>标签</span>
            </span>
            <span @click="circlePopup = true" class="m-grey">
              <span>{{circle}}</span>
              <img src="/static/images/newpersonal/icon-more.png" class="m-icon-more" alt="">
            </span>
          </li>
          <li>
            <span>
              <img src="/static/images/circle/icon-loc.png" class="m-icon" alt="">
              <span>定位</span>
            </span>
            <span  class="m-grey">
              <span>{{nelocation}}</span>
<!--              <img src="/static/images/newpersonal/icon-more.png" class="m-icon-more" alt="">-->
            </span>
          </li>
          <li>
            <span>
              <img src="/static/images/circle/icon-topic.png" class="m-icon" alt="">
              <span>话题</span>
            </span>
            <span  class="m-grey" @click="changeRoute('/circle/createTopic')">
              <span>{{select_topic.toctitle || '请选择话题'}}</span>
              <img src="/static/images/newpersonal/icon-more.png" class="m-icon-more" alt="">
            </span>
          </li>
        </ul>
        <div class="m-topic-box">
          <span class="m-one-topic" v-for="(item,index) in news_topic" :class="select_topic.tocid == item.tocid?'active':''" @click="tocClick(item)">#{{item.toctitle}}#</span>
        </div>
      </div>


<!--      &lt;!&ndash;店主版选择商品或优惠券&ndash;&gt;-->
<!--      <div class="m-product-coupon" v-if="usLevel == '2'">-->
<!--        &lt;!&ndash;<div class="m-input-box" @click="getProduct">-->
<!--          <div class="m-input-text">选择商品</div>-->
<!--          <img class="m-input-icon" v-if="productList.length == 0" src="/static/images/icon-down-active.png">-->
<!--          <img class="m-input-icon" v-else src="/static/images/icon-up.png">-->
<!--        </div>&ndash;&gt;-->
<!--        <div class="m-product-search">-->
<!--          <input type="text" v-model="search" @blur="getProduct" placeholder="商品搜索关键词(商品名/品牌名)">-->
<!--        </div>-->
<!--        <div class="m-scroll-box">-->
<!--          <div class="m-scroll" style="padding-left: 40px;">-->
<!--            <ul class="m-selected-brand-product-ul" style="margin: 0;">-->
<!--              <li v-for="(item, index) in productList">-->
<!--                <img class="m-cancel-icon" v-if="!item.choose" src="/static/images/icon-radio.png" @click="productCouponCancel('product', index)">-->
<!--                <img class="m-cancel-icon" v-else src="/static/images/icon-radio-active.png" @click="productCouponCancel('product', index)">-->
<!--                <img :src="item.prmainpic" class="m-selected-brand-product-img">-->
<!--                <div class="m-selected-brand-product-text">-->
<!--                  <h3>【{{item.brand.pbname}}】{{item.prtitle}}</h3>-->
<!--                  <p class="m-flex-between m-ft-18">-->
<!--                    <span>￥{{item.prprice | money}}</span>-->
<!--                    <s class="m-grey m-ft-18" v-if="item.prlineprice">￥{{item.prlineprice | money}}</s>-->
<!--                  </p>-->
<!--                </div>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="m-input-box" @click="getUserCoupon">-->
<!--          <div class="m-input-text">选择优惠券</div>-->
<!--          <img class="m-input-icon" v-if="couponList.length == 0" src="/static/images/icon-down-active.png">-->
<!--          <img class="m-input-icon" v-else src="/static/images/icon-up.png">-->
<!--        </div>-->
<!--        <div class="m-coupon-box">-->
<!--          <coupon-card :couponList="couponList" :circle="circleCoupon" @productCouponCancel="productCouponCancel"></coupon-card>-->
<!--          <div class="m-no-coupon" v-if="couponList.length == 0 && getCoupon">暂无优惠券</div>-->
<!--        </div>-->
<!--      </div>-->
    </div>


  </div>
</template>

<script>
  import common from '../../../common/js/common'
  import axios from 'axios'
  import api from '../../../api/api'
  import { Toast } from 'mint-ui'
  import product from '../components/product'
  import couponCard from '../components/couponCard'
  import wxapi from '../../../common/js/mixins'
  import wx from 'weixin-js-sdk';
  export default {
    name: "edit-circle",
    data() {
      return {
        circlePopup: false,
        options: [],
        circle: "请选择标签",
        circleList: [],
        title: "",
        content: "",
        img_box: [],            // 上传图片集合
        upload_img: [],
        video_box: [],
        video: {},
        search: "",
        usLevel: "",
        product_list: [],       // 选中的商品
        productList: [],        // 可选择的商品
        couponList: [],         // 可选择的优惠券
        circleCoupon: true,     // 是在圈子页的优惠券
        getCoupon: false,        // 是否请求过获取优惠券的接口
        edit_data:[],
        show_add:false,
        show_video:false,
        select_product:[],
        nelocation:'',
        news_topic:[],
        select_topic:{}
      }
    },
    mixins: [wxapi],
    components: { product, couponCard },
    // directives: {
    //   'mtblur' (el, binding, vnode) {
    //     let mtinput = el.querySelector('input')
    //     console.log(el)
    //     mtinput.onblur = function () {
    //
    //        this.getProduct();
    //     }
    //   }
    //
    // },
    methods: {
      changeRoute(v){
        this.$router.push(v)
      },
      // 预览图片
      previewImage(j,index, image) {
        let images = [];
        for(let i = 0; i < image.length; i ++) {
          images.push(location.origin + image[i]);
        }
        let options = {
          current: location.origin + image[index], // 当前显示图片的http链接
          urls: images,                  // 当前预览图片的list
        };
        wxapi.previewImage(options);
      },
      // 获取圈子所在的标签
      getNav() {
        axios.get(api.items_list + "?ittype=10").then(res => {
          if(res.data.status == 200){
            let option = {};
            this.options = [];
            for(let i = 0; i < res.data.data.length; i ++) {
              option = { label: res.data.data[i].itname, value: res.data.data[i].itid };
              this.options.push(option);
            }
          }
        })
      },
      // 圈子多选标签的确定按钮
      circleDone() {
        this.circle = "";
        this.circlePopup = false;
        for(let i = 0; i < this.options.length; i ++) {
          for(let j = 0; j < this.circleList.length; j ++) {
            if(this.options[i].value == this.circleList[j]) {
              this.circle = this.circle + this.options[i].label + " ";
            }
          }
        }
      },
      // 获取当前用户是否是店主
      getUserLevel() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            this.usLevel = res.data.data.uslevel;
          }
        });
      },
      // 获取发布圈子时可选择的优惠券
      getUserCoupon() {
        if(this.couponList.length > 0) {
          this.getCoupon = false;
          this.couponList = [];
        }else {
          let params = {
            token: localStorage.getItem('token'),
            // itid: 'news_bind_coupon',
            page_num : 1,
            page_size : 200
          };
          axios.get(api.coupon_list, { params: params }).then(res => {
            if(res.data.status == 200) {
              this.couponList = res.data.data;
              this.getCoupon = true;
              // 名称优化、选择优惠券
              for(let i = 0; i < this.couponList.length; i ++) {
                this.couponList[i].choose = false;
                if(this.couponList[i].title_subtitle.left_text.length > 8) {
                  this.couponList[i].title_subtitle.left_text = this.couponList[i].title_subtitle.left_text.substring(0, 8) + "..";
                }
              }
              // 优惠券显示内容精简
              for(let i in this.couponList) {
                if(this.couponList[i].cosubtration.toString().length > 4) {
                  this.couponList[i].cosubtration = 999
                }
                this.couponList[i].codiscount = this.couponList[i].codiscount.toString().slice(0, 3)
              }
            }
          });
        }
      },
      // 删除图片
      deleteImg(index,i) {
        this.edit_data[index].content.splice(i, 1);
        // this.upload_img.splice(index, 1);
      },
      // 删除视频
      deleteVideo(index) {
        this.edit_data[index].content = {};
      },
      //上传图片
      uploadImg(e,index,j) {
        // if(this.img_box && this.img_box.length == 4) {
        //   Toast('最多只可上传4张图片');
        //   return false;
        // }
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        if (files[0].size/1024/1024 > 15) {
          Toast('图片不应大于15M');
          return false
        }
        let reader = new FileReader();
        let that = this;
        let form = new FormData();
        form.append("file", files[0]);
        axios.post(api.upload_file+'?type=news&token='+localStorage.getItem('token'),form).then(res => {
          if(res.data.status == 200){
            // let img = { niimg: res.data.data, nisort: this.img_box.length + 1 };
            this.upload_img.push(res.data.data);
            reader.readAsDataURL(files[0]);
            reader.onload = function(e) {
              that.edit_data[index].content.push(window.location.origin + res.data.data);
              event.srcElement.value = ""
            };
            this.$refs[this.forId(index)][0].value = "";
          }
        })
      },
      //上传视频
      uploadVideo(e,index) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        if (files[0].size/1024/1024 > 20) {
          Toast('视频不应大于20M');
          return false
        }
        let reader = new FileReader();
        let that = this;
        let form = new FormData();
        form.append("file", files[0]);
        axios.post(api.upload_file+'?type=video&token='+localStorage.getItem('token'),form).then(res => {
          if(res.data.status == 200){
            let video = {
              video : res.data.data,
              thumbnail  : window.location.origin + res.data.video_thum,
              duration : res.data.video_dur,
            }
            reader.readAsDataURL(files[0]);
            reader.onload = function(e) {
              that.edit_data[index].content = video;
            };
          }
        });
      },
      //获取商品列表
      getProduct() {
        console.log(this.search)
        // if(this.productList.length > 0) {
        //   this.productList = [];
        // }else {
          let params = {
            // itid: 'news_bind_product',
            kw: this.search,
            page_num: 1,
            page_size: 200
          }
          axios.get(api.product_list, { params: params }).then(res => {
            if(res.data.status == 200) {
              let arr =[] ;
              for(let i in this.productList){
                if(this.productList[i].choose){
                  arr.push(this.productList[i])
                }
              }

              for(let i = 0; i < res.data.data.length; i ++) {
                res.data.data[i].choose = false;
                let result = arr.some(item=>{
                  if(item.prid== res.data.data[i].prid){
                    return true
                  }
                })
                if(!result)
                  arr.push(res.data.data[i])
              }
              this.productList = arr.concat([]);
            }
          });
        // }
      },
      // 取消商品或优惠券的选择
      productCouponCancel(which, index) {
        if(which == 'product') {
          this.productList[index].choose = !this.productList[index].choose;
          this.productList = this.productList.concat();
        }else if(which == 'circle') {
          this.couponList[index].choose = !this.couponList[index].choose;
          this.couponList = this.couponList.concat();
        }
      },
      // 发布圈子资讯
      createNews() {
        if(!this.circleList.length) {
          Toast("请选择标签");
          return false;
        }
        if(this.title == "") {
          Toast("请输入标题");
          return false;
        }
        if(this.edit_data.length < 1 ) {
          Toast("请添加文章内容");
          return false;
        }else if(this.edit_data[this.edit_data.length-1].content == ''){
          Toast("请添加文章内容");
          return false;
        }
        // if(this.content.length >10000) {
        //   Toast("内容字数不可操作10000");
        //   return false;
        // }
        let text = [];
        for(let i=0;i<this.edit_data.length;i++){
          text[i] ={
            type:this.edit_data[i].type,
            content:this.edit_data[i].content
          }
        }
        let params = {
          items: this.circleList,
          netitle: this.title,
          netext: text,
          images: this.upload_img,
          video: this.video,
          source: "h5",
          tocid:this.select_topic.tocid,
          nelocation: this.nelocation
        };
        params.coupon = [];
        params.product = [];
        for(let i = 0; i < this.productList.length; i ++) {
          if(this.productList[i].choose) {
            params.product.push(this.productList[i].prid);
          }
        }
        for(let i = 0; i < this.couponList.length; i ++) {
          if(this.couponList[i].choose) {
            params.coupon.push(this.couponList[i].coid);
          }
        }
        axios.post(api.create_news + "?token=" + localStorage.getItem("token"), params).then(res => {
          if(res.data.status == 200){
            Toast(res.data.message);
            this.$router.push('/circle');
          }
        })
      },
      //点击添加
      showIcon(index){
        this.show_video = true;
        for(let i=0;i<this.edit_data.length;i++){
          if(this.edit_data[i].type == 'video' && this.edit_data[i].content != {} ){
            this.show_video = false;
          }
        }
        if(index == 'show_add'){
          this.show_add = !this.show_add;
          return false;
        }
        this.edit_data[index].click = !this.edit_data[index].click
      },
      //点击icon
      addRow(index,item){
        if(index == -1){
          this.show_add = false;
        }else{
          this.edit_data[index].click = false;
        }
        let _item = {
          type:item,
          content:null,
          click:false
        };
        switch (item){
          case 'text':
            _item.content = '';

            break;
          case 'image':
            _item.content = [];
            break;
          case 'video':
            _item.content = {};
            break;
        }
        this.edit_data.splice(index+1,0,_item);
        // let text = document.getElementById("textarea"+(index+1));
        // this.autoTextarea(text);
      },
      //删除row
      cutType(index){
        this.edit_data.splice(index,1);
      },
      forId:function(index){
        return "textarea" +index
      },
      autoTextarea(elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
          isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
          addEvent = function (type, callback) {
            elem.addEventListener ?
              elem.addEventListener(type, callback, false) :
              elem.attachEvent('on' + type, callback);
          },
          getStyle = elem.currentStyle ? function (name) {
            var val = elem.currentStyle[name];

            if (name === 'height' && val.search(/px/i) !== 1) {
              var rect = elem.getBoundingClientRect();
              return rect.bottom - rect.top -
                parseFloat(getStyle('paddingTop')) -
                parseFloat(getStyle('paddingBottom')) + 'px';
            }
            return val;
          } : function (name) {
            return getComputedStyle(elem, null)[name];
          },
          minHeight = parseFloat(getStyle('height'));

        elem.style.resize = 'none';

        var change = function () {
          var scrollTop, height,
            padding = 0,
            style = elem.style;
          if (elem._length === elem.value.length) return;
          elem._length = elem.value.length;

          if (!isFirefox && !isOpera) {
            padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
          }
          scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          elem.style.height = minHeight + 'px';
          if (elem.scrollHeight > minHeight) {
            if (maxHeight && elem.scrollHeight > maxHeight) {
              height = maxHeight - padding;
              style.overflowY = 'auto';
            } else {
              height = elem.scrollHeight - padding;
              style.overflowY = 'hidden';
            }
            style.height = height + extra + 'px';
            scrollTop += parseInt(style.height) - elem.currHeight;
            document.body.scrollTop = scrollTop;
            document.documentElement.scrollTop = scrollTop;
            elem.currHeight = parseInt(style.height);
          }
        };
        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
      },
    //  获取地址
      getLoc(){
        // if(wxapi.isweixin()){
          let that = this;
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              that.$http.get(that.$api.news_location,{
                params:{
                  token:localStorage.getItem('token'),
                  longitude:res.longitude,
                  latitude:res.latitude
                }
              }).then(resData =>{
                if(resData.data.status == 200){
                  that.nelocation = resData.data.data.nelocation;
                }
              })
            }
          });
        // }
      },
    //  获取话题
      getTopic(){
        console.log(this.$api.news_topic,'assfds')
        this.$http.get(this.$api.news_topic).then(res => {
          if(res.data.status == 200){
            this.news_topic = res.data.data;
          }
        })
      },
    //  话题点击
      tocClick(item){
        if(item.tocid == this.select_topic.tocid){
          this.select_topic = {};
        }else{
          this.select_topic = item;
        }
      }
    },
    mounted() {
      common.changeTitle('发布');
      this.getNav();                 // 获取圈子所在的标签
      this.getUserLevel();           // 获取当前用户是否是店主
      wxapi.wxRegister(location.href.split('#')[0]);
      this.getLoc();
      this.getTopic();
      if(this.$route.query.select){
        this.select_topic = JSON.parse(this.$route.query.select);
      }
    },
    watch: {
      search(val) {
        // this.getProduct(val)
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";
  @import "../../../common/css/scroll";

  .m-editCircle{
    color: #000;
    text-align: left;
    font-size: 21px;
    .m-editCircle-content{
      padding: 40px 0 0 0;
    }
    .m-one{
      /*border-radius: 30px;*/
      /*border: 1px solid #999;*/
      /*margin: 0 50px 40px 50px;*/
      padding: 31px 50px 31px 50px;
      border-bottom: 1px solid #eee;
      .m-edit-btn{
        display: block;
        width: 160px;
        height: 50px;
        color: #fff;
        font-size: 28px;
        line-height: 50px;
        background:linear-gradient(90deg,@subColor 0%,@mainColor 100%);
        text-align: center;
        font-weight: 500;
      }
    }
    .m-input{
      input{
        border: none;
        width: 100%;
        color: #999;
        font-size: 24px;
      }
    }
    .m-textarea{
      textarea{
        display: block;
        width: 100%;
        height: 580px;
        border: none;
        font-size: 24px;
      }
    }
    .m-upload-box{
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 58px;
    }
    .m-selectBack-img-box{
      margin-bottom: 30px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .img-box {
        position: relative;
        .circle-img {
          display: inline-block;
          width: 186px;
          height: 186px;
          margin-bottom: 20px;
          margin-right: 15px;
        }
        .del-img {
          width: 40px;
          height: 40px;
          position: absolute;
          top: -20px;
          right: 0;
        }
      }
      .m-selectBack-camera{
        width: 186px;
        height: 186px;
        background: url('/static/images/circle/icon-upload-img.png') no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        margin: 0 15px 15px 0;
        position: relative;
      }
      .m-selectBack-video{
        width: 186px;
        height: 186px;
        background: url('/static/images/circle/icon-upload-video.png') no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        margin: 0 15px 15px 0;
        position: relative;
      }
      .m-upload-input{
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 186px;
        height: 186px;
      }
    }
    .m-product-coupon {
      .m-input-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px #707070 solid;
        border-radius: 50px;
        width: 310px;
        padding: 10px 30px 10px 60px;
        margin-bottom: 30px;
        .m-input-text {
          color: #000;
          font-size: 21px;
        }
        .m-input-icon {
          width: 22px;
          height: 22px;
        }
      }
      .m-product-search {
        width: 400px;
        border-radius: 30px;
        box-sizing: border-box;
        border: 2px solid #999;
        padding: 10px 30px;
        input {
          width: 340px;
        }
      }
      .m-scroll-box {
        margin: 0 30px 0 -60px;
      }
      .m-coupon-box {
        margin: 0 0 60px -50px;
        .m-no-coupon {
          margin-left: 60px;
        }
      }
    }
    .m-bottom-btn-box {
      text-align: center;
      padding: 0 0 50px 0;
      span{
        display: inline-block;
        width: 750px;
        height: 106px;
        /*border-radius: 10px;*/
        background-color: @mainColor;
        line-height: 106px;
        font-size: 38px;
        font-weight: bold;
        color: #ffffff;
      }
    }
    input::-webkit-input-placeholder{
      color: #000;
    }
    textarea::-webkit-input-placeholder{
      color: #999;
    }
  }
  .m-circle-popup {
    width: 750px;
    .m-popup-btn {
      color: #333333;
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      padding: 20px 40px 0 40px;
    }
    .m-checklist {
      padding: 50px 0;
      text-align: center;
      .mint-checkbox-input:checked + .mint-checkbox-core {
        background-color: @mainColor;
        border-color: @mainColor;
      }
    }
  }
  .m-edit-content{
    min-height: 700px;
    padding: 20px 50px;
    border-bottom: 10px solid #F4F4F4;
    .m-add-cut{
      display: flex;
      flex-flow: row;
      justify-content: flex-start;
      align-items: center;
      /*margin-left: 30px;*/
      &.m-flex-between{
        justify-content: space-between;
      }
      .m-icon{
        display: block;
        width: 30px;
        height: 30px;
      }
      .m-add{
        position: relative;
        margin-right: 30px;
        .m-edit-icon{
          position: absolute;
          bottom: -76px;
          right: 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: flex-end;
          background: url("/static/images/circle/icon-bg.png") no-repeat;
          background-size: 100%;
          z-index: 1000;
          width: 240px;
          height: 70px;
          padding-top: 10px;
          box-sizing: border-box;
          .flex-row(space-around);
          .m-icon-one{
            position: relative;
          }
          img{
            display: block;
            width: 50px;
            height: 50px;

          }
        }
      }
    }
    .m-row{
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-right: 40px;
    }
    .m-textarea{
      display: block;
      width: 70%;
      border: none;
      font-size: 24px;
      height: auto;
      color: #999;
      padding-top: 20px  ;
      min-height: 300px;
      &.m-last{
        min-height: 300px;
      }

    }
    .img-box {
      position: relative;
      width: 186px;
      height: 186px;
      .circle-img {
        display: inline-block;
        width: 186px;
        height: 186px;
        margin-bottom: 20px;
        margin-right: 15px;
      }
      .del-img {
        width: 40px;
        height: 40px;
        position: absolute;
        top: -20px;
        right: 0;
      }
    }
  }
  .m-edit-select-box{
    ul{
      li{
        .flex-row(space-between);
        padding: 30px 65px;
        border-bottom: 1px solid #F2F2F2;
        .m-grey{
          color: #999;
        }
        .m-icon{
          display: inline-block;
          width: 30px;
          height: 30px;
          margin-right: 20px;
          vertical-align: text-top;
        }
        .m-icon-more{
          display: inline-block;
          width: 17px;
          height: 30px;
          vertical-align: text-top;
        }
      }
    }
    .m-topic-box{
      padding: 30px 65px;
      .m-one-topic{
        display: inline-block;
        padding: 4px 18px;
        font-size: 20px;
        color: #666;
        background-color: #EBEBEB;
        margin-right: 20px;
        &.active{
          background-color: @mainColor;
          color: #fff;
        }
      }
    }
  }

  /*  .m-product-popup {
      width: 750px;
      .m-popup-btn {
        color: #333333;
        display: flex;
        justify-content: space-between;
        font-size: 28px;
        padding: 20px 40px 0 40px;
      }
      .m-product-box {
        height: 800px;
      }
    }*/
</style>
