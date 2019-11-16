function connect() {
	uni.connectSocket({
		url: 'ws://192.168.100.16:5000/test'
	})
	uni.onSocketOpen(function(res) {
		var _that=this
		setInterval({
			uni.sendSocketMessage({
				data: {
					system: plus.os.name,
					edition: plus.runtime.version,
					time: new Date(),
					info: _that.$store.state.user||{}
				},
				success: (res) => {
					console.log('请求成功')
				}
			});
		},3000)
	});
},

export default connect
