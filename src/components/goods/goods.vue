<template>
	<div class="goods">
		<div class="menu-wrapper" v-el:menu-wrapper>
			<ul>
				<li v-for="item in goods" class="menu-item" :class="{'current':currentIndex === $index}" @click="selectMenu($index,$event)">
					<span class="text" border-1px>
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" v-el:foods-wrapper>
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">  <!-- food-list-hook里的hook是vue常用的类名命名方法，表示food-list-hook是被js获取操作的类名，并没有事件的css样式。 -->
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item" border-1px>
							<div class="icon">
								<img width="57px" height="57px" :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
	</div>
	<food :food="selectedFood" v-ref:food></food>
</template>
<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import shopcart from 'components/shopcart/shopcart';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import food from 'components/food/food';

	const ERR_OK = 0;

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: [],  //一开始设置一个空的goods数组，然后下面created向后端发送请求获取数据，添加到数组里面。foods里面是由下面的food组成的。
				listHeight: [],  //数组，记录每一个区间的高度，累加的过程。
				scrollY: 0,
				selectedFood: {}
			};
		},
		computed: {  //computed计算属性
			currentIndex() {  //左侧当前索引应该在哪
				for(let i=0;i<this.listHeight.length;i++) {
					let height1 = this.listHeight[i]; //heigh1当前索引值的高度 
					let height2 = this.listHeight[i+1];
					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {   //判断的标准是我的scrollY落在这个区间,并且当我便利到最后一个值得时候，i+1就是heigth2返回的是undefiend,所以height2要非空,就return一个i
						return i;
					}
				}
				return 0; //什么都没有的时候返回0
			},
			selectFoods() { //定义selectFoods以后，就可以在模版里面引用selectFoods,就可以把selectFoods传给上面shopcart组件，这样就能把shopcart和cartcontrol这两个组件联动起来。会把cartcontrol的变化映射到shopcart组件上。
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => { //这个food就是上面li里面遍历的food
						if(food.count){
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];


			this.$http.get('./api/goods').then((response) => {
				response = response.body;
				if(response.error === ERR_OK) { //error改为errno为什么不行？？？
					this.goods = response.data;
					this.$nextTick(() => {  //这里用vue的$nextTick接口，把BScroll的初始化工作放在$nextTick接口里面实现，就不会出现页面内容menu及ul的高度计算错误导致页面无法滑动的报错出现。因为vue里面更改数据，demo会跟着数据做映射，但vue在更新demo的时候是异步的，所以当初始化BScroll的时候，demo的数据却没有改变。demo为空，页面内容的高度计算不出来。所以页面还是无法滚动，就会报错。
						this._initScroll();  //判断ul里面所有li的高度大于父元素foods-wrapper的高度时就可以滚动了。
						this._calculateHeight(); //拿到数据以后计算每个li的高度
					});		
				}
			});
		},
		methods: {
			selectMenu(index,event) { //点击左侧li,传递参数到selectMenu(index)的index里面
				if(!event._constructed) {
					return;
				}
				let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index]; //index是点击的左侧的列表的序号，foodList是右侧的整体的列表的高度。foodList[index]是滚动到右侧相对应序号的li。通过el拿到这个demo元素。
				this.foodsScroll.scrollToElement(el,300);  //通过scrollToElement接口,一个是demo对象，一个是滚动时间
			},
			selectFood(food,event) {
				if (!event._constructed) {
		            return;  //防止点击多次反应
		        }
		        this.selectedFood = food;
		        this.$refs.food.show();
			},
			_drop(target) {
					//体验优化，异步执行下落、滚动动画
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target);   //在上面shopcart组件里面加一个v-ref:shopcart属性，这里通过this.$refs.shopcart就能访问到子组件。this.$refs对象的shopcart对象的drop方法。
				}); //点击添加按钮，同时进行两个动画，计算了有点大，看着卡顿，这里可以用this.$nextTick让两个动画异步执行.
			},
	
			_initScroll() {   //封装的调用方法：this.menuScroll表示左侧栏，BScroll()和ajk接口是一样的，里面有两个参数，一个是demo对象，demo对象通过vue提供的api(v-el:menu-wrapper，注意类名中间用横线连接)来获得的,然后在BScroll里面就可以用this.$els.menuWrapper(注意这里要用驼峰命名)来取到demo。第二个参数是options是JSON对象。最后在get()方法里调用方法this._initScroll();。
				this.menuScroll = new BScroll(this.$els.menuWrapper,{
					click: true
				});  //better-scroll实现原理是监听touchStart，touchEnd事件，在BScroll在初始化的时候，会阻止掉默认的点击事件。在这里要想有点击事件，需要是初始化BScroll的时候添加一个属性click: true;
				this.foodsScroll = new BScroll(this.$els.foodsWrapper,{
					click: true,
					probeType: 3
				});
				this.foodsScroll.on('scroll',(pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));  //Matn取整，取证
				});
			},
			_calculateHeight() {
				let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');  //foodList是左侧每个大区块li的高度
				let height = 0;
				this.listHeight.push(height);
				for(let i=0;i<foodList.length;i++) {
					let item = foodList[i];
					height += item.clientHeight; //item.clientHeight;拿到每个li的高度。然后累加到height;
					this.listHeight.push(height); //将累加的没有区间的高度，push到listHeight里面去。listHeight是一个递增的区间数组，表示每一个区间对应的高度是多少。
				}
			}
		},
		components: { //注册组件
			shopcart,
			cartcontrol,
			food
		},
		events: {
			'cart.add'(target){  //events添加一个事件，这个事件会接受到一个参数target
				this._drop(target);
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"

	.goods
	  display: flex
	  position: absolute
	  top: 174px
	  bottom:46px
	  width: 100%
	  overflow: hidden
	  .menu-wrapper
	    flex: 0 0 80px
	    width: 80px //这里不写宽度在安卓里面会出问题
	    background: #F3F5F7
	    .menu-item
	      display: table //不论是一行还是两行文字，display：tabke都能实现垂直居中,子元素用display: table-cell
	      height: 54px
	      width: 56px
	      padding: 0 12px
	      line-height: 14px
	      &.current
	        position: relative
	        z-index: 10
	        margin-top: -1px
	        background: #Fff
	        font-weight: 700
	       .text
	    	  border-none()
	      .icon
	        display: inline-block
	        vertical-align: top
	        width: 12px
	        height: 12px
	        margin-right: 2px
	        background-size: 12px 12px
	        background-repeat: no-repeat
	        &.decrease
	          bg-image('decrease_3')
	        &.discount
	          bg-image('discount_3')
	        &.guarantee
	          bg-image('guarantee_3')
	        &.invoice
	          bg-image('invoice_3')
	        &.special
	          bg-image('special_3')
	      .text
	      	display: table-cell
	      	width: 56px
	      	vertical-align: middle
	      	border-1px(rgba(7,17,27,0.2))
	      	font-size: 12px
	      	line-height: 14px;
	  .foods-wrapper
	    flex: 1
	    .title
	      padding-left: 14px
	      height: 26px
	      line-height: 26px
	      border-left: 2px solid #d9dde1
	      font-size: 12px
	      color: rgb(147,153,159)
	      background: #f3f5f7
	    .food-item
	      display: flex
	      margin: 18px
	      padding-bottom: 18px
	      border-1px(rgba(7,17,27,0.2))
	      &:last-child
	        border-none()
	        margin-bottom: 0
	      .icon
	      	flex: 0 0 57px
	      	margin-right: 10px
	      .content
	      	flex: 1
	      	.name
	      	  margin: 2px 0 8px 0
	      	  height: 14px
	      	  line-height: 14px
	      	  font-size: 14px
	      	  color: rgb(7,17,27)
	      	.desc,.extra
	          line-height: 10px
	          font-size: 10px
	          color: rgb(147,153,159)
	        .desc
	          margin-bottom: 8px
	          line-height: 12px
	        .extra
	          .count
	            margin-right: 12px
	        .price
	          font-weight: 700
	          line-height: 24px
	          .now
	            margin-right: 18px
	            font-size: 14px
	            color: rgb(240,20,20)
	          .old
	            text-decoration: line-through
	            font-size: 10px
	            color: rgb(147,153,159)
	        .cartcontrol-wrapper
	        	position: absolute
	        	right: 0
	        	bottom: 12px
</style>