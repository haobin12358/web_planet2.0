<template>
	<div class="w-product-detail">
		<div class="w-product-swipe">

		</div>
		<div class="w-product-cost">
			<div class="w-product-deposit">
				押金 ¥{{price}}
				<span class="w-product-gift"></span>
			</div>
			<div class="w-product-price-box">
				<span class="w-product-price">价格 <span class="w-product-price-line">¥290</span></span>
				<span class="w-product-market">市场价 <span class="w-product-price-line">¥290</span></span>
			</div>

		</div>
		<div class="w-product-info">
			<div class="w-product-title">
				<span class="w-product-block">大行星</span>
				TAWA防水帐篷户外野营必备TAWA防水帐篷户外野营必备TAWA防水帐篷户外野营必备TAWA篷TAWA防水帐篷户外野营必备TAWA防水帐篷户外野营必备TAWA防水帐篷户外野营必备TAWA篷
			</div>
			<div class="w-product-prop">
				<span>运费：6元</span>
				<span>运费：6元</span>
				<span>运费：6元</span>
			</div>
		</div>
		<div class="w-product-format">
			<span class="w-product-format-text">规格</span>
			<div class="w-product-format-select">选择 <span>  颜色分类  重量</span></div>
			<div class="w-product-format-more"></div>
		</div>
		<div class="w-product-rule">
			<span class="w-product-rule-title">规则</span>
			<span class="w-product-rule-text">通过分享点击进入，点击自由选择ABC档…</span>
		</div>
		<div class="w-product-product-img">
			<img>
		</div>

	</div>
</template>

<script>
import sku from '../../views/buyer/components/sku';
export default {
	name:'productDetail',
	props:{
		product:{
			type:Object,
			default:null,
		},
		price:{
			type:Number,
			default:50,
		}

	}
}
</script>

<style lang="less" scoped>
	@import "../../common/css/index";
	.w-product-detail{
		.w-mb-img{
			width: 750px;
			height: 750px;
			background-color: black;
		}
		.w-product-cost{
			// width:100%;
			padding: 20px 24px;
			// .flex-row(flex-start);
			// flex:1;
			
			.w-product-deposit{
				width: 100%;
				.flex-row(flex-start);
				font-size: 40px;
				font-weight: 600;
				color: #E22300;
				.w-product-gift{
					display: inline-block;
					width: 40px;
					height: 40px;
					margin-left: 20px;
					background: url("./static/images/activity/mb-gift.png") no-repeat;
					background-size: 100% 100%;
				}
			}
			.w-product-price-box{
				width:100%;
				.flex-row(space-between);
				.w-product-price-line{
					text-decoration: line-through;
				}
				.w-product-price{
					font-size:24px;
					color: #C1C1C1;
				}
				.w-product-market{
					font-size:24px;
					color: #000;
				}
			}
		}
		.w-product-info{
			border-bottom: 1px solid #F2F2F2;
			.w-product-title{
				padding: 0 24px;
				text-align: left;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
				.w-product-block{
					display: inline-block;
					text-align: center;
					width:92px;
					height:33px;
					line-height: 33px;
					color: #fff;
					background: linear-gradient(270deg,@subColor 0%,@mainColor 100%);
				}
			}
			.w-product-prop{
				padding: 20px 24px;
				color: #C1C1C1;
				.flex-row(space-between);
			}
		}
		.w-product-format{
			padding: 25px 24px;
			border-bottom: 1px solid #F2F2F2;
			.flex-row(space-between);
			.w-product-format-text{
				display: inline-block;
				margin-right: 90px;
				color: #666666;
			}
			.w-product-format-select{
				width:400px;
				flex: 1;
				text-align:left;
			}
			.w-product-format-more{
				// display: flex;
				width:17px;
				height:30px;
				background: url("./static/images/activity/mb-more.png") no-repeat;
				background-size: 100% 100%;
				// justify-self: flex-end;
			}
		}
		.w-product-rule{
			padding: 25px 24px;
			border-bottom: 1px solid #F2F2F2;
			.flex-row(flex-start);
			.w-product-rule-title{
				display: inline-block;
				margin-right: 90px;
				color: #666666;
			}
			.w-product-rule-text{
				flex: 1;
				text-align: left;
			}
		}
	}
</style>

