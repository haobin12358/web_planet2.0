<template>
    <div class="w-withdraw">
			<div class="w-withdraw-box">
				<div class="w-withdraw-amount">
					<p>提现金额</p>
					<div class="w-withdraw-form">
						<span>￥</span>
						<input type="text" class="w-withdraw-input" v-model="amount" placeholder="请输入金额">
						<span class="w-withdraw-icon-empty" :class="(!amount) ? '' : 'not-empty'" @click="emptyInput"></span>
					</div>
				</div>
				<div class="w-withdraw-attention">
					<p>提示：</p>
					<p>提交申请后，提现金额将在3个工作日内到微信钱包。</p>
				</div>
				<div class="w-foot-btn">
					<span>提交申请</span>
				</div>

			</div>
		</div>
</template>

<script type="text/ecmascript-6">
import common from '../../../common/js/common';
export default {
	data () {
		return {
			amount: null,
			user: { uc_count: '', mounth_count: '', usbalance: '' },
			moneyNum: '',
			num_box:null,
			usidentification:'',

		}
	},
	methods: {
		emptyInput(){
			this.amount = null;
		},
		getUser() {
        axios.get(api.get_agent_center + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200) {
            // this.user = res.data.data;
            this.moneyNum = res.data.usbalance;
          }
        })
        axios.get(api.get_home + "?token=" + localStorage.getItem('token')).then(res => {
          if(res.data.status == 200){
            // this.num_box = res.data.data;
            this.usidentification = res.data.usidentification;
          }
        })
			},
			
	},
	mounted() {
				common.changeTitle('提现');
				this.getUser();
	},
}
</script>

<style lang="less" scoped>
	@import "../../../common/css/index";
	.w-withdraw{
		background-color: #fff;
		.w-withdraw-box{
			.w-withdraw-amount{
				padding: 30px 60px;
				height: 280px;
				font-size: 28px;
				border-bottom: 10px solid #F4F4F4;
				.flex-col(space-between,flex-start);
				p{
					font-weight:400;
					line-height:40px;
					color: #666666;
					text-align: left;
				}
				.w-withdraw-form{
					width: 100%;
					.flex-row(space-between);
					.w-withdraw-input{
						display: inline-block;
						width: 350px;
						height: 70px;
						color: @mainColor;
						font-size: 48px;
						font-weight: 600;
					}
					.w-withdraw-icon-empty{
						width: 30px;
						height: 30px;
						background: none;
						&.not-empty{
							background: url("/static/images/storekeeper/store-icon-empty.png") no-repeat;
							background-size: 100% 100%;
						}
					}
				}
			}
			.w-withdraw-attention{
				padding: 0 60px;
				font-size: 28px;
				color: #666666;
				p{
					text-align: left;
					margin-top: 30px;
				}

			}
			.w-foot-btn{
          position: absolute;
          bottom: 50px;
          // left: 25px;
          span{
            color: #ffffff;
            display: inline-block;
            width: 750px;
            height: 106px;
            line-height: 106px;
            background:linear-gradient(304deg,@mainColor 0%,@subColor 100%);
            font-size: 38px;
            font-weight: bold;
          }
        }
		}
	}
</style>

