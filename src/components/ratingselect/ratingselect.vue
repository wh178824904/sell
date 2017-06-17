<template>
	<div class="ratingselect"> <!-- 通常都是用组件名作为最外层的div，里面包裹的是内容 -->
		<div class="rating-type border-1px">
			<span @click="select(2,$event)" class="block positive" :class="{'active': selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span> <!-- 当selectType的值为2的时候，给元素添加active类 -->
			<span @click="select(0,$event)" class="block positive" :class="{'active': selectType === 0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span @click="select(1,$event)"class="block negative" :class="{'active': selectType === 1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div @click="toggleContent" class="switch" :class="{'on': onlyContent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;

    export default{
    	props: {  //props里面是外包可以传入组件的变量，就是要维护的变量，在其他地方引用就修改数据即可。比如将'满意'改为'推荐'
    		ratings: {
    			type: Array, //数组对象都有返回一个函数
    			default() {
    				return [];
    			}
    		},
    		selectType: {
				type: Number,
				default: ALL //常量2，让代码的可读性更强
    		},
    		onlyContent: {
    			type: Boolean,
    			default: false
    		},
    		desc: {
    			type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					};
				}
    		}
    	},
    	computed: { //ratings.length全部评价的长度可以获得，但是吐槽和推荐的评价长度不能直接获得，这里可以在计算属性里添加两个变量.
			positives() { //对应所以正向评价的数组，可以通过ratings计算出来
				return this.ratings.filter((rating) => {   //filter过滤数组
					return rating.rateType === POSITIVE;  //rateType就对应data.json的ratings里的rateType,找到所有rateType值为0的即等于POSITIVE的，添加到数组里。就可以统计数组的长度,即positives.length。
				})  
			},
			negatives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === NEGATIVE;
				})
			}
    	},
    	methods: {
    		select(type,event) {  //点击不同的按钮，把不同的type值赋给selectType，添加给相应的按钮active类名。
    			if(!event._constructed) {
    				return;
    			}
    			this.selectType = type;
    			this.$dispatch('ratingtype.select',type)  //food父组件引用了ratingselect子组件，ratingselect子组件里面的selectType发生改变，不会影响到父组件，如何把子组件的变化传给父组件food.vue呢：就是派发一个事件,事件名是ratingtype.select，值是type,这样父组件就可以监听到这个事件以后就可以去改变selectType.
    		},
    		toggleContent() {  //来回切换icon选中状态
    			if(!event._constructed) {
    				return;
    			}
				  this.onlyContent = !this.onlyContent;
				  this.$dispatch('content.toggle',this.onlyContent);  //派发事件到父元素，使得父组件可以监听onlyContent的变化
    		}
    	}
    };
</script>

<style lang="stylus" rel="stylesheet">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2) //被选中时的状态，为什么写的一样在页面现实是的是.block.active和.block.positive的样式，而不是我想要的.positive.active的样式
          &.active
            background: rgb(77, 85, 93)      
	.switch
	  padding: 12px 18px
	  line-height: 24px
	  border-bottom: 1px solid rgba(7,17,27,0.1)
	  color: rgb(147,153,159)
	  font-size: 0
	  &.on
	  	.icon-check_circle
	  	  color: #00c850
	  .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
	  .text
	  	display: inline-block
	  	vertical-align: middle
	  	font-size: 12px
</style>