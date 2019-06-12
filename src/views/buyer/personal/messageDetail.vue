<template>
    <div class="m-messageDetail" >
      <mt-loadmore :top-method="loadTop" ref="loadmore" id="dialogue_box">
        <div class="m-messageDetail-content" v-for="(item,index) in message_list">
          <div class="m-messageDetail-one"  :class="item.isself ? 'm-my':''">
            <template v-if="!item.isself">
              <img :src="item.head" class="m-avator" alt="" />
              <div class="m-message">
                <span class="m-triangle"></span>
                <div class="m-message-content">
                  <span v-if="item.umsgtype == 0">{{item.umsgtext}}</span>
                  <img v-else-if="item.umsgtype == 1" :src="item.umsgtext" alt="" @click="previewImage(item.umsgtext)">
                </div>
              </div>
            </template>
            <template v-else>
              <div class="m-message">
                <span class="m-triangle"></span>
                <div class="m-message-content">
                  <span v-if="item.umsgtype == 0">{{item.umsgtext}}</span>
                  <img v-else-if="item.umsgtype == 1" :src="item.umsgtext" @click="previewImage(item.umsgtext)" alt="">
                </div>
              </div>
              <img :src="item.head" class="m-avator" alt="" />
            </template>

          </div>
<!--          <div class="m-messageDetail-one m-my">-->

<!--            <div class="m-message">-->
<!--              <span class="m-triangle"></span>-->
<!--              <div class="m-message-content">12312</div>-->
<!--            </div>-->
<!--            <img src="" class="m-avator" alt="" />-->
<!--          </div>-->
        </div>
      </mt-loadmore>
      <div class="m-messageDetail-footer">
        <span class="m-icon-img">
            <img src="/static/images/circle/icon-pic.png"  alt="">
          <input type="file" name="file" class="m-upload-input" value="" accept="image/*" multiple="" ref="uploadImg" @change="uploadImg($event)">
        </span>

        <input type="text" v-model="input_value" class="m-input" placeholder="发消息...">
        <span class="m-send" @click="sendMsg">发送</span>
      </div>
    </div>
</template>

<script>
  import common from '../../../common/js/common';
  import { Toast} from 'mint-ui';
  import wxapi from '../../../common/js/mixins'
  import wx from 'weixin-js-sdk';
    export default {
        name: "messageDetail",
      data(){
          return{
            roid:'',
            usid:'',
            message_list:[],
            page_info:{
              page_num:1,
              page_size:10
            },
            isScroll:true,
            total_count:0,
            bottom_show:false,
            input_value:''
          }
      },
      mixins: [wxapi],
      mounted(){
        common.changeTitle('消息');
      },
      created(){
        //页面刚进入时开启长连接
        this.setSession();
      },
      destroyed: function() {

      },
      sockets: {
        new_message(data) {
          if(data.usid == this.usid){
            data.isself = true;
          }else{
            data.isself = false;
          }
          console.log(data);
          this.message_list.unshift(data);
          this.scrollBottom();
          // this.id = this.$socket.id;
          // this.$socket.emit('login', id);      //监听connect事件
        },
      },

      methods: {
        setSession(){
          let that = this;
          this.$socket.emit('setsession', localStorage.getItem('token'),function (res) {
            //如果连接失败，重新连接
            if(res.status != 200){
              that.setSession();
            }else{
              that.usid = res.data.data;
              if(that.$route.query.roid){
                that.roid = that.$route.query.roid;
                that.getMessageList();
              }else{
                that.$socket.emit('join_room', {usid:that.$route.query.usid,neid: that.$route.query.neid},function (resdata) {
                  console.log(resdata,'csdsdfs')
                  if(resdata.status == 200){
                    that.roid = resdata.data;
                    that.getMessageList();
                  }
                });
              }
            }
          });
        },
        sendMsg(){
          let that = this;
          this.$socket.emit('send_msg', {roid:that.roid,umsgtext:that.input_value,umsgtype:0},function (resdata) {
            if(resdata.status == 200){
              that.input_value = '';
            }
          });
        },
        getMessageList(){
          this.$http.get(this.$api.get_message_list,{
            params:{
              token:localStorage.getItem('token'),
              roid:this.roid,
              page_num: this.page_info.page_num,
              page_size: this.page_info.page_size
            }
          }).then(res => {
            if(res.data.status == 200){
              if(res.data.data.length >0){
                if(this.page_info.page_num >1){
                  this.message_list = this.message_list.concat(res.data.data.reverse());
                }else{
                  this.message_list = res.data.data.reverse();
                }
                this.page_info.page_num = this.page_info.page_num +1;
              }else{
                this.message_list = [];
                this.page_info.page_num = 1;
                this.total_count = 0;
              }
              this.isScroll = true;
              this.total_count = res.data.total_count;
              if(this.page_info.page_num == 2){
                 this.scrollBottom();
              }
            }
          })
        },
        scrollBottom(){
          this.$nextTick(() => {
            let container = this.$el.querySelector(".m-messageDetail-content:last-child");
            container.scrollIntoView();
          })

        },
        //滚动加载更多
        loadTop(e){
          if(this.isScroll){
            this.isScroll = false;
            let length = this.message_list.length;
            if(length == this.total_count){
              this.bottom_show = true;
            }else{
              this.getMessageList();
            }
          }


        },
        //上传图片
        uploadImg(e) {
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
          this.$http.post(this.$api.upload_file+'?type=news&token='+localStorage.getItem('token'),form).then(res => {
            if(res.data.status == 200){
              // let img = { niimg: res.data.data, nisort: this.img_box.length + 1 };
              // this.upload_img.push(res.data.data);
              let that = this;
              this.$socket.emit('send_msg', {roid:that.roid,umsgtext:res.data.data,umsgtype:1},function (resdata) {
                if(resdata.status == 200){
                }
              });
              reader.readAsDataURL(files[0]);

              reader.onload = function(e) {
                // that.edit_data[index].content.push(window.location.origin + res.data.data);
                event.srcElement.value = ""
              };
              this.$refs.uploadImg.value = "";
            }
          })
        },
        // 预览图片
        previewImage(image) {
          let images = [];
          for(let i = 0; i < this.message_list.length; i ++) {
            if(this.message_list[i].umsgtype == 1){
              images.push(location.origin + this.message_list[i].umsgtext);
            }
          }
          let options = {
            current: location.origin + image, // 当前显示图片的http链接
            urls: images,                  // 当前预览图片的list
          };
          wxapi.previewImage(options);
        },
      },

    }
