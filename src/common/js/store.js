// 设置localStorage的方法  (商家id，键，值)
export function saveToLocal(id,key,value) {
	var seller = window.localStorage.__seller__;
	// 没有seller时，初始化seller及seller[id]
	if(!seller) {
		seller = {};
		seller[id] = {};
	}else {
		seller = JSON.parse(seller);
		if(!seller[id]) {
			seller[id] = {};
		}
	}
	seller[id][key] = value;
	// 键__seller_  值seller(需要转换成字符串)
	window.localStorage.__seller__ = JSON.stringify(seller);
}
// 读取localStorage 的方法 (商家id，键，默认值)
export function loadFromLocal(id,key,def) {
	var seller = window.localStorage.__seller__;
	if(!seller) {
		return def;
	}
	var data = JSON.parse(seller)[id];
	if(!data) {
		return def;
	}
	var flag = data[key];
	return flag || def;
}