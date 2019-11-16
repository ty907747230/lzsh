var pinf = plus.push.getClientInfo();
	var cid = pinf.clientid; //客户端标识  
	console.log(cid)

	console.log('App Launch')
	// #ifdef APP-PLUS
	plus.push.addEventListener('click', function(message) {
		if (message.payload) {
			console.log(message)
		}
	});
	plus.push.addEventListener('receive', function(message) {
		if (message.payload) {
			console.log(JSON.parse(message.payload))
		}
	});
	// #endif
