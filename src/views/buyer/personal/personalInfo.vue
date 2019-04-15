<template>
  <div class="m-personal " >
    <div class="m-personal-bg">
      <span class="m-icon-bg"></span>
    </div>
    <div class="m-personal-content m-setUp">
      <div class="m-personal-info">
        <img :src="user.usheader" class="m-personal-head-portrait" alt="">
        <div class="m-personal-info-box">
          <div class="m-personal-info-text">
            <div>
              <p>{{user.usname}}</p>
              <p>
                <span class="m-personal-identity">{{user.usidname}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="m-personal-body">
        <div class="m-one-part">
          <ul class="m-edit-ul">
            <li>
              <div>
                <span>用户名</span>
              </div>
              <div>
                <input type="text" class="m-edit-input" v-model="name" placeholder="请输入用户名">
              </div>
            </li>
            <li @click="genderPopup = true">
              <div>
                <span>性别</span>
              </div>
              <div>
                <span>{{user.usGender}}</span>
                <span class="m-icon-more"></span>
              </div>
            </li>
            <li @click="openPicker('birthdayPicker')">
              <div>
                <span>出生日期</span>
              </div>
              <div>
                <span>{{birthday}}</span>
                <span class="m-icon-more"></span>
              </div>
            </li>
          </ul>
          <!--性别picker-->
          <mt-popup class="m-gender-popup" v-model="genderPopup" position="bottom">
            <div class="m-popup-btn">
              <div @click="genderPopup = false">取消</div>
              <div @click="genderDone">确认</div>
            </div>
            <mt-picker :slots="slots" @change="genderChange"></mt-picker>
          </mt-popup>
          <!--出生日期的picker-->
          <mt-datetime-picker ref="birthdayPicker" type="date" v-model="user.usbirthday" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
                             :startDate="startDate" :endDate="endDate" @confirm="handleChange">
          </mt-datetime-picker>
        </div>
      </div>
    </div>
    <div class="m-foot-btn">
      <span @click="saveUser">保 存</span>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
  import { Toast } from 'mint-ui';
  import moment from 'moment';                      // 格式化时间

  export default {
    data() {
      return {
        user: {},                             // 个人信息
        name: "",                             // 暂存用户名
        genderPopup: false,                   // 性别picker
        slots: [{ values: ['男', '女'] }],
        gender: "",                           // 暂存性别
        birthday: "",                         // 暂存出生日期
        startDate: new Date("1901-01-01"),
        endDate: new Date()
      }
    },
    components: {},
    methods: {
      // 跳转页面
      changeRoute(v){
        this.$router.push(v)
      },
      // 获取个人信息
      getUser() {
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            this.user = res.data.data;
            // 性别判断
            if(this.user.usgender == "0") {
              this.user.usGender = "男";
            }else if(this.user.usgender == "1") {
              this.user.usGender = "女";
            }
            this.name = this.user.usname;
            if(!this.user.usbirthday) {
              this.user.usbirthday = "1995-01-01";
            }
            this.birthday = this.user.usbirthday;
          }
        });
      },
      // 性别picker的确认按钮
      genderDone() {
        this.genderPopup = false;
        this.user.usGender = this.gender;
      },
      // picker选择的性别改变
      genderChange(picker, values) {
        this.gender = values[0];
      },
      // 打开date-picker
      openPicker(picker) {
        this.$refs[picker].open();
      },
      // picker选择的日期改变
      handleChange(value) {
        this.birthday = moment(value).format('YYYY-MM-DD');
      },
      // 保存用户信息
      saveUser() {
        let params = { usname: this.name, usbirthday: this.birthday };
        if(this.gender == "男") {
          params.usgender = "0";
        }else if(this.gender == "女") {
          params.usgender = "1";
        }
        axios.post(api.update_user + '?token=' + localStorage.getItem('token'), params).then(res => {
          if(res.data.status == 200){
            Toast(res.data.message);
          }
        });
      }
    },
    mounted() {
      common.changeTitle('个人资料');
      this.getUser();       // 获取个人信息
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../common/css/personal";

  .m-gender-popup {
    width: 750px;
    .m-popup-btn {
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      padding: 20px 40px 0 40px;
    }
  }
</style>
