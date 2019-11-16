import Vue from 'vue'
import App from './App'
import Api from "./common/api/api.js"


Vue.config.productionTip = false
Vue.prototype.$current = plus.runtime.versionCode

App.mpType = 'app'

// 导入vuex的store
import store from "./store/index.js";

//全局设置消息提示样式
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	console.log(title)
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

//修改已售数量的显示值
const yishou=(data)=>{	
	if(data>=10000){
		return (data/10000).toFixed(1)+'万'
	}
	else{
		return data
	}
}

Vue.prototype.$api = Api;
Vue.prototype.$msg = msg;
Vue.prototype.$store=store;
Vue.prototype.$yishou=yishou;
const app = new Vue({
    ...App
})
app.$mount()
