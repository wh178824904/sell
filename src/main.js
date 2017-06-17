import Vue from 'vue';
import VueRouter from 'vue-router';  /*这里为什么vue-router呢：因为在vue-router里的package.json里面的name就是vue-router*/
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods';    //两个文件在同一目录下，所以是'./'符号而不是'../'符号。同时不用'./'也可以找到文件，因为wwebpack.base.conf.js给conponents设置了一个别名.
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

import 'common/stylus/index.styl';  //不想再'common'前面加'./'，就要去wwebpack.base.conf.js里面配置common。这里styl是css样式，这就是webpack的特性，可以再js里面加载css样式。

Vue.use(VueRouter);  /*因为我们是cnpm安装的，所以这里要手动引用。如果使用独立编译文件就不要这样做，因为路由模块会自动安装*/
Vue.use(VueResource);

/* eslint-disable no-new */  /*在js里如果需要使用new一个对象，一定是要赋值给某个值或变量的。但是用new去实例化的时候，不需要赋值给任何值，所以这里单独给下面的代码添加一个注释，eslint-disable no-new就是跳过ESLint规则校验*/
/*new Vue({
  el: 'body',
  components: { App }
})
*/   /*router官网规定要把上面的new Vue实例化的的方法改为Vue.extend({})*/


let app = Vue.extend(App); /*传入的参数是挂载的App.uve组件*/

/*实例化一个router*/
let router = new VueRouter({
	linkActiveClass: 'active'
});

/*定义路由规则*/
router.map({  /*map方法就是配置路由*/
	'/goods':{ //前面的'/'可要可不要,按官网的来
		component: goods
	},
	'/ratings':{
		component: ratings
	},
	'/seller':{
		component: seller
	}
});

/*最后调用router.start，这是是一定要使用的*/
router.start(app,'#app');  //这里用'#app'会报找不到id为app的元素的错误,虽然我App.vue里面定义了id为app的div。
	/*	同时在index.html里面用<app></app>的方式引用，但这样是不对的，把<app></app>改为<div id="app"></div>，同时把App.vue里<div id="app"></div>改为<div></div>才行*/

/*router提供的go方法，让页面打开时默认就进入到router下面的goods页面，而不是显示空白页面*/
router.go('/goods');






