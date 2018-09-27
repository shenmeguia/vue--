// 解析URL参数的方法
export function urlParse () {
	// window.location.search 获取到URL ?后面的参数
	// match(正则) 返回一个数组
	var url = window.location.search,
			obj = {},
			reg = /[?&][^?&]+=[^?&]+/g,
			arr = url.match(reg);
	if(arr) {
		arr.forEach((item) => {
			// decodeURIComponent()对URI编码解码
			var tempArr = item.substring(1).split('='),
					key = decodeURIComponent(tempArr[0]),
					value = decodeURIComponent(tempArr[1]);
			obj[key] = value;
		});
	}
	return obj;
}