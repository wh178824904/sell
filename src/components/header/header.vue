<template>
    <div class="header">
    	<div class="content-wrapper">
    		<div class="avatar">
    			<img :width="64" :height="64" :src="seller.avatar">  <!-- vue里面直接用src地址是不行的，要用v-bind即：src。因为seller.avatar一开始是不存在的，seller是一个空对象。seller是通过异步ajax从后台获取的数据，直接用src的seller变异的时候会报错 -->
    		</div>
    		<div class="content">
    			<div class="title">
    				<span class="brand"></span>
    				<span class="name">{{seller.name}}</span>
    			</div>
    			<div class="description">
    				{{seller.description}}/{{seller.deliveryTime}}分钟送达
    			</div>
    			<div v-if="seller.supports" class="support">  <!-- 为什么这里要用v-if。因为不用会报错seller.supports是undefiend。因为获取数据是一个if过程，一开始初始化的时候seller是一个空对象，吧这个空对象传给header的时候seller.supports就是undefiend，这时候再去[0]个对象就会报错 -->
    				<span class="icon" :class="classMap[seller.supports[0].type]"></span>  <!-- 添加动态class属性，对应下面classMap里的值，将[]里面的数值，对应到data.json里面的type的数值, 方法就是在下面定义一个classMap数组-->
    				<span class="text">{{seller.supports[0].description}}</span>
    			</div>
    		</div>
    		<div v-if="seller.supports" class="support-count" @click="showDetail">
    			<span class="count">{{seller.supports.length}}个</span>
    			<i class="icon-keyboard_arrow_right"></i>
    		</div>
    	</div>
    	<div class="bulletin-wrapper" @click="showDetail">
    		<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
    		<i class="icon-keyboard_arrow_right"></i>
    	</div>
    	<div class="background">
    		<img :src="seller.avatar" width="100%" height="100%">
    	</div>
    	<div class="detail" v-show="detailShow" transition="fade">
    		<div class="detail-wrapper clearfix">
    			<div class="detail-main">
    				<h1 class="name">{{seller.name}}</h1>
    				<div class="star-wrapper">
    					<star :size="48" :score="seller.score"></star>
    				</div>
    				<div class="title">
    					<div class="line"></div>
    					<div class="text">优惠信息</div>
    					<div class="line"></div>
    				</div>
    				<ul v-if="seller.supports" class="supports">
    					<li class="support-item" v-for="item in seller.supports">
    						<span class="icon" :class="classMap[seller.supports[$index].type]"></span>
    						<span class="text">{{seller.supports[$index].description}}</span>
    					</li>
    				</ul>
    				<div class="title">
    					<div class="line"></div>
    					<div class="text">商家公告</div>
    					<div class="line"></div>
    				</div>
    				<div class="bulletin">
    					<p class="content">{{seller.bulletin}}</p>
    				</div>
    			</div>
    		</div>
    		<div class="detail-close" @click="hideDetail">
    			<i class="icon-close"></i>
    		</div>
    	</div>
    </div>
</template>

<script type="text/ecmascript-6">
	import star from "components/star/star";

    export default {
	    props: {  //props是vue里面父组件向子组件传递参数的方法
	      seller: {
	        type: Object
	      }
	    },
	    data() {
	      return {
	        detailShow: false
	      };
	    },
    	methods: {
			showDetail() {
				this.detailShow = true   //detailShow属性是依赖跟踪的，当我们点击的时候，this.detailShow就会访问到data里面的detailShow，然后依赖跟踪会检测detailShow的变化，传递给v-show指令，通知其去更新状态。这样就可以实现通过操作这个detailShow数据控制弹出层的隐藏和显示
			},
			hideDetail() {
				this.detailShow = false
			}
    	},
    	created() {
    		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    	},
    	components: {
    		star
    	}
    };
</script>

