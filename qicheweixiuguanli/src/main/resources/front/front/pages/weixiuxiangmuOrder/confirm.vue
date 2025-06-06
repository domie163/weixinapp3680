<template>
	<view class="content">
		<form>
			<view class="cu-form-group">
				<view class="title">预定时间</view>
				<view>
					<input v-model="weixiuxiangmuOrderTime" placeholder="预定时间"
						@tap="toggleTab('weixiuxiangmuOrderTime')"></input>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">维修车辆</view>
				<view>
					<picker @change="cheliangChange" :value="cheliangIndex" :range="cheliangOptions"
						range-key="cheliangUuidNumber">
						<view
							class="uni-input">
							{{weixiuxiangmuOrderValue?weixiuxiangmuOrderValue:"请选择维修车辆"}}
						</view>
					</picker>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">预定清单</view>
			</view>
			<view v-for="(item,index) in orderGoods " v-bind:key="index" class="cu-form-group">
				<image class="avator" :src="item.weixiuxiangmuPhoto" mode=""></image>
				<view class="title" style="width: 75%;">
					<view style="margin-top: -50rpx;">{{item.weixiuxiangmuName}}</view>
					<view>
						x{{item.buyNumber}}
						<text style="margin-left: 30upx;color: red;">￥{{item.weixiuxiangmuNewMoney}}</text>
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">总价</view>
				<view>
					<text v-if="weixiuxiangmuOrderPaymentTypes == 1">总价：￥{{(maxNewMouey).toFixed(2)}}</text>
				</view>
			</view>
		</form>
		<view class="padding" style="text-align: center;">
			<button @tap="onSubmitTap()" class="bg-red lg">确认支付</button>
		</view>

		<w-picker mode="dateTime" step="1" :current="false" :hasSecond="false" @confirm="weixiuxiangmuOrderTimeConfirm"
			ref="weixiuxiangmuOrderTime" themeColor="#333333"></w-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {}, //登录用户
				orderGoods: [], //展示数据
				maxNewMouey: 0, //总价格
				cheliangOptions:[],
				cheliangId:null,
				weixiuxiangmuOrderTime: null,
				weixiuxiangmuOrderPaymentTypes: 1, //是什么支付类型
				weixiuxiangmuOrderValue:null,
				ptions: [],
				cheliangIndex: 0,
				zhi: [{
						id: 1,
						val: "余额"
					},
					{
						id: 2,
						val: "积分"
					},
				],
				zhekou: 1, //折扣
			}
		},
		async onLoad(options) {
			// 获取订单信息，座位信息
			this.orderGoods = uni.getStorageSync('orderGoods');
			if (this.orderGoods.length > 0) {
				for (let i = 0; i < this.orderGoods.length; i++) {
					this.maxNewMouey = this.maxNewMouey + parseFloat(this.orderGoods[i].weixiuxiangmuNewMoney) * this
						.orderGoods[i].buyNumber
				}
			}
			let cheliangParams = {
				page: 1,
				limit: 100,
				yonghuId: this.user.id
			}
			let cheliang = await this.$api.page(`cheliang`, cheliangParams);
			this.cheliangOptions = cheliang.data.list

			uni.removeStorageSync("orderGoods")
		},
		async onShow() {
			let _this = this
			let table = uni.getStorageSync("nowTable");
			let userRes = await _this.$api.session(table)
			_this.user = userRes.data

			let huiyuandengjiTypesRes = await _this.$api.page("dictionary", {
				dicCode: "huiyuandengji_types",
				dicName: "会员等级类型",
				codeIndexStart: _this.user.huiyuandengjiTypes,
				codeIndexEnd: _this.user.huiyuandengjiTypes,
			})
			if (huiyuandengjiTypesRes.data.list.length > 0) {
				_this.zhekou = huiyuandengjiTypesRes.data.list[0].beizhu;
			}


		},
		methods: {
			cheliangChange(e) {
				this.cheliangIndex = e.target.value
				this.weixiuxiangmuOrderValue = this.cheliangOptions[this.cheliangIndex].cheliangUuidNumber
				this.cheliangId = this.cheliangOptions[this.cheliangIndex].id
			},
			// 日期控件
			weixiuxiangmuOrderTimeConfirm(val) {
				console.log(val)
				this.weixiuxiangmuOrderTime = val.result;
				this.$forceUpdate();
			},
			toggleTab(str) {
				this.$refs[str].show();
			},
			async onSubmitTap() {
				let _this = this;
				let table = uni.getStorageSync("nowTable");
				uni.showModal({
					title: '提示',
					content: '是否确认支付',
					success: async function(res) {
						if (res.confirm) {
							if(_this.cheliangId == null){
								_this.$utils.msg("请选择需要维修的车辆")
								return
							}
							if(_this.weixiuxiangmuOrderTime == null){
								_this.$utils.msg("请选择预定时间")
								return
							}
							let data = {
								weixiuxiangmuId:_this.orderGoods[0].weixiuxiangmuId,
								yonghuId: _this.user.id,
								cheliangId:_this.cheliangId,
								weixiuxiangmuOrderTime:_this.weixiuxiangmuOrderTime,
								weixiuxiangmuOrderPaymentTypes: _this.weixiuxiangmuOrderPaymentTypes,
							}
							await _this.$api.add('weixiuxiangmuOrder',data);
							_this.$utils.jump('/pages/weixiuxiangmuOrder/list');
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.avator {
		width: 150upx;
		height: 150upx;
		margin: 20upx 0;
	}
</style>
