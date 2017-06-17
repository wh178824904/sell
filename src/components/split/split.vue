<template>
	<div class="split"></div>
	<!-- vue里面组件也是可以非常小的，这个组件就是一个带背景的矩形框，在很多地方都用到了。因为只是css样式组件所以比其他引用方式少了在data里面添加关联输数据的步骤。只有先import引入，再在components里注册，然后在template里面<split></split>引入就可以看到组件的效果了 -->
</template>

<script type="text/ecmascript-6">
    export default{};
</script>

<style lang="stylus" rel="stylesheet">
    .split
    	width: 100%
    	height: 16px
    	border-top: 1px solid rgba(7,17,27,0.1)
    	border-bottom: 1px solid rgba(7,17,27,0.1)
    	background: #f3f5f7
</style>