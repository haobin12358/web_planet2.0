<template>
  <div class="w-codeDetail">
		<div class="w-codeDetail-top">
			<div class="w-codeDetail-time">{{index}}</div>
      <div class="w-codeDetail-code"></div> 
		</div>
		<div class="w-codeDetail-info">
			<div class="w-codeDetail-name">
				<span>姓名</span>

			</div>
			<div class="w-codeDetail-card">
				<span>银行卡号</span>

			</div>
			<div class="w-codeDetail-bank">
				<span>开户行</span>

			</div>

		</div>
		<div class="w-codeDetail-cert">
			<p class="w-codeDetail-cert-text">打款凭证</p>

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
				index:'',
				
			}
		},
		methods:{

		},
		mounted () {
			common.changeTitle("购买详情")
			this.index=this.$route.query.index
			
		},
	}
</script>

<style lang="less" rel="stylesheet/less" scoped>
	@import "../../../common/css/index";

	.w-codeDetail{
		background-color: #fff;
		.w-codeDetail-top{
			height: 100px;
			border-bottom: 1px solid #F2F2F2;
			.w-codeDetail-time{

			}
			.w-codeDetail-code{

			}
		}
		.w-codeDetail-info{
			height: 300px;
			border-bottom: 10px solid #F4F4F4;
			.w-codeDetail-name{

			}
			.w-codeDetail-card{

			}
			.w-codeDetail-bank{

			}
		}
		.w-codeDetail-cert{
			padding: 30px 40px;
			.w-codeDetail-cert-text{
				text-align: left;
				font-size: 28px;
				font-weight:400;
			}

		}
	}

</style>


