import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		
		user: uni.getStorageSync('lzd-user') || "", //用户登录信息
		userpersonal: uni.getStorageSync('lzd-userInfo') || {}, //个人中心信息
		userlevel: uni.getStorageSync('lzd-level') || "", //用户
		userpid: uni.getStorageSync('lzd-pid') || ""
	},
	mutations: {
		
		//所有的单独id
		setAllpid(state, data) {
			console.log(state, data)
			state.userpid = {
				jd_id: data.jd_id,
				pdd_id: data.pdd_id,
				relation_id: data.relation_id
			};
			console.log(state.userpid)
			//保存到本地
			uni.setStorageSync('lzd-pid', state.userpid)
		},
		//修改佣金
		editLevel(state, data) {
			console.log(state, data)
			state.userlevel = {
				level: data.level,
				level_percent: data.level_percent,
				on_off: data.on_off,
				next_level_percent: data.next_level_percent
			};
			console.log(state.userlevel)
			//保存到本地
			uni.setStorageSync('lzd-level', state.userlevel)
		},
		//修改本地存储(登录获取到的用户信息)
		editUser(state, data) {
			console.log(data)
			store.commit("editLevel", data);
			state.user = data;
			//保存relation_id,通过把relation_id保存在内存中保存
			uni.setStorageSync("relation_id", data.relation_id);
			//保存到本地
			uni.setStorageSync('lzd-user', data);
		},
		//修改本地存储(用户信息,个人中心)
		editUserpersonal(state, data) {
			console.log(data)
			store.commit("editLevel", data.base_info);
			state.userpersonal = data;
			//保存relation_id
			uni.setStorageSync("relation_id", data.auth_info.relation_id);
			//保存到本地
			uni.setStorageSync('lzd-userInfo', data)
		},

		//清除本地存储
		clearToken(state) {
			state.user = '';
			state.userpersonal = "";
			state.userlevel = {};
			state.userpid = {};
			//移除token与用户信息
			uni.removeStorageSync('lzd-userInfo');
			uni.removeStorageSync('lzd-user');
			uni.removeStorageSync('relation_id');
			uni.removeStorageSync('lzd-phone');
			uni.removeStorageSync('lzd-level');
			uni.removeStorageSync('lzd-pid');

		}
	}
})


export default store
