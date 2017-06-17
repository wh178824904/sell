<template>
    <div class="seller" v-el:seller>
    	<div class="seller-content">
    		<div class="overview">
    			<h1 class="title">{{seller.name}}</h1>
    			<div class="desc border-1px">
    				<star :size="36" :score="seller.score"></star>
    				<span class="text">({{seller.ratingCount}})</span>
    				<span class="text">月售{{seller.sellCount}}单</span>
    			</div>
    			<ul class="remark">
    				<li class="block">
    					<h2>起送价</h2>
    					<div class="content">
    						<span class="stress">{{seller.minPrice}}</span>元
    					</div>
    				</li>
    				<li class="block">
    					<h2>商家配送</h2>
    					<div class="content">
    						<span class="stress">{{seller.deliveryPrice}}</span>元
    					</div>
    				</li>
    				<li class="block">
    					<h2>平均配送时间</h2>
    					<div class="content">
    						<span class="stress">{{seller.deliveryTime}}</span>元
    					</div>
    				</li>
    			</ul>
    			<div class="favorite" @click="toggleFavorite">
    				<span class="icon-favorite" :class="{'active': favorite}"></span>
    				<span class="text">{{favoriteText}}</span>
    			</div>
    		</div>
    		<split></split>
    		<div class="bulletin">
    			<h1 class="title">公共与活动</h1>
    			<div class="content-wrapper border-1px">
    				<p class="content">{{seller.bulletin}}</p>
    			</div>
    			<ul v-if="seller.supports" class="supports">
					<li class="support-item1 border-1px" v-for="item in seller.supports">
						<span class="icon" :class="classMap[seller.supports[$index].type]"></span>
						<span class="text1">{{seller.supports[$index].description}}</span>
					</li>
				</ul>
    		</div>
    		<split></split>
    		<div class="pics1">
    			<h1 class="title1">商家实景</h1>
    			<div class="pic-wrapper1" v-el:pic-wrapper>
    				<ul class="pic-list1" v-el:pic-list> <!--v-el让下面好取到ul元素-->
    					<li class="pic-item1" v-for="pic in seller.pics">
    						<img :src="pic" width="120" height="90" >
    					</li> <!--后台有pics图片路径的数组-->
    				</ul>
    			</div>
    		</div>
    		<split></split>
    		<div class="info1">
    			<h1 class="title border-1px">商家信息</h1>
    			<ul>
    				<li class="info-item1" v-for="info in seller.infos">{{info}}</li>
    			</ul>
    		</div>
    	</div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import star from 'components/star/star';
	import split from 'components/split/split';

    export default{
    	props: {
    		seller: {
    			type: Object
    		}
    	},
    	data () {
    		return {
    			favorite: false //favorite是一个变量，要在data里面去观测它。
    		};
    	},
    	computed: {
    		favoriteText() { //favoriteText可以通过计算属性去导,他说依赖favorite这个变量的。
    			return this.favorite? '已收藏':'收藏';
    		}
    	},
    	created() {
    		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    	},
    	watch: {
    		'seller'() { //seller只在页面刷新的时候变化，当点击切换的时候不变化，所以从商家区块点商品区块切换的时候，watch方法是不会被执行的，BScroll就不会被初始化了。解决方法是在ready方法里面在引用this._initScroll();但是又发现当页面刷新的时候不会滚动了，因为会优先运行ready里面的方法，所以要在_initScroll()方法里的if判断中添加一个else选项，运行this.scroll.refresh();

    			this._initScroll();
    			this._initPics();
    		}
    	},
    	ready() { //在food.vue组件里面都是在created里面拿到后台数据，然后通过$nextTick去初始化BScroll的。这里BScroll没有放到created里面初始化，因为从vue的生命周期来说，执行到created的时候是不能保证DOM已经被渲染的。而BScroll是严格依赖DOM被渲染了才可以启用。vue除了提供created还提供了ready，这里在他的生命周期中，当DOM被渲染好以后，ready这个hook就会被执行。就是说在ready这个方法里面写得代码都能去安全去使用它的DOM。
    		/*this.scroll = new BScroll(this.$els.seller,{
    			click: true  //这个时候发现生命效果都没，console打印this.seller发现生命内容都没有，因为seller是异步获取的，当点击的时候seller里面的内容没有把seller撑开，获取不到高度。vue里面有一个watch选项，可以观测对象的变化，用它来观测seller对象，seller是一个function。
    		});*/
    		this._initScroll();

    		/*if(this.seller.pics) {  //如果图片存在，计算图片的宽度赋给ul即picList。
    			let picwidth = 120;
    			let margin = 6;
    			let width = (picwidth+margin)*this.seller.pics.length-margin;
    			this.$els.picList.style.width = width + 'px'; //给ul设置宽度。上面是v-el:pic-list的形式，这里就要是$eles.picList，中间picList是驼峰的形式。
    			this.$nextTick(() => {
    				this.picScroll = new BScroll(this.$els.picWrapper,{  //picScroll是外层的DOM元素。初始化BScroll。
    					scrollX: true,//横向滚动
    					eventPassthrough: 'vertical' //这个属性的目的是让外层区块可以竖着滚动，内存区块可以横向滚动。

    				});
    			});
    		}*/

    		this._initPics()
    	},
    	methods: {
    		toggleFavorite(event) {
    			if(!event._constructed) {
    				return;
    			}
    			this.favorite = !this.favorite;
    		},
    		_initScroll() {
    			if(!this.scroll) {
    				this.scroll = new BScroll(this.$els.seller,{
    					click: true
    				});
    			}else {
    				this.scroll.refresh();
    				//开始的时候先执行ready里面的_initScroll()初始化scroll，这时候scroll没有计算正确，所以不能被滚动。紧接着watch里的seller回调函数会被执行，因为seller变化这个回调函数会执行，执行以后，又执行到_initScroll()方法，这个时候就会走到else这个分支，会从新计算scroll。refresh()方法，这个时候高度已经被撑开了，所以无论是刷新页面还是切换商品，商家的时候都可以滚动了。
    			}
    		},
    		_initPics() {
    			if(this.seller.pics) {
	    			let picwidth = 120;
	    			let margin = 6;
	    			let width = (picwidth+margin)*this.seller.pics.length-margin;
	    			this.$els.picList.style.width = width + 'px';
	    			this.$nextTick(() => {
	    				if(!this.picScroll) {
	    					this.picScroll = new BScroll(this.$els.picWrapper,{
		    					scrollX: true,
		    					eventPassthrough: 'vertical' 

		    				});
	    				} else {
	    					this.picScroll.refresh();
	    				}
	    			});
	    		}
    		}
    	},
    	components: {
    		star,
    		split
    	}
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"

    .seller {
    	position: absolute;
	    top: 174px;
	    bottom: 0;
	    left: 0;
	    width: 100%;
	    overflow: hidden;
    }
    .seller>.seller-content>.overview {
    	position:relative;
    	padding: 18px;
    	display: block;
    }
    .overview>.title {
    	margin-bottom: 8px;
    	line-height: 14px;
    	color: rgb(7,17,27);
    	font-size: 14px;
    }
    .overview>.desc {
    	padding-bottom: 18px;
    	border-1px(rgba(7,17,27,0.1));
    	font-size: 0;
    }
    .desc>.star {
    	display: inline-block;
    	vertical-align: top
    	margin-right: 8px;

    }
    .desc>.text {
    	display: inline-block;
    	vertical-align: top;
    	margin-right: 12px;
    	line-height: 18px;
    	font-size: 10px;
    	color: rgb(77,85,93);
    }
    .remark {
    	display: flex;
    }
    .remark>.block {
    	flex: 1;
    	text-align: center;
    	border-right: 1px solid rgba(7,17,27,0.2);
    }
    .remark>.block:last-child {
    	border: none;
    }
    .block>h2 {
    	margin-bottom: 4px;
    	line-height: 10px;
    	font-size: 10px
    	color: rgb(147,153,159);
    }
    .block>.content {
    	line-height: 24px;
    	font-size: 10px;
    	color: rgb(7,17,27);
    }
    .block>.content>.stress {
    	font-size: 24px;
    }
    .favorite {
    	position: absolute;
    	width: 50px;
    	right: 11px;
    	top: 18px;
    	text-align: center;
    }
    .favorite .icon-favorite {
    	display: block;
    	margin-bottom: 4px;
    	color: #d4d6d9;
    	line-height: 24px;
    	font-size: 24px;
    }
    .favorite>.active {
    	color: rgb(240,20,20);
    }
    .favorite .text {
    	font-size: 10px;
    	line-height: 10px;
    	color: rgb(77,85,93);
    }
    .bulletin {
    	padding: 18px 18px 0 18px;
    }
    .bulletin>.title{
    	margin-bottom:8px;
    	line-height: 14px;
    	color: rgb(7,17,27);
    	font-size: 14px;
    }
    .bulletin>.content-wrapper {
    	padding: 0 12px 16px 12px;
    	border-1px(rgba(7,17,27,0.1));
    }
    .bulletin>.content-wrapper>.content {
    	line-height: 14px;
    	font-size: 12px;
    	color: rgb(240,20,20);
    }
    .supports>.support-item1 {
    	padding: 16px 12px;
    	border-1px(rgba(7,17,27,0.2));
    	font-size: 0;
    }
    .supports>.support-item1:last-child {
    	border-none();
    }
    .supports>.support-item1>.icon{
      display: inline-block;
      vertical-align: top;
      width: 16px;
      height: 16px;
      margin-right: 6px;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .supports>.support-item1>.decrease {
    	background: url(decrease_4@2x.png);
    	background-size: cover;
    }
    .supports>.support-item1>.discount {
    	background: url(discount_4@2x.png);
    	background-size: cover;
    }
    .supports>.support-item1>.guarantee {
    	background: url(guarantee_4@2x.png);
    	background-size: cover;
    }
    .supports>.support-item1>.invoice {
    	background: url(invoice_4@2x.png);
    	background-size: cover;
    }
    .supports>.support-item1>.special {
    	background: url(special_4@2x.png);
    	background-size: cover;
    }
    .support-item1>.text1 {
    	line-height: 16px;
    	font-size: 12px
    	colro: rgb(7,17,27);
    }
    .pics1 {
    	padding: 18px;
    }
    .pics1>.title1 {
    	margin-bottom: 12px;
    	line-height: 14px;
    	color: rgb(7,17,27);
    	font-size: 14px;
    }
    .pic-wrapper1 {
    	width: 100%;
    	overflow: hidden;
    	white-space: nowrap; //图片超出页面宽度的时候不会被折行
    }
    .pic-wrapper1>.pic-list1{
    	font-size: 0;
    }
    .pic-list1>.pic-item1 {
    	display: inline-block; //图片横向排列
    	margin-right:  6px;
    	width: 120px;
    	height: 90px;
    }
    .pic-list1>.pic-item1:last-child {
    	margin: 0;
    }
    .info1 {
    	padding: 18px 18px 0 18px;
    }
    .info1 .title {
    	padding-bottom: 12px;
    	line-height: 14px;
    	border-1px(rgba(7,17,27,0.1));
    	color: rgb(7,17,27);
    	font-size: 14px;
    }
    .info-item1 {
    	padding: 16px 12px;
    	line-height: 16px;
    	border-1px(rgba(7,17,27,0.1));
    	color: rgb(7,17,27);
    	font-size: 12px;
    }
    .info-item1:last-child {
    	border-none();
    }
</style>