<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click.stop.prevent="pay">  <!-- vue里面用stop阻止冒泡，用prevent阻止默认事件 -->
				<div class="pay" :class="payClass">  <!-- vue里面外面还可以通过:class绑定一个变量,和header.vue组件里面的动态添加class名:class="classMap[seller.supports[0].type]"是一样的，这里带的payClass也是在下面计算出来的 -->
					{{payDesc}}
				</div>
			</div>
		</div>
		<div class="ball-container">
			<div transition="drop" v-for="ball in balls" v-show="ball.show" class="ball">
				<div class="inner inner-hook"></div>
			</div>
		</div>
		<div class="shopcart-list" v-show="listShow" transition="fold">
			<div class="list-header">
				<h1 class="title">购物车</h1>
				<span class="empty" @click="empty">清空</span>
			</div>
			<div class="list-content" v-el:list-content>
				<ul>
					<li class="food" v-for="food in selectFoods">
						<span class="name">{{food.name}}</span>
						<div class="price">
							<span >￥{{food.price*food.count}}</span>
						</div>
						<div class="cartcontrol-wrapper">
							<cartcontrol :food="food"></cartcontrol>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="list-mask" @click="hideList" v-show="listShow" transtition="fade"></div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';  //详情页里面点击添加减少也要依赖BScroll，详情页也是定高的，当超过视口高度的时候是可以滑动的
	import cartcontrol from 'components/cartcontrol/cartcontrol'

    export default{
    	props: {
    		selectFoods: {  //整个shopcart组件主要是维护了selectFoods属性，而selectFoods属性是通过父属性传古过来的，里面存放的数组,下面所有的状态(totalPrice,totalCount等等)都是通过selectFoods计算出来的
				type: Array,  //vue里面type是array、object，那么default就是一个函数。
				default() {
					return [];
				}
    		},
    		deliveryPrice: {
    			type: Number,
    			default: 0
    		},
    		minPrice: {
    			type: Number,
    			default: 0
    		}
    	},
    	data() {
    		return {
    			balls: [
					{
						show : false
					},
					{
						show : false
					},
					{
						show : false
					},
					{
						show : false
					},
					{
						show : false
					}
    			],
    			dropBalls: [],
    			fold: true  //fold折叠的意思，用这个变量来表示购物车详情页的折叠和显示
    		}
    	},
    	computed: {
    		totalPrice() {
    			let total = 0;
    			this.selectFoods.forEach((food) =>{
    				total  += food.price * food.count;
    			});
    			return total;
    		},
    		totalCount() {  //选择商品的总和
    			let count = 0;
    			this.selectFoods.forEach((food) => {
    				count += food.count;
    			});
    			return count;
    		},
    		payDesc() { //还差运费描述，都是和selectFoods相关的
				if(this.totalPrice === 0) {  //js中用‘==’，当两者类型不一致的时候可能会引起类型转化的坑
					return `￥${this.minPrice}元起送`;  //es6里面'`'号可以不用"+"来连接字符串
				} else if (this.totalPrice < this.minPrice){
					let diff = this.minPrice - this.totalPrice;
					return `还差￥${diff}元起送`;  //这里${diff}表示变量
				}else{
					return '去结算';
				}
    		},
    		payClass() {
    			if(this.totalPrice < this.minPrice) {
    				return 'not-enough';
    			} else {
    				return 'enough';
    			}
    		},
    		listShow() {
    			if(!this.totalCount) { //等于0
					this.fold = true; //没有购买商品时是折叠状态
					return false;  //返回false
    			}
    			let show = !this.fold;  //购物车有购买商品时，this.fold为false，show为true；就是dispaly:none;这个属性去除。当this.fold为true，show为false。
    			if (show) { //BScroll在展示的时候初始化
					this.$nextTick(() => {
						if(!this.scroll){    //因为listShow是不断变化的，每次变化的时候new BScroll都有从新初始化一下吗？所以要在这里品判断一下。
							this.scroll = new BScroll(this.$els.listContent, {
								click: true   //通过v-el:list-content给div里面的li绑定点击事件
							});
						} else {
							this.scroll.refresh(); //不需要从新实例化了，refresh()会从新计算和他高度差来决定是否可以滚动
						}
					});
    			}
    			return show;
    		}
    	},
    	methods: {
    		drop(el) {
    			for(let i=0;i<this.balls.length;i++) {
    				let ball = this.balls[i];
    				if(!ball.show) {
    					ball.show = true;
    					ball.el = el;
    					this.dropBalls.push(ball);
    					return;
    				}
    			}
    		},
    		toggleList() {	//折叠取反，当点击的时候展示
				if(!this.totalCount) {
					return;  //购物车没商品，点击没有反应
				}
				this.fold = !this.fold; // 取反
    		},
    		hideList() {  //点击list-mask透明背景，购物车商品详情列表和透明背景都会隐藏
				this.fold = true;  //listShow依赖this.food,这里this.fold发生变化，触发listShow从新计算，达到隐藏效果
    		},
    		empty() {
    			this.selectFoods.forEach((food) => {
    				food.count = 0;
    			})
    		},
    		pay() {
    			if(this.totalPrice < this.minPrice) {
    				return;  //总价小于配送价格的时候是不做任何事情
    			}
    			window.alert(`支付${this.totalPrice}元`);
    		}
    	},
    	transitions: {
    		drop: {
    			beforeEnter(el) {
					let count = this.balls.length;
					while(count--) {
						let ball = this.balls[count];
						if(ball.show) {
							let rect = ball.el.getBoundingClientRect();
							let x = rect.left - 32;
							let y = -(window.innerHeight - rect.top - 22);
							el.style.display = '';
							el.style.webkitTransform = `translate3d(0,${y}px,0)`;
							el.style.transform = `translate3d(0,${y}px,0)`;
							let inner = el.getElementsByClassName('inner-hook')[0];
							inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
							inner.style.transform = `translate3d(${x}px,0,0)`;
						}
					}
    			},
    			enter(el) {
					/*这里首先用offestHeight触发一次浏览器重绘,rf是公用的，所以要加一个eslint注释,这样es就不会报错了*/
					/*ellint-disable no-unused-vars*/
					let rf = el.offsetHeight;
					this.$nextTick(() => {
						el.style.webkitTransform = 'translate3d(0,0,0)';
						el.style.transform = 'translate3d(0,0,0)';
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = 'translate3d(0,0,0)';
						inner.style.transform = 'translate3d(0,0,0)';
					});
    			},
    			afterEnter(el) {
					let ball = this.dropBalls.shift();
					if(ball){
						ball.show = false;
						el.style.display = 'none';
					}
    			}
    		}
    	},
    	components: {
    		cartcontrol
    	}
    };
</script>

<style lang="stylus" rel="stylesheet">
  @import "../../common/stylus/mixin.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight  //有商品数量的时候,图标字体背景高亮
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight //有商品数量的时候,图标字体背景高亮
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      &.fold-transition
      	transition: all 0.5s
      	transform: translate3d(0, -100%, 0) //因为li列表的高度是不固定的，我们需要列表高度，可以用-100%，它是相对于当前自身的高度去做一个偏移
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)  //iphone模糊效果
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>