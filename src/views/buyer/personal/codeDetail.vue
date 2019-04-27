<template>
  <div class="w-codeDetail">
		<div class="w-codeDetail-top">
			<div class="w-codeDetail-time">{{item.time}}</div>
      <div class="w-codeDetail-code">{{item.code}}</div> 
		</div>
		<div class="w-codeDetail-info">
			<div class="w-codeDetail-name">
				<span>姓名</span>
				<span class="w-codeDetail-text">{{item.acaname}}</span>

			</div>
			<div class="w-codeDetail-card">
				<span>银行卡号</span>
				<span class="w-codeDetail-text">{{item.acabanksn}}</span>

			</div>
			<div class="w-codeDetail-bank">
				<span>开户行</span>
				<span class="w-codeDetail-text">{{item.acabankname}}</span>

			</div>

		</div>
		<div class="w-codeDetail-cert">
			<p class="w-codeDetail-cert-text">打款凭证</p>
			<div class="w-codeDetail-cert-img" v-for="link in item.acavouchers">
				<img :src="link" alt="">
			</div>
			
		</div>

  </div>
</template>

<script type="text/ecmascript-6">
	import common from '../../../common/js/common';
  import axios from 'axios';
  import api from '../../../api/api';
	import { Toast } from 'mint-ui';
	
	export default {
    data () {
			return {
				acaid:'',
				item:{},
				
			}
		},
		methods:{
			getCodeDetail(){
				let params = {
					acaid: this.acaid,
					token: localStorage.getItem('token'),
				}
				axios.get(api.act_code_get_detail,{ params: params }).then(res => {
					if(res.data.status == 200){
						// console.log(res.data.data);
						this.item=res.data.data;
						console.log(this.item);
					}
				});

			}

		},
		mounted () {
			common.changeTitle("购买详情");
			this.acaid=this.$route.query.acaid;
			this.getCodeDetail();
			
		},
	}
</script>

<style lang="less" rel="stylesheet/less" scoped>
	@import "../../../common/css/index";

	.w-codeDetail{
		background-color: #fff;
		color: #000000;
		.w-codeDetail-top{
			// height: 100px;
			font-size: 28px;
			padding: 34px 40px;
			border-bottom: 1px solid #F2F2F2;
			.flex-row(space-between);
			.w-codeDetail-time{
				display: inline-block;

			}
			.w-codeDetail-code{
				display: inline-block;
				font-weight: 500;

			}
		}
		.w-codeDetail-info{
			// height: 300px;
			padding: 15px 40px;
			border-bottom: 10px solid #F4F4F4;
			
			div{
				.flex-row(space-between);
				font-size: 28px;
				margin: 15px 0;
				span{
					display: inline-block;
				}
				.w-codeDetail-text{
					font-weight: 400;
				}
			}
			
			
		}
		.w-codeDetail-cert{
			padding: 30px 40px;
			.w-codeDetail-cert-text{
				text-align: left;
				font-size: 28px;
				font-weight:400;
			}
			.w-codeDetail-cert-img{
				.flex-col(flex-start,flex-start);
				img{
					width: 380px;
					height: 250px;
					margin-top: 30px;
				}
			}

		}
	}

</style>


