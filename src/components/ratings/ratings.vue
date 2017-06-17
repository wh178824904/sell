<template>
    <div class="ratings" v-el:ratings>
    	<div class="raings-content">
    		<div class="overview">
    			<div class="overview-left">
    				<h1 class="score">{{seller.score}}</h1>
    				<div class="title">综合评分</div>
    				<div class="rank">高于周边商家{{seller.rankRate}}%</div>
    			</div>
    			<div class="overview-right">
    				<div class="score-wrapper">
    					<span class="title">服务态度</span>
    					<star :size="36" :score="seller.serviceScore"></star>
    					<span class="score">{{seller.serviceScore}}</span>
    				</div>
    				<div class="score-wrapper">
    					<span class="title">商品评分</span>
    					<star :size="36" :score="seller.serviceScore"></star>
    					<span class="score">{{seller.foodScore}}</span>
    				</div>
    				<div class="delivery-wrapper">
    					<span class="title">送达时间</span>
    					<span class="delivery">{{seller.deliveryTime}}分钟</span>
    				</div>
    			</div>
    		</div>
    		<split></split>
    		<ratingselect :select-type="selectType" :desc="desc" :ratings="ratings"></ratingselect>
    		<div class="rating-wrapper">
    			<ul>
    				<li v-for="rating in ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item">
    					<div class="avatar">
    						<img width="28" height="28" :src="rating.avatar">
    					</div>
    					<div class="content">
    						<h1 class="name">{{rating.username}}</h1>
    						<div class="star-wrapper">
    							<star :size="24" :score="rating.score"></star>
    							<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
    						</div>
    						<p class="text">{{rating.text}}</p>
    						<div class="recommend" v-show="rating.recommend && rating.recommend.length">
    							<span class="icon-thumb_up"></span>
    							<span class="item" v-for="item in rating.recommend">{{item}}</span>
    						</div>
    						<div class="time">
    							{{rating.rateTime | formatDate}}
    						</div>
    					</div>
    				</li>
    			</ul>
    		</div>
    	</div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import star from 'components/star/star';
	import ratingselect from 'components/ratingselect/ratingselect';
	import split from 'components/split/split';
	import {formatDate} from 'common/js/date';

	const ALL= 2;
	const ERR_OK = 0;

    export default{
    	props: {	//props去接收header模块里面的seller，然后可以在模版里使用
			seller: {
				type: Object
			}
    	},
    	data() {	//这里data是function要引用ratingselect模块，这里要维护这几个参数
			return {
				ratings: [],  //和在goods组件里一样，通过ajax的get请求可以获得后台的ratings数据
				selectType: ALL,
				onlyContent: true
			};
    	},
    	created() {
    		this.$http.get('/api/ratings').then((response) => {
				response = response.body;
				if (response.error === ERR_OK) {
          			this.ratings = response.data; //后端拿到数据，传给ratings组件
					this.$nextTick(() => {  //上面虽然数据变了，但是没有立即更新，所以下面初始化要在this.$nextTick内部写才可以。
						this.scroll = new BScroll(this.$els.ratings,{  //初始化,在项目源码里面是用$ref的，但是视频里面老师使用v-el的就算$els,这里用$els.
							click: false
						});
					})	
				}
    		});
    	},
    	methods: {
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
    	filters: {
    		formatDate(time) { //time是时间戳参数,函数要依靠js模块去实现
				let date = new Date(time); //首先要把time转化为date类型的对象
				return formatDate(date,'yyyy-MM-dd hh:mm');  //然后要把date转为年月日，时分秒的形式，可以通过formatDate()函数方法实现，但是这个方法可能很多地方都要用到，所以我们把他放到date.js里面，当做模块来引用，这就是js模块化编程的思想。
    		}
    	},
    	components: {  //注册
    		star,
    		split,
    		ratingselect
    	}
    };
</script>

<style lang="stylus" rel="stylesheet">
	@import "../../common/stylus/mixin.styl"

    .ratings {
    	position: absolute
    	top: 174px
    	bottom: 0
    	left: 0
    	width: 100%
    	overflow: hidden
  	}
    .overview {
    	display: flex
      	padding: 18px 0
    }
  	.overview-left {
  		flex: 0 0 137px
  		padding: 6px 0
  		width: 137px
  		border-right: 1px solid rgba(7,17,27,0.1)
  		text-align: center
		@media only screen and (max-width: 320px) {
			flex: 0 0 120px
			width: 120px
		}
  	}
  	.overview-left>.score {
		margin-bottom: 6px
		line-height: 28px
		font-size: 24px
		color: rgb(255,153,0)
  	}
  	.overview-left>.title {
  		margin-bottom: 8px
  		line-height: 12px
  		font-size: 12px
  		color: rgb(7,17,27)
  	}
  	.rank {
  		line-height: 10px
  		font-size: 10px
  		color: rgb(147,153,159)
  	}
  	.overview-right {
  		flex: 1
  		padding: 6px 0 6px 24px
  		@media only screen and (max-width: 320px) {
  			padding-left: 6px
  		}
  	}
  	.score-wrapper {
  		margin-bottom: 8px
  		font-size: 0
  	}
  	.score-wrapper>.title {
  		display: inline-block
  		line-height: 18px
  		vertical-align: top
  		font-size: 12px
  		color: rgb(7,17,27)
  	}
	.score-wrapper>.star {
		display: inline-block
		margin: 0 12px
		vertical-align: top
	}
	.score-wrapper>.score {
		display: inline-block
		line-height: 18px
		vertical-align: top
		font-size: 12px
		color: rgb(255,153,0)
	}
	.delivery-wrapper {
		font-size: 0	
	}
	.delivery-wrapper>.title { //这里没有加inline-block或者verticar-align呢，因为title和delivery是两个span文字，文字之间默认的是垂直方向对齐的
		line-height: 18px
        font-size: 12px
        color: rgb(7, 17, 27)
	}
	.delivery-wrapper>.delivery {
		margin-left: 12px
		font-size: 12px
		color: rgb(147,153,159)
	}
	.rating-wrapper {
		padding: 0 18px
	}
	.rating-wrapper>ul>.rating-item {
		display: flex
		padding: 18px 0
		border-1px(rgba(7,17,27,0.1))
	}
	.ratings .rating-item>.avatar {
		flex: 0 0 28px
		width:28px
		margin-right: 12px
	}
	.avatar>img {
		border-radius: 50%
	}
	.rating-item>.content {
		position: relative
		flex: 1
	}
	.rating-item>.content>.name {
		margin-bottom: 4px
		line-height: 12px
		font-size: 10px
		color: rgb(7,17,27)
	}
	.rating-item>.content>.star-wrapper {
		margin-bottom: 6px
		font-size: 0  //文字和图片默认间距去除方法
	}
	.star-wrapper>.star {
		display: inline-block  //在一排显示
		margin-right: 6px
		vertical-align: top  //图片文字对齐
	}
	.star-wrapper>.delivery {
		display: inline-block
		vertical-align: top
		line-height: 12px
		font-size: 10px
		color: rgb(147,153,159)
	}
	.content>.text {
		margin-bottom: 8px
		line-height: 18px
		color: rgb(7,17,27)
		font-size: 12px
	}
	.content>.recommend {
		line-height: 16px
		font-size: 0
	}
	.recommend>.icon-thumb_up,.recommend>.item {
		display: inline-block
		margin: 0 8px 4px 0
		font-size: 9px
	}
	.recommend>.icon-thumb_up {
		color: rgb(0,160,220)
	}
	.recommend>.item {
		padding: 0 6px
		border: 1px solid rgba(7,17,27,0.2)
		border-sadius: 1px
		color: rgb(147,153,159)
		background: #fff
	}
	.content>.time {
		position:absolute
		top: 0
		right: 0
		line-height: 12px
		font-size: 10px
		color: rgb(147,153,159)
	}
</style>