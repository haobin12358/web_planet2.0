<template>
  <div class="m-group">
    <!--顶部图片-->
    <img class="m-storekeeper-bg" src="/static/images/icon-integral-bg.png" alt="">
    <!--顶部文字-->
    <!--<div class="m-date-box" @click="datePopup = !datePopup">
      <div class="m-date-text m-ft-32 m-ft-b">{{date}}</div>
      <img class="m-date-img" src="/static/images/icon-down-open.png" v-if="datePopup">
      <img class="m-date-img" src="/static/images/icon-down-close.png" v-if="!datePopup">
    </div>-->
    <!--时间选择popup-->
    <mt-popup class="m-date-popup" v-model="datePopup" position="bottom">
      <p class="m-picker-text">
        <span class="cancel" @click="datePopup = false">取消</span>
        <span class="m-picker-btn" @click="dateDone">确定</span>
      </p>
      <mt-picker :slots="slots"  @change="onValuesChange" :visibleItemCount="7"></mt-picker>
    </mt-popup>
    <div class="m-total-text">
      {{total_text}}<span class="m-ft-90"> {{group.usvamout | money}} </span>元
    </div>
    <!--搜索-->
    <div class="m-selected-search">
      <!--<div class="m-search-input-box" @click="changeRoute('/search')">
        <span class="m-icon-search"></span>
        <span>搜索粉丝/下级店主</span>
      </div>-->
      <div class="m-input-search">
        <input class="m-search-input" v-model="search" type="text" :placeholder="searchTip">
        <span @click="searchPerson">查询</span>
      </div>
    </div>
    <div class="m-nav">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
    </div>
    <!--人员信息-->
    <div class="m-person">
      <ul>
        <li class="m-person-info" v-if="person.length > 0" v-for="item in person">
          <div class="m-img-name-time">
            <div class="m-img-box">
              <img class="m-img" :src="item.USheader" alt="">
            </div>
            <div class="m-name-time">
              <div class="m-name m-ft-28 m-ft-b">{{item.USname}}</div>
              <!--<div class="m-time m-ft-24">{{item.time}}</div>-->
            </div>
          </div>
          <div class="m-money m-ft-26">￥{{item.USsalesvolume | money}}</div>
        </li>
        <li class="m-ft-28" v-if="person.length == 0">暂无数据</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import navList from '../../../components/common/navlist';

  export default {
    data() {
      return {
        date: "",                       // 本月
        datePopup: false,               // 时间选择popup
        slots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'right'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            className: 'slot3',
            textAlign: 'left'
          }
        ],
        dateValue: [],                  // 暂存日期
        total_text: "",
        search: "",
        searchTip: "",
        nav_list: [
          { active: true, name: '粉丝', count: '0' }, { active: false, name: '下级店主', count: '0' }
        ],
        person: [],
        group: { usvamout: '' },
      }
    },
    components: { navList },
    methods: {
      // 跳转其他页面的方法
      changeRoute(v) {
        this.$router.push(v)
      },
      // 导航点击
      navClick(index) {
        let arr = [].concat(this.nav_list);
        for(let i = 0; i < arr.length; i ++) {
          arr[i].active = false;
        }
        arr[index].active = true;
        this.nav_list = [].concat(arr);
        if(index === 0) {         // 粉丝
          this.person = this.group.fens_detail;
          this.total_text = '团队粉丝总销售额';
          this.searchTip = '搜索粉丝';
        }else if(index === 1) {   // 下级店主
          this.person = this.group.sub_detail;
          this.total_text = '团队下级店主总销售额';
          this.searchTip = '搜索下级店主';
        }
      },
      // 时间popup确认按钮
      dateDone() {
        this.datePopup = false;
        this.date = this.dateValue[0] + "-" + this.dateValue[1];
        this.getInfo();               // 获取人员信息
      },
      onValuesChange(picker, values) {
        if(values[0]) {
          this.dateValue = values;
        }
      },
      // 获取团队销售额
      getGroup() {
        axios.get(api.get_salesvolume_all + '?token=' + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.group = res.data.data;
            this.navClick(0);
            this.nav_list[0].count = res.data.data.fens_detail.length;
            this.nav_list[1].count = res.data.data.sub_detail.length;
          }
        });
      },
      // 查询粉丝、下级店主
      searchPerson() {
        for(let i = 0; i < this.nav_list.length; i ++) {
          if(this.nav_list[i].active) {
            this.person = [];
            if(i === 0) {         // 粉丝
              for(let j = 0; j < this.group.fens_detail.length; j ++) {
                if(this.group.fens_detail[j].USname.indexOf(this.search) > -1) {
                  this.person.push(this.group.fens_detail[j]);
                }
              }
            }else if(i === 1) {   // 下级店主
              for(let j = 0; j < this.group.sub_detail.length; j ++) {
                if(this.group.sub_detail[j].USname.indexOf(this.search) > -1) {
                  this.person.push(this.group.sub_detail[j]);
                }
              }
            }
          }
        }
      },
      // 设置可选择的年份
      setYear() {
        let now = new Date();
        let year = Number(now.toString().substring(11, 15)) + 1;
        for(let i = 2018; i < year; i ++) {
          this.slots[0].values.push(i);
        }
        this.date = now.toString().substring(11, 15) + "-" + this.slots[2].values[now.getMonth()];
        this.dateValue = [now.toString().substring(11, 15), this.slots[2].values[now.getMonth()]];
      }
    },
    mounted() {
      common.changeTitle('我的团队');
      // this.setYear();                  // 设置可选择的年份
      this.getGroup();                    // 获取团队销售额
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/index";

  .m-group {
    min-height: 100%;
    position: relative;
    .m-storekeeper-bg {
      width: 750px;
      height: 400px;
    }
    .m-date-box {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 100px;
      left: 320px;
      .m-date-text {

      }
      .m-date-img {
        width: 24px;
        height: 12px;
        margin-left: 10px;
      }
    }
    .m-date-popup {
      .m-picker-text{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;
        font-size: 30px;
        padding: 10px 20px;
        span.cancel{
          color: #a4a4a4;
        }
      }
    }
    .m-total-text {
      font-size: 21px;
      position: absolute;
      top: 210px;
      left: 90px;
    }
    .m-selected-search {
      .m-search-input-box {
        width: 680px;
      }
      .m-input-search {
        width: 630px;
        display: flex;
        justify-content: space-between;
        .m-search-input {
          margin-left: 30px;
          display: inline-block;
          width: 430px;
          height: 42px;
          line-height: 42px;
          font-size: 24px;
          border-radius: 10px;
          padding: 2px 20px;
          border: 1px #CCCCCC solid;
        }
        span {
          width: 80px;
          white-space: nowrap;
          display: inline-block;
          padding: 4px 15px;
          border-radius: 10px;
          background-color: @mainColor;
          color: #fff;
          box-shadow:0 3px 6px rgba(0,0,0,0.16);
          font-size: 24px;
          line-height: 40px;
          margin-right: -30px;
        }
      }
    }
    .m-nav {
      /*width: 500px;*/
      margin: 0 0 50px 0;
    }
    .m-person {
      .m-person-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 60px 50px 60px;
        .m-img-name-time {
          display: flex;
          .m-img-box {
            width: 97px;
            height: 97px;
            margin-right: 30px;
            background-color: #EEEEEE;
            .m-img {
              width: 97px;
              height: 97px;
            }
          }
          .m-name-time {
            text-align: left;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            .m-name {

            }
            .m-time {

            }
          }
        }
        .m-money {

        }
      }
    }
  }
</style>
