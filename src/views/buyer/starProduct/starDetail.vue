<template>
    <div class="m-starDetail" @touchmove="touchMove">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
      <div class="m-date-select">
        <div class="m-date-time" @click="openPicker">
          <span>{{now}}</span>
          <img src="/static/images/newpersonal/icon-date-more.png" class="m-date-more" alt="">
        </div>
        <span>总计:{{month_total}}</span>
      </div>
      <div class="m-date-popup-box">
        <mt-popup class="m-date-popup" v-model="popupVisible" position="bottom">
          <div class="m-popup-btn">
            <div @click="popupVisible = false">取消</div>
            <div @click="timeDone">确认</div>
          </div>
          <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
        </mt-popup>
      </div>
      <div class="m-starDetail-content">

        <ul class="m-detail-list" v-if="history_list.length >0  ">
          <li class="m-flex-start" v-for="(item,index) in history_list">
            <img :src="item.prmainpic" class="m-detail-list-img" v-if="select_nav.name == '消耗明细'" alt="">
            <div class="m-detail-list-text">
              <p class="m-flex-between">
                <span class="m-detail-list-title">{{item.uiaction}}</span>
                <span>+{{item.uiintegral}}</span>
              </p>
              <p class="m-time">{{item.createtime}}</p>
            </div>
          </li>
        </ul>
        <p class="m-no-data" v-else>暂无{{select_nav.name}}记录</p>
        <bottom-line v-if="bottom_show"></bottom-line>
      </div>

    </div>
</template>

<script>
import navList from '../../../components/common/navlist';
import common from '../../../common/js/common';
import {Toast} from 'mint-ui';
import bottomLine from '../../../components/common/bottomLine';

    export default {
        name: "starDetail",
      data(){
          return{
            nav_list:[
              {
                name:'获取记录',
                value:'income',
                active:true
              },
              {
                name:'消耗明细',
                value:'expenditure',
                active:false
              }
            ],
            select_nav:{},
            popupVisible: false,
            slots: [
              {
                flex: 1,
                defaultIndex:0,
                values: ['2018', '2019', '2020', '2021', '2022', '2023'],
                className: 'slot1',
                textAlign: 'right'
              }, {
                divider: true,
                content: ' - ',
                className: 'slot2'
              }, {
                flex: 1,
                defaultIndex: 0,
                values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                className: 'slot3',
                textAlign: 'left'
              }
            ],
            now:'',
            page_info:{
              page_num:1,
              page_size:10
            },
            isScroll:true,
            total_count:0,
            total_page:0,
            bottom_show:false,
            history_list:[],
            month_total:0
          }
      },
      components:{navList,bottomLine},
      mounted(){
        common.changeTitle('星币商城');
        this.initYear();
        this.navClick(this.$route.query.index)
      },
      methods:{
        //滚动加载更多
        touchMove(e){
          let scrollTop = common.getScrollTop();
          let scrollHeight = common.getScrollHeight();
          let ClientHeight = common.getClientHeight();
          if (scrollTop + ClientHeight  >= scrollHeight -10) {
            if(this.isScroll){
              this.isScroll = false;
              if(this.page_info.page_num > this.total_page){
                this.bottom_show = true;
              }else{
                this.getInfo();

              }
            }
          }
        },
        initYear(){
          let _date = new Date();
          let year = _date.getFullYear();
          let arr =[];
          for(let i=0;i<=(year-2018);i++){
            arr.push(String(Number(2018) + Number(i)))
          }
         this.slots[0].values = arr.concat([]);
          let month = _date.getMonth()+1 >9? _date.getMonth()+1 : '0'+(_date.getMonth()+1);
          for(let i in this.slots[0].values){
            if(this.slots[0].values[i] == year)
                 this.slots[0].defaultIndex = Number(i);
          }
          console.log(this.slots[0].defaultIndex, year)
          for(let j in this.slots[2].values){
            if(this.slots[2].values[j] == month)
              this.slots[2].defaultIndex = Number(j);
          }
          this.now = `${year}-${month}`
        },
        navClick(index){
          for(let i in this.nav_list){
            this.nav_list[i].active = false;
          }
          this.nav_list[index].active = true;
          this.select_nav = this.nav_list[index];
          this.page_info.page_num = 1;
          this.getInfo();
        },
        // 打开 - 关闭时间选择器
        openPicker() {
          if(this.popupVisible) {
            this.popupVisible = false;
          }else {
            this.popupVisible = true;
          }
        },
        // 监听时间选择器
        onValuesChange(picker, values) {
          this.timeValue = values;
        },
        // 时间选择器的确认按钮
        timeDone() {
          this.now = this.timeValue[0] + "-" + this.timeValue[1];
          // this.getIncomeList();         // 获取店主收益详情
          this.popupVisible = false;
          this.getInfo();
        },
        getInfo(){
          let start = this.page_info.page_num;
          this.$http.get(this.$api.get_user_integral,{
            params:{
              token:localStorage.getItem('token'),
              page_num:start,
              page_size:this.page_info.page_size,
              uifilter:this.select_nav.value,
              time:this.now
            }
          }).then(res => {
            if(res.data.status == 200){
              this.month_total = res.data.data.month_total;
              if(res.data.data.uilist.length >0){
                this.page_info.page_num =   this.page_info.page_num +1;
              }else{
                this.history_list = res.data.data.uilist;
                return false;
              }
              if(start >1){
                this.history_list = this.history_list.concat(res.data.data.uilist);
              }else{
                this.history_list = res.data.data.uilist;
              }
              this.isScroll = true;
              this.total_count = res.data.total_count;
              this.total_page = res.data.total_page;
            }
          },error => {
            Toast({ message: error.data.message,duration:1000, className: 'm-toast-fail' });
          })
        }
      }
    }
</script>

<style scoped lang="less">
@import "../../../common/css/index";
  .m-starDetail{
    background-color: #fff;
    .m-starDetail-content{

    }
  }
</style>