<style lang="stylus" rel="stylesheet">
@import "../../common/stylus/mixin";	//想使用minin.styl里面设置的通用的bg-image，这里必须先引用。同时这里前面的现象对路径的'../'符号是不能省略的，因为这里是css文件，只有js文件才可以通过在webpack.base.conf.js设置省略. ??这句代码最前面不能有空格不然会报错
    .header
    	position: relative
    	overflow: hidden
    	color: #fff
    	background: rgba(7,17,27,0.5)
    	.content-wrapper
    		position: relative
    		padding: 24px 12px 18px 24px
    		font-size: 0  //去除图片和文字之间有默认的空白字符，但是洗面字体会继承这个0px，所以下面content还要 另设字体大小
    		.avatar
    			display: inline-block
    			vertical-align: top
    			img
    				border-radius: 2px
    		.content
    			display: inline-block
    			margin-left: 16px
    			.title
    				margin: 2px 0 8px 0
    				.brand
    					display: inline-block //不设为行内块元素，下面设置的宽高是不起作用的
    					vertical-align: top
    					width: 30px
    					height: 18px
    					bg-image('brand')  //背景图片在dpi为2的时候就用2X，dpi为3的时候就为3X，因为项目里面很多地方用的2X,3X的图片，所以我们可以用stylus的特性，可以在mixin设一个函数，专门累处理这种2X,3X的图片
    					background-size: 30px 18px
    					background-repeat: no-repeat
    				.name
    					margin-left: 6px
    					font-size: 16px
    					line-height: 18px
    					font-weight: bold

				.description      //?? 为毛缩进报错，移动到最左边在缩进又没事了？？？
		            margin-bottom: 10px
		            line-height: 12px
		            font-size: 12px
		        .support
		          .icon
		            display: inline-block
		            vertical-align: top
		            width: 12px
		            height: 12px
		            margin-right: 4px
		            background-size: 12px 12px
		            background-repeat: no-repeat
		            &.decrease
		              bg-image('decrease_1')
		            &.discount
		              bg-image('discount_1')
		            &.guarantee
		              bg-image('guarantee_1')
		            &.invoice
		              bg-image('invoice_1')
		            &.special
		              bg-image('special_1')	//为什么这里要全部写出来？因为不能像设计稿那样写几种，真实项目中图片是可变的，也有可能没有，第一个图片也可能会改变。都是不可控的，所以要写出来所有情况
					.text
						line-height: 12px
						font-size: 10px
			.support-count
				position: absolute
				right: 12px
				bottom: 14px
				padding: 0 8px
				height: 24px
				line-height: 24px
				border-radius: 14px
				background: rgba(0,0,0,0.2)
				text-align: content-wrapper
				.count
					vertical-align: top  //文字和字体的对齐方式是不一样的，相对齐需要设置vertical-align
					font-size: 10px
				.icon-keyboard_arrow_right
					margin-left: 2px
					line-height:24px //通用字体默认的line-height:1px，这要从写line-height
					font-size: 10px
		.bulletin-wrapper
		  position: relative
		  height: 28px
		  line-height: 28px
		  padding: 0 22px 0 12px
		  white-space: nowrap
		  overflow: hidden
		  text-overflow: ellipsis
		  //font-size: 0   这里再用font-size:0来去除图片和文字默认间距的方法失效了，可以在html代码里把两个<span>紧挨在一起。
		  background: rgba(7,7,27,0.2)
		  .bulletin-title
		    display: inline-block
		    vertical-align: top
		    margin-top: 8px
		    width: 22px
		    height: 12px
		    bg-image('bulletin')
		    background-size: 22px 12px
		    background-repeat: no-repeat
		  .bulletin-text
			  vertical-align: top
			  margin: 0 4px 
			  font-size: 10px
			  font-weight: 200
		  .icon-keyboard_arrow_right
		  	  position: absolute
		  	  font-size: 10px
		  	  right: 12px
		  	  top: 8px
		.background
		  position: absolute
		  top: 0
		  left: 0
		  width: 100%
		  height: 100%
		  z-index: -1
		  filter: blur(10px)   //filter是css3滤镜属性，blur是模糊效果
		.detail
		  position: fixed
		  z-index:100
		  top: 0
		  left: 0
		  width: 100%
		  height: 100%
		  overflow: auto
		  transition: all 0.5s
		  backdrop-filter: blur(10px) //弹出层的背景是模糊的，这里的模糊和前面header部分的图片模糊是不一样的。这里的模糊是只能在iphone手机上看到的的模糊backdrop-filter效果，安卓手机实现不了。浏览器本地模拟ipbone也看不到效果。
		  &.fade-transition
		  	opacity: 1
		  	background: rgba(7,17,27,0.8)
		  &.fade-leave,&.fade-enter
		  	opacity: 0
		  	background: rgba(7,17,27,0)
		  .detail-wrapper
		    width: 100%
		    min-height: 100%
		    .detail-main
		      margin-top: 64px
		      padding-bottom: 64px  //Css Sticky footers方法：要有3层，首先要设置detail-wrapper层的最小高度为100%，撑满整个屏幕，不然下面的关闭按钮是定位不到那个位置的。然后detail-close层加一个负margin让关闭按钮位置向上提。最后是给detail-wrapper里面的内容层detail-main加一个padding-bottom，这一句就是Css Sticky footers的关键，如果没有这一句，关闭符号就会覆盖到上面的文字
			  .name
	            line-height: 16px
	            text-align: center
	            font-size: 16px
	            font-weight: 700
	          .star-wrapper
	            margin-top: 18px
	            padding: 2px 0
	            text-align: center
	          .title
	            display: flex
	            width: 80%
	            margin: 28px auto 24px auto
	            .line
	              flex: 1  /*vue-loader在编译的时候会用到一个Postcss工具，会给有兼容性问题的css属性添加兼容性代码*/
	              position: relative
	              top: -6px
	              border-bottom: 1px solid rgba(255, 255, 255, 0.2)
	            .text
	              padding: 0 12px
	              font-weight: 700
	              font-size: 14px
	          .supports
	            width: 80%
	            margin: 0 auto
	            .support-item
	              padding: 0 12px
	              margin-bottom: 12px
	              font-size: 0
	              &:last-child
	                margin-bottom: 0
	          	  .icon
	          	    display: inline-block
	          	    width: 16px
	          	    height: 16px
	          	    vertical-align: top
	          	    margin-right: 6px
	          	    background-size: 16px 16px
	          	    background-repeat: no-repeat
	          	    &.decrease
	                  bg-image('decrease_2')
	                &.discount
	                  bg-image('discount_2')
	                &.guarantee
	                  bg-image('guarantee_2')
	                &.invoice
	                  bg-image('invoice_2')
	                &.special
	                  bg-image('special_2')
		          .text
		            line-height: 12px
		            font-size: 12px
			  .bulletin
			    width: 80%
			    margin: 0 auto
			    .content
			      padding: 0 12px
			      line-height: 24px
			      font-size: 12px
		  .detail-close
		      position: relative
		      width: 32px
		      height: 32px
		      margin: -64px auto 0 auto
		      clear: both
		      font-size: 32px






</style>