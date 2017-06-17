<template>
  <div>
      <v-header :seller="seller"></v-header>
      <!-- <wuhong></wuhong> -->
      <div class="tab border-1px">
        <div class="tab-item">
          <!-- 使用指令v-link进行导航 -->
          <a v-link="{path:'/goods'}">商品</a>
        </div>
        <div class="tab-item">
          <a v-link="{path:'/ratings'}">评论</a>
        </div>
        <div class="tab-item">
          <a v-link="{path:'/seller'}">商家</a>
        </div>
      </div>
      <!-- 路由外链,表示如果改变路由，就会刷新router-view这的内容。这里就是用router-view代替下面的content内容.keep-alive属性会让页面保持在我操作的状态，比我我在商品页面添加商品到购物车，切换到商家页面再切换回来，购物车不会清空,就是说我切换的时候，vue的生命周期不会被从新加载。但是当刷新整个页面时，状态不会被保留-->
      <router-view :seller="seller" keep-alive></router-view>
      <!-- <div class="content">
        i am content
      </div> -->
  </div>
</template>

<script>  /*=>如果编译器不认识这个符号，下面显示红线，可以在script里面添加type="text/ecmascript-6"，表明是es6语法，但是要注意‘=>’前后要加空格，不然也会报错*/ 
  import {urlParse} from 'common/js/util';
  import header from './components/header/header.vue';  /*前面不加“./”会报错，我们当前是src目录，直接写components目录会出现问题，要在前面加"./"*/

  /*import wuhong from './components/header/aaa.vue'; //自己随便加的模块*/

  const ERR_OK = 0;  /*定义一个变量为0，0为dev-server.js里面从服务端返回的状态码，这里定义一个变量，以后更改状态码的值为1就方便了*/
  export default {   /*export和export default的区别是后者整个是当做modulesexport导出的，所以要加一个default标识*/
  /*header组件有很多数据是通过异步请求后端的数据接口获得的，header组件就负责获取这些数据并渲染。那么我们就可以在header的父组件App.vue里面通过发送ajax请求获取相关数据，然后把这些数据通过header的props属性传递给v-header组件。首先我们要给App.vue定义一个seller对象。可以通过data方法来定义，如下*/
    data(){   /*vue里面data是一个函数，因为data是通用的，如果是对象，如果修改某一个组件会影响另外一个组件*/
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            /*console.log(queryParam);*/
            return queryParam.id;
          })() //这里最后加()是优先运行的意思。
        }  /*首先定义一个空的seller对象，然后通过发送ajax请求拿到seller对象，然后塞给这个空的seller对象，这样就能拿到seller对象的数据*/
      };
    },
    created() {  /*每个vue对象实例化的时候都要一个生命周期，生命周期有一个钩子叫created方法，在这个方法里可以通过this.$http.get()/post()方法拿到商家seller的数据*/
      this.$http.get('/api/seller?id='+this.seller.id).then((response) => {  //这里括号里的response是一个属性，vue里面可以用response.body把response属相转化为我们需要的Object对象
        response = response.body; //新版本的vue-resource把response.json()方法改为返回primise类型数据,看官网案例，要返回object类型数据，要用response.body才行。
        if(response.error === ERR_OK){  //在dev-server.js里面可以看到seller的error字段状态码为0，所以这里判断当状态码为0的时候可以获取到后台数据
          this.seller = response.data;  // 在dev-server.js里可看到seller的真正数据在data字段里面，这里的this.seller就是拿到的seller数据。

          /*console.log(this.seller.id)*/  //undefined,我们直接给seller.id赋值，在这里就会被丢弃掉。因为response.data已经包含了id。vue给我们一个建议，我们可以用Object.assign(),一个es6的语法去给这个做一个赋值。
          this.seller = Object.assign({},this.seller,response.data);// 3个参数，第一个是最终要接收到的数据，空的object.第二个要赋值的参数，第三个冲突的参数。相当于与extend方式扩展了this.seller这个属性，然后把结果赋值给空的object，然后返给this.seller。也就相当于在data里seller的id的基础上给seller添加了其他的属性，这样的话就不会把id直接给盖掉。这vue官网推荐的给对象扩展属性的方法。有了这个id我们就可以去做数据的缓存部分。
        }
      });
    },
    components: {
      'v-header':header
      /*'wuhong':wuhong*/
    }

  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"    //@import是styl的特殊语法,可以引入任意路径下的styl
  .tab
    display:flex
    width:100%
    height: 40px
    line-height:40px
    //border-bottom: 1px solid rgba(7,17,27,0.1)  //在电脑看是一像素,但是在dpi(物理像素)为2的手机上看就是2像素
    //解决方法是在stylus下新建一个mixin.styl文件(styl是css处理器提供的一个特殊的方法),在里面新建border-1px，然后给父元素tab添加一个after伪类
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex:1
      text-align:center
      &>a    //$表示父元素
        display: block
        font-size: 14px
        color: rgb(77,85,93)
        &.active    //这里'&.active'表示是a的子伪元素active，active是被选中的状态，'&.active'不予上面的color对齐，就会报错。
          color: rgb(240,20,20)






/* .tab{   上面是用stylus语法，要在package.json里面安装stylus模块。这里用普通的css语法也可以实现效果。
    display: flex; 
    display: -webkit-box;
    display: -ms-flexbox;
     flex是移动端很好的响应式写法，因为vue-loader模块依赖了一个叫postcss的插件，这个插件会自动帮我们搞定浏览器兼容性问题，所以我们上面只要写display:flex;就可以了，下面两句兼容性写法就不需要写了
    width: 100%; 
    height: 40px;
    line-height: 40px;
  }
  .tab .tab-item{
    flex:1;
    text-align: center;
  } */
</style>
