function handelTs(that) {
	var pinf = plus.push.getClientInfo();
	var cid = pinf.clientid; //客户端标识  
	console.log(cid);
	
	// #ifdef APP-PLUS
	plus.push.addEventListener('click', function(message) {
		if (message.payload) {
			console.log(message)
		}
	});
	plus.push.addEventListener('receive', function(message) {
		if (message.payload) {
			console.log(message.payload)
			if(message.payload.indexOf('app_login')!=-1){
				if (!that.$store.state.user) {
					uni.navigateTo({
						url: '/pages/user/login',
					});
					return;
				}
				console.log(JSON.parse(message.payload));
				uni.navigateTo({
					url:JSON.parse(message.payload)['app_login']
				})
			}else if(message.payload.indexOf('web_view')!=-1){
				uni.navigateTo({
					url:'/pages/index/tsweb?url='+JSON.parse(message.payload)['web_view']
				})
			}
		}
	});
	// #endif
}

export default handelTs