</script>

<style scoped lang="less">
  @import "../../../common/css/index";
.m-messageDetail{
  min-height: 100vh;
  padding-bottom: 100px;
  background-color: #fafafa;
  .m-messageDetail-content{
    padding: 40px;
    .m-messageDetail-one{
      display: flex;
      flex-flow: row;
      align-items: flex-start;
      justify-content: flex-start;
      margin-top: 40px;
      width: 100%;
      .m-avator{
        display: inline-block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #fff;
        margin-right: 20px;
      }
      .m-message{
        position: relative;
        padding:  16px 0 0 16px;
        .m-triangle{
          width: 0;
          height: 0;
          border: 16px solid #fff;
          border-left:16px solid transparent;
          border-bottom:16px solid transparent;
          border-top:16px solid transparent;
          position: absolute;
          top:26px;
          left: -16px;
        }
        .m-message-content{
          padding: 5px 20px;
          background-color: #fff;
          font-size:28px;
          font-weight:300;
          line-height:40px;
          max-width: 500px;
          word-wrap:break-word;
          img{
            display: inline-block;
            width: 300px;
            height: 400px;
          }
        }
      }
      &.m-my{
        justify-content: flex-end;
        .m-avator{
          margin-right: 0;
          margin-left: 20px;
        }
        .m-message{
          position: relative;
          padding-right: 16px;
          .m-triangle{
            border: 16px solid #E6E6E6;
            border-right:16px solid transparent;
            border-bottom:16px solid transparent;
            border-top:16px solid transparent;
            position: absolute;
            top:26px;
            right: -16px;
            left: auto;
          }
          .m-message-content{
            background-color: #E6E6E6;
          }
        }
      }
    }
  }
  .m-messageDetail-footer{
    position: fixed;
    bottom:0;
    left: 0;
    padding: 20px;
    background-color: #fff;
    .flex-row(space-between);
    width: 750px;
    box-sizing: border-box;
    .m-icon-img{

      width: 46px;
      height: 46px;
      margin: 0 20px;
      position: relative;
      img{
        display: inline-block;
        width: 46px;
        height: 46px;
      }
      .m-upload-input{
        display: inline-block;
        width: 46px;
        height: 46px;
        position: absolute;
        top:0;
        left:0;
        border: none;
      }
    }
    .m-input{
      padding: 0 20px;
      height: 34px;
      line-height: 34px;
      border-left: 1px solid #EFEFEF;
      border-right: 1px solid #EFEFEF;
      width: 510px;
      box-sizing: border-box;
    }
    .m-send{
      color: @mainColor;
      padding: 0 20px;
      font-size: 28px;
      font-weight: 500;
    }
  }
}
</style>
