export function formatDate(date,fmt) { //export引入事件，输入date参数，输出fmt是字符串
    if(/(y+)/.test(fmt)) {//利用正则表达式,传入"yyyy-MM-dd hh:mm"，然后动态的遍历字符串，正则表达式把这些字符串替换成我们要的日期的年月日
			fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
	};
	let o = {
		'M+' :date.getMonth() +1,
		'd+' :date.getDate(),
		'h+' :date.getHours(),
		'm+' :date.getMinutes(),
		's+' :date.getSeconds()
	};
	for(let k in o) {
		if(new RegExp(`(${k})`).test(fmt)) {
			let str = o[k]+'';
			fmt = fmt.replace(RegExp.$1,(RegExp.$1.length ===1)?str:padLeftZero(str));
		}
	}
	return fmt;
};

function padLeftZero(str) {  //如果长度是1，就在前面加0，如09
	return ('00'+str).substr(str.length);
}              