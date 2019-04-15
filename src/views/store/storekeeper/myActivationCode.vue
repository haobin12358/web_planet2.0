<template>
  <div class="m-my-code" @touchmove="touchMove">
    <div class="m-cell-box">
      <!--<mt-cell-swipe v-for="item in codeList" :key="item.uacid"
                     :right="rightButtons" :title="item.uaccode">
      </mt-cell-swipe>-->
      <div class="m-code-item" v-if="codeList.length > 0" v-for="(item, index) in codeList">
        <div class="m-code-text">激活码：{{item.uaccode}}</div>
        <div class="m-code-status">{{item.uacstatus_zh}}</div>
        <div class="m-code-copy-btn" :class="item.uacstatus == 10 ? 'un-active' : ''" @click="copyText(index)">复制</div>
      </div>
      <p class="m-no-data" v-if="codeList.length == 0">暂无数据</p>
      <bottom-line v-if="bottom_show"></bottom-line>
    </div>
  </div>
</template>

<script>
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';
  import bottomLine from '../../../components/common/bottomLine';
  export default {
    data() {
      return {
        codeList: [],
        bottom_show: false,
        page_info: { page_num: 1, page_size: 16 },
        isScroll: true,
        total_count: 0
      }
    },
    components:{ bottomLine },
    methods: {
      //滚动加载更多
      touchMove(e){

        let scrollTop = common.getScrollTop();
        let scrollHeight = common.getScrollHeight();
        let ClientHeight = common.getClientHeight();
        if (scrollTop + ClientHeight  >= scrollHeight -10) {
          if(this.isScroll){
            this.isScroll = false;

            if(this.codeList.length == this.total_count){
              this.bottom_show = true;
            }else{
              this.getMyCode()
            }
          }
        }
      },
      // 获取个人激活码列表
      getMyCode() {
        let start = this.page_info.page_num;
        axios.get(api.list_act_code + '?token=' + localStorage.getItem('token'),{
          params:{
            page_size:this.page_info.page_size,
            page_num:start,
          }
        }).then(res => {
          if(res.data.status == 200){
            // console.log(res.data.data);
           if(res.data.data.length >0){
              this.page_info.page_num = this.page_info.page_num +1;
            }else{
              this.page_info.page_num = 1;
              this.total_count= 0;
              return false;
            }
            if(start >1){
              this.codeList = this.codeList.concat(res.data.data);
            }else{
              this.codeList = res.data.data;
            }
            this.isScroll = true;
            this.total_count = res.data.total_count;

          }
        });
      },
      // 复制文本
      copyText(index) {
        let text = this.codeList[index].uaccode;
        this.$copyText(text).then(function (e) {
          Toast("已复制到剪切板");
        }, function (e) {
          console.log(e);
        })
      }
    },
    mounted() {
      common.changeTitle('我的激活码');
      this.getMyCode();            // 获取个人激活码列表

      this.rightButtons = [
        {
          content: 'Mark as Unread',
          style: { background: 'lightgray', color: '#fff' }
        },
        {
          content: 'Delete',
          style: { background: 'red', color: '#fff' },
          handler: () => this.$messagebox('delete')
        }
      ];
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-my-code {
    min-height: 100vh;
    background-color: #fff;
    .m-cell-box {
      .m-code-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 60px;
        padding: 20px 0;
        border-bottom: 1px #CCCCCC solid;
        font-size: 24px;
        &:first-child {
          padding-top: 40px;
        }
        .m-code-text {

        }
        .m-code-status {

        }
        .m-code-copy-btn {
          padding: 4px 30px;
          border-radius: 10px;
          background-color: @mainColor;
          color: #fff;
          box-shadow:0 3px 6px rgba(0,0,0,0.16);
          line-height: 40px;
          &.un-active {
            background-color: #CCCCCC;
          }
        }
      }
      .m-no-data {
        margin-top: 100px;
        font-size: 28px;
      }
    }
  }
</style>
