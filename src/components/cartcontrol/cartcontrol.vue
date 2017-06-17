<template>
	<div class="cartcontrol">
 		<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart" transition="move">
			<span class="inner icon-remove_circle_outline"></span>
 		</div>
 		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
 		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>  <!-- stop.prevent阻止冒泡和默认事件，不然此组件会和food.vue组件里面的点击事件发生冒泡 -->
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';
    export default {
		props: {  //调用购买控件的时候，要传入关联的food，因为增加和减少都是关联单个的food.count,所以调用这个组件的时候，一定会把food传入。
			food: {  //food是父组件传过来的对象，当food变化时就会影响到父组件goods.vue.
				type: Object
			}
		},
		methods: {
			addCart(event) {  //点击的时候，BScroll派发事件的时候，event才可以统计
				if(!event._constructed){  //在pc端点击，一下会触发两次，所以用_constructed去除点击多次触发
					return;
				}
				if(!this.food.count) { //如果为0，就显示出来
					Vue.set(this.food,'count',1);
				}else{
					this.food.count++;	
				}
				this.$dispatch('cart.add',event.target);
			},
			decreaseCart(event) {
				if(!event._constructed){
					return;
				}
				if(this.food.count) { //count大于0的时候
					this.food.count--;
				}
			}
		}
    };
</script>

<style lang="stylus" rel="stylesheet">
  .cartcontrol
    font-size: 0
	.cart-decrease, .cart-add
	  	display: inline-block
	  	padding: 6px
	  	transition: all 0.4s linear
	  	&.move-transition //transition="move"&.move-transition,&.move-enter,&.move-leave组成左右滑动加透明效果
	  		opacity: 1
	  		transform: translate3d(0,0,0)//translate3D开启硬件加速，让动画变得更流畅
		  	.inner
		  		display: inline-block
		  		line-height: 24px
		  		font-size: 24px
		  		color: rgb(0,160,220)
		  		transition: all 0.4s linear
		  		transform: rotate(0)
	  	&.move-enter,&.move-leave
	  		opacity: 0
	  		transform: translate3d(24px,0,0)
	  		.inner
	  			transform: rotate(180deg)
	  .cart-count
		display: inline-block
		vertical-align: top
		width: 12px
		padding-top: 6px
		line-height: 24px
		text-align: center
		font-size: 10px
		color: rgb(147,153,159)
	.cart-add
		display: inline-block
		line-height: 24px
		font-size: 24px
		color: rgb(0,160,220)
</style>