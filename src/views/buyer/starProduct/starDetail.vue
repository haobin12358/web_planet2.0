<template>
    <div class="m-starDetail">
      <nav-list :navlist="nav_list" @navClick="navClick"></nav-list>
      <div class="m-date-select">
        <div class="m-date-time" @click="openPicker">
          <span>{{now}}</span>
          <img src="/static/images/newpersonal/icon-date-more.png" class="m-date-more" alt="">
        </div>
        <span>总计+100</span>
        <div class="m-date-popup-box">
          <mt-popup class="m-date-popup" v-model="popupVisible" position="bottom">
            <div class="m-popup-btn">
              <div @click="popupVisible = false">取消</div>
              <div @click="timeDone">确认</div>
            </div>
            <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
          </mt-popup>
        </div>
      </div>

      <div class="m-starDetail-content">
<!--        获取记录-->
        <ul class="m-detail-list">
          <li class="m-flex-start">
            <div class="m-detail-list-text">
              <p class="m-flex-between">
                <span class="m-detail-list-title">签到</span>
                <span>+10</span>
              </p>
              <p class="m-time">2018-0-20  14:12:31</p>
            </div>
          </li>
        </ul>
<!--     消耗明细   -->
        <ul class="m-detail-list">
          <li class="m-flex-start">
            <img src="" class="m-detail-list-img" alt="">
            <div class="m-detail-list-text">
              <p class="m-flex-between">
                <span class="m-detail-list-title">签到</span>
                <span>+10</span>
              </p>
              <p class="m-time">2018-0-20  14:12:31</p>
            </div>
          </li>
        </ul>
        <p class="m-no-data">暂无获取记录</p>
      </div>

    </div>
</template>

<script>
import navList from '../../../components/common/navlist';


    export default {
        name: "starDetail",
      data(){
          return{
            nav_list:[
              {
                name:'获取记录',
                value:'',
                active:true
              },
              {
                name:'消耗明细',
                value:'',
                active:false
              }
            ],
            popupVisible: false,
            slots: [
              {
                flex: 1,
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
            now:''
          }
      },
      components:{navList},
      mounted(){
        this.initYear()
      },
      methods:{
        initYear(){
          let _date = new Date();
          let year = _date.getFullYear();
          let arr =[];
          for(let i=0;i<=(year-2018);i++){
            arr.push(String(Number(2018) + Number(i)))
          }
         this.slots[0].values = arr.concat([]);
          let month = _date.getMonth()+1 >9? _date.getMonth()+1 : '0'+(_date.getMonth()+1);

          this.now = `${year}-${month}`
        },
        navClick(index){
          for(let i in this.nav_list){
            this.nav_list[i].active = false;
          }
          this.nav_list[index].active = true;
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
        },
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
