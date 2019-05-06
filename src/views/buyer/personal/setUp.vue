<template>
  <div class="w-setting">
		<div class="w-setting-box">
			<div class="w-setting-item">
				<span>用户生日</span>
				<span class="w-setting-right" @click="openPicker('birthdayPicker')">{{birthday}}</span>

			</div>
			<div class="w-setting-item"  @click="changeRoute('/personal/addressManagement')">
				<span>地址管理</span>
				<span class="w-setting-icon-more"></span>

			</div>
			<div class="w-setting-item" @click="clearCache">
				<span>清除缓存</span>
				<span class="w-setting-icon-more"></span>
				<!-- 暂不现实缓存大小 -->

			</div>
			<div class="w-setting-item">
				<span>当前版本</span>
				<span class="w-setting-right">{{$store.state.version}}</span>

			</div>

		</div>
		<mt-datetime-picker ref="birthdayPicker" type="date" v-model="user.usbirthday" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
                             :startDate="startDate" :endDate="endDate" @confirm="handleChange">
    </mt-datetime-picker>
	</div>
</template>


<script type="text/ecmascript-6">
  import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
	import { Toast, MessageBox } from 'mint-ui';
  import moment from 'moment';  

  export default {
    data() {
      return {
        name: '',
				user: {},              // 个人信息
				birthday:"",
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
            this.name = this.user.usname;
            if(!this.user.usbirthday) {
              this.user.usbirthday = "1995-01-01";
            }
            this.birthday = this.user.usbirthday;
          }
        });
			},
			// 打开date-picker
      openPicker(picker) {
        this.$refs[picker].open();
      },
      // picker选择的日期改变
      handleChange(value) {
				this.birthday = moment(value).format('YYYY-MM-DD');
				console.log(this.birthday);
				this.saveUser();
      },
      // 保存用户信息
      saveUser() {
        let params = {
					usname: this.name,
					usbirthday: this.birthday
				};
        // if(this.gender == "男") {
        //   params.usgender = "0";
        // }else if(this.gender == "女") {
        //   params.usgender = "1";
        // }
        axios.post(api.update_user + '?token=' + localStorage.getItem('token'), params).then(res => {
          if(res.data.status == 200){
            Toast(res.data.message);
          }
        });
      },
      // 清除缓存
      clearCache() {
        MessageBox.confirm('之后您可能需要重新登录，是否继续').then(() => {
          localStorage.clear();
          window.location.href = window.location.origin;
          // this.$router.push('/select');
          // this.$store.state.show_login = true;
          // this.$router.go(0);
        }).catch(() => {

        });
      }
    },
    mounted() {
      common.changeTitle('设置中心');
      this.getUser();       // 获取个人信息
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
	@import "../../../common/css/index";
	.w-setting{
		.w-setting-box{
			font-size:28px;
			font-weight:400;
			.w-setting-item{
				padding:30px 40px;
				border-bottom: 1px solid #F2F2F2;
				color: #000000;
				.flex-row(space-between);
				span{
					display: inline-block;
				}
				.w-setting-right{
					color:#999999;
				}
				.w-setting-icon-more{
					width: 17px;
					height: 30px;
					background: url("/static/images/storekeeper/store-icon-more.png") no-repeat;
					background-size: 100% 100%;
				}
			}
		}
	}
	
</style>
