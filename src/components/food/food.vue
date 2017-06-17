<template>
	<div class="food" v-show="showFlag" transition="move" v-el:food>
		<div class="food-content">
			<div class="image-header">
				<img :src="food.image">
				<div class="back" @click="hide">
					<i class="icon-arrow_lift"></i>
				</div>
			</div>
			<div class="content">
				<h1 class="title">{{food.name}}</h1>
				<div class="detail">
					<span class="sell-count">月售{{food.sellCount}}份</span>
					<span class="rating">好评率{{food.rating}}%</span>
				</div>
				<div class="price">
					<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
				</div>
				<div class="cartcontrol-wrapper">
					<cartcontrol :food="food"></cartcontrol>
				</div>
				<div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0" transition="fade">加入购物车</div> <!-- 加transition渐隐的动画效果，让小球动画能现获取到这个div的位置信息以后在display:none;隐藏。stop.prevent阻止冒泡和默认事件 -->
			</div>
			<split v-show="food.info"></split>
			<div class="info" v-show="food.info">
				<h1 class="title">商品信息</h1>
				<p class="text">{{food.info}}</p>
			</div>
			<split></split>
			<div class="rating">
				<h1 class="title">商品评价</h1>
				<ratingselect :select-type="selectType" :only-content ="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect> <!-- 这里的ratings就是data.json里面的ratings -->
				<div class="rating-wrapper">
					<ul v-show="food.ratings && food.ratings.length"> <!-- 当有评价且数组长度不为空的时候ul会被显示 -->
						<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item" border-1px>  <!-- v-show绑定一个函数的计算结果返回值 -->
							<div class="user">
								<span class="name">{{rating.username}}</span>
								<img class="avatar" height="12" width="12" :src="rating.avatar">
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div> <!-- vue里面把rating.rateTime毫秒数转化为字符串的话，可以用vue去写一个filter -->
							<p class="text">
								<span :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
							</p>
						</li>
					</ul>
					<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div><!-- 当没有评价或者数组长度为空的时候"暂无评价"会被显示 -->
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import Vue from 'vue';
	import {formatDate} from 'common/js/date';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import ratingselect from 'components/ratingselect/ratingselect';
	import split from 'components/split/split'

	//const POSITIVE = 0;
	//const NEGATIVE = 1;
	const ALL = 2;

    export default{ //导出
    	props: {
    		food: {
    			type: Object
    		}
    	},
    	data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				desc: {  //这些更改的数据传入ratingselect组件，而ratingselect组件也在food.vue组件里生效了。
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			}
    	},
    	methods: {
    		show() { //设计组件的时候，父组件可以调用子组件的方法，子组件不能调用父组件的方法。所以这里定义show方法，在goods父组件里面就可以调用。同时设计组件方法的时候也有一个命名规范，如果这个方法是可以被外部调用的，一般就这样命名show。如果这个方法是组件私有的，一般会在前面加一个下划线_show。
				this.showFlag = true;
				this.selectType = ALL;  //我们在data里面定义desc的状态，在show函数里面要初始化状态，因为这个ratingselect组件可能被多个商品所引用，当传入不同的商品的时候，希望状态能够保持初始化状态。所以把selectType，onlyContent始终保持初始化。
				this.onlyContent = true;

				this.$nextTick(() => {  //先import引入BScroll，在v-el添加到计算高度的元素，当点击触发show方法，页面被展示了，给他添加一个BScroll。一定要记得$nextTick，因为只有$nextTick的时候DOM才是被渲染的。BOM才能被计算对。
					if(!this.scroll) {
						this.scroll = new BScroll(this.$els.food,{  //初始化
							click: true
						});
					}else {
						this.scroll.refresh();  //否则重新做一次计算
					}

				})
    		},
    		hide() {
    			this.showFlag = false;
    		},
    		addFirst(event) { //不传(food，$event)参数也行.this.food可以访问到.不传默认的参数是event
    			if(!event._constructed) {
    				return;
    			}
    			this.$dispatch('cart.add',event.target);  //从cartcontrol复制过来，这样就可以做抛物线小球动画
    			Vue.set(this.food,'count',1); //设置对象的属性，前面要import引入Vue,第一次我们通过set将count置为1

    		},
			needShow(type,text) {
				if(this.onlyContent && !text) {
					return false;  //只选这个内容，并且这条记录没有内容,那么内容不会被展示，否则显示所有的内容
				}
				if(this.selectType === ALL) { //判断选择类型，如果选择类型是ALL全部，那么也过了，否则他的选择类型和评价类型一致，才能被显示。
					return true
				}else {
					return type === this.selectType;
				}
			}
    	},
    	evevts: {  //要监听ratingselect.vue传过来的两个事件,这样通过监听子组件的数据变化，就可以实现当点击不同的选项(推荐，吐槽)按钮,下面要显示不同的li内容。
    		'ratingtype.select'(type) {
    			this.selectType = type;  //子组件的type传递给父组件的selectType
    		},
    		'content.toggle'(onlyContent) {
    			this.onlyContent = onlyContent;
    		}
			
    	},
    	filters: {
    		formatDate(time) { //time是时间戳参数,函数要依靠js模块去实现
				let date = new Date(time); //首先要把time转化为date类型的对象
				return formatDate(date,'yyyy-MM-dd hh:mm');  //然后要把date转为年月日，时分秒的形式，可以通过formatDate()函数方法实现，但是这个方法可能很多地方都要用到，所以我们把他放到date.js里面，当做模块来引用，这就是js模块化编程的思想。
    		}
    	},
    	components: {
    		cartcontrol,
    		ratingselect,
    		split
    		
    	}
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff

    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        position: relative
        overflow: hidden
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          display: block
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0 //图片文字间隙
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
		.no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>