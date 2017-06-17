/*
* @Author: Administrator
* @Date:   2017-06-04 16:15:14
* @Last Modified by:   Administrator
* 解析url参数http://localhost:8080/?id=12345&a=b/#!/ratings
* @example ?id=12345&a=b
* @return Object {id:12345,a:b}
*/

export function urlParse() {
	let url = window.location.search;
	let obj = {};
	let org = /[?&][^?&]+=[^?&]+/g;
	let arr = url.match(org);
	//['id=12345','&a=b']
	if (arr) {
		arr.forEach((item) => {
			let tempArr = item.substring(1).split('=');
			let key = decodeURIComponent(tempArr[0]);  //操作url，所以要decodeURIComponent检验
			let val = decodeURIComponent(tempArr[1]);
			obj[key] = val; //obj[id] =12345;
		});
	}
	return obj;
};