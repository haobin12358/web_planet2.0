<template>
    <div class="m-search">
      <div class="m-flex-between m-search-top">
        <div class="m-search-input-box">
          <input type="text" v-model="searchContent" maxlength="20" @input="searchInfo" @keypress="keyPress" :placeholder="placeholder">
          <span class="m-icon-close" @click="clearInput"></span>
        </div>
        <span @click="returnBack">取消</span>
        <!--<span @click="changeRoute" v-if="searchContent">搜索</span>-->
      </div>

      <div class="m-search-content" v-if="isNews">
        <div class="m-search-one" v-if="!result_list && history_list">
          <p class="m-ft-22 m-flex-between">
            <span>历史记录</span>
            <span @click="clearHistory">清除</span>
          </p>
          <ul class="m-search-result-ul" v-if="result_list">
            <li v-for="item in result_list" @click="changeRoute(item)">
              <span>{{item.ushname}}</span>
              <span class="m-icon-go"></span>
            </li>
          </ul>
        </div>
        <div class="m-search-one" v-else>
          <ul class="m-search-result-ul" v-if="result_list">
            <li v-for="item in result_list" @click="changeRoute(item)">
              <span>{{item.ushname}}</span>
              <span class="m-icon-go"></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="m-search-content" v-else>
        <div class="m-search-one" v-if="!result_list && history_list">
          <p class="m-ft-22 m-flex-between">
            <span>历史记录</span>
            <span @click="clearHistory">清除</span>
          </p>
          <ul class="m-tab-ul">
            <li v-for="item in history_list" @click="changeRoute(item)">{{item.ushname}}</li>
          </ul>
        </div>
        <div class="m-search-one" v-if="isCircle">
          <p class="m-ft-22 m-flex-between" v-if="recommendList.length">
            <span>推荐圈子</span>
            <!--<span class="m-icon-delete"></span>-->
          </p>
          <ul class="m-tab-ul">
            <li v-for="item in recommendList" @click="changeRoute(item, 'recommend')">{{item.itname}}</li>
          </ul>
        </div>
        <ul class="m-search-result-ul" v-if="result_list">
          <li v-for="item in result_list" @click="changeRoute(item)">
            <span>{{item.ushname}}</span>
            <span class="m-icon-go"></span>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import api from '../../api/api'
  import {Toast} from 'mint-ui';
    export default {
        data(){
          return{
            placeholder: '',
            searchContent: '',
            history_list: null,
            result_list: null,
            isNews: false,
            isCircle: false,
            recommendList: []
          }
        },
      mounted(){
          this.historySearch();
          // 在圈子的搜索时才显示推荐圈子
          if(this.$route.query.shtype == 'news') {
            this.placeholder = '圈子搜索关键词(标题名/内容)';
            this.isCircle = true;
            this.getNav();
          }else {
            this.placeholder = '商品搜索关键词(商品名/品牌名)'
          }
      },
      methods:{
        // 获取圈子所在的标签
        getNav() {
          axios.get(api.items_list + "?ittype=10&recommend=1").then(res => {
            if(res.data.status == 200) {
              this.recommendList = res.data.data;
            }
          })
        },
          /*返回*/
        returnBack(){
          this.$router.go(-1)
        },
        /*获取用户搜索历史纪录*/
        historySearch(){
          axios.get(api.search_history,{
            params:{
              token:localStorage.getItem('token'),
              shtype: this.$route.query.shtype || 'product'
            }
          }).then(res => {
            if(res.data.status ==200){
              if(res.data.data.length > 0){
                this.history_list = res.data.data;
              }
            }
          })
        },
        /*搜索结果*/
        searchInfo(){
          if(this.searchContent) {
            axios.get(api.guess_search,{
              params:{
                kw:this.searchContent,
                shtype:this.$route.query.shtype || 'product'
              }
            }).then(res => {
              if(res.data.status ==200){
                this.result_list = res.data.data;
              }
            })
          }
        },
        /*切换路由*/
        changeRoute(item, where){
          this.searchContent = (item && item.ushname )|| this.searchContent;
          if(this.$route.query.shtype) {
            if(where) {
              this.$router.push({path:'/circle',query:{itid: item.itid}})
            }else {
              this.$router.push({path:'/circle',query:{kw: this.searchContent}})
            }
          }else{
            this.$router.push({path:'/product',query:{kw: this.searchContent}})
          }

        },
        /*清楚历史*/
        clearHistory(){
          axios.post(api.del_search_history+'?token='+ localStorage.getItem('token'),{
            shtype:this.$route.query.shtype || 'product'
          }).then(res => {
            if(res.data.status == 200){
              this.history_list = null;
            }
          })
        },
        /*清楚搜索内容*/
        clearInput(){
          this.searchContent = '';
        },
        /*键盘搜索*/
        keyPress(e){
          if(e.keyCode == 13){
            this.changeRoute();
          }
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/css/index";
.m-search{
  color: #666666;
  .m-search-top{
    border-bottom: 1px solid @borderColor;
    padding: 20px 33px;
    .m-search-input-box{
      width: 627px;
      border-radius: 30px;
      background-color: #eee;
      height: 50px;
      position: relative;
      input{
        position: absolute;
        top: 0;
        left:0;
        width: 530px;
        height: 50px;
        line-height: 50px;
        background-color: transparent;
        border: none;
        padding-left: 40px;
        font-size: 21px;
      }
      .m-icon-close{
        position: absolute;
        right: 15px;
        top:12.5px;
        width: 25px;
        height: 25px;
        background: url("/static/images/icon-search-close.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .m-search-content{
    padding: 13px 33px;
    .m-icon-delete{
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url("/static/images/icon-search-delete.png") no-repeat;
      background-size: 100% 100%;
    }
    .m-icon-history{
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url("/static/images/icon-history.png") no-repeat;
      background-size: 100% 100%;
    }
    .m-tab-ul{
      .flex-row(flex-start);
      flex-wrap: wrap;
      margin-bottom: 20px;
      li{
        padding: 5px 51px;
        background-color: #E9E9E9;
        border-radius: 30px;
        margin: 20px 30px 20px 0;
      }
    }
    .m-search-result-ul{
      li{
        .flex-row(space-between);
        padding: 10px;
        border-bottom: 1px solid @borderColor;
        .m-icon-go{
          display: block;
          width: 25px;
          height: 25px;
          background: url("/static/images/icon-go.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }

}
</style>
