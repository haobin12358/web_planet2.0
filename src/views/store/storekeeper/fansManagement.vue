<template>
  <div class="m-fans-management">
    <!--顶部内容-->
    <div class="m-fans-num">粉丝数：123</div>
    <!--粉丝集合-->
    <div class="m-fans-box">
      <div class="m-fans-item" v-for="item in fansList">
        <div class="m-item-radio">
          <img class="m-fans-radio" src="/static/images/icon-radio.png" v-if="!item.choose" @click="chooseFans(item)">
          <img class="m-fans-radio" src="/static/images/icon-radio-active.png" v-if="item.choose" @click="chooseFans(item)">
        </div>
        <div class="m-item-radius">
          <div class="m-item-left">
            <img class="m-fans-img" :src="item.img" alt="">
          </div>
          <div class="m-item-right">
            <div class="m-fans-name">{{item.name}}</div>
            <div class="m-fans-time">{{item.time}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--移除粉丝按钮区-->
    <div class="m-fans-remove">
      <img class="m-fans-all-radio" src="/static/images/icon-radio.png" v-if="!fansAll" @click="chooseAllFans()">
      <img class="m-fans-all-radio" src="/static/images/icon-radio-active.png" v-if="fansAll" @click="chooseAllFans()">
      <div class="m-fans-all-text">全选</div>
      <div class="m-fans-remove-btn" @click="removeFans">移除粉丝</div>
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import { Toast, MessageBox } from 'mint-ui';

  export default {
    name: "fansManagement",
    data() {
      return {
        fansList: [             // 粉丝list
          { id: "1", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "2", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "3", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
          { id: "4", img: "http://dummyimage.com/100x100", name: "咕咕", time: "2018/09/26", choose: false },
        ],
        fansChooseList: [],    // 选中的粉丝list
        fansAll: false         // 是否已全选粉丝
      }
    },
    components: {},
    methods: {
      // 选择粉丝
      chooseFans(item) {
        if(item.choose) {
          item.choose = false;
          // 从选中粉丝list中移除
          for(let i = 0; i < this.fansChooseList.length; i ++) {
            if(item.id == this.fansChooseList[i]) {
              this.fansChooseList.splice(i, 1);
            }
          }
        }else {
          item.choose = true;
          this.fansChooseList.push(item.id);
        }
      },
      // 选择/取消选择所有粉丝
      chooseAllFans() {
        if(this.fansAll) {
          for(let i = 0; i < this.fansList.length; i ++) {
            this.fansList[i].choose = false;
          }
          this.fansChooseList = this.fansChooseList.concat();
          this.fansAll = false;
          this.fansChooseList = [];
        }else {
          this.fansChooseList = [];
          for(let i = 0; i < this.fansList.length; i ++) {
            this.fansList[i].choose = true;
            this.fansChooseList.push(this.fansList[i].id);
          }
          this.fansChooseList = this.fansChooseList.concat();
          this.fansAll = true;
        }
      },
      // 移除粉丝按钮
      removeFans() {
        let msg = "";
        if(this.fansChooseList.length < 1) {
          Toast('请先选择粉丝');
        }else {
          if(this.fansChooseList.length > 1) {
            msg = "确认移除这些粉丝？"
          }else {
            msg = "确认移除该粉丝？"
          }
          MessageBox.confirm(msg).
          then(() => {
            console.log(this.fansChooseList);
          }).catch(() => {

          });
        }
      }
    },
    mounted() {
      common.changeTitle('粉丝管理');
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-fans-management {
    min-height: 100vh;
    background-color: #EEEEEE;
    .m-fans-num {
      font-size: 24px;
      padding: 20px 45px;
      text-align: left;
    }
    .m-fans-box {
      padding: 0 45px 100px 45px;
      .m-fans-item {
        display: flex;
        .m-item-radio {
          .m-fans-radio {
            width: 30px;
            height: 30px;
            margin: 55px 30px 55px 5px;
          }
        }
        .m-item-radius {
          display: flex;
          width: 590px;
          height: 100px;
          background-color: #ffffff;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          .m-item-left {
            .m-fans-img {
              width: 100px;
              height: 100px;
              border-radius: 10px;
            }
          }
          .m-item-right {
            display: flex;
            flex-direction: column;
            margin: 0 0 10px 30px;
            text-align: left;
            .m-fans-name {
              flex: 1;
              color: #666666;
              font-size: 24px;
              font-weight: bold;
            }
            .m-fans-time {
              color: #999999;
              font-size: 24px;
            }
          }
        }
      }
    }
    .m-fans-remove {
      width: 660px;
      padding: 20px 45px;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      position: fixed;
      bottom: 0;
      .m-fans-all-radio {
        width: 30px;
        height: 30px;
      }
      .m-fans-all-text {
        flex: 1;
        text-align: left;
        font-size: 24px;
        margin-left: 15px;
      }
      .m-fans-remove-btn {
        font-size: 30px;
        letter-spacing: 2px;
        padding: 10px 65px;
        border-radius: 30px;
        background: linear-gradient(90deg, @subColor 0%, @mainColor 100%);
      }
    }
  }
</style>
