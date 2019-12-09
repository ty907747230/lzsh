var pinf = plus.push.getClientInfo();
var cid = pinf.clientid; //客户端标识  
function setId(token) {
	uni.request({
		url: `http://39.100.111.131:8088/UserCenter/AddPushTag?token=${token}&push_tag=${cid}`,
		success: (res) => {
			console.log(res.data);

		}
	})
}

export default setId
