//此文件用于整个项目的api接口-80

import http from "@/common/http";
//全局配置http
//设置baseUrl
http.config.baseUrl = "http://39.100.111.131:";
//设置请求前拦截器
http.interceptor.request = config => {
	//添加通用参数
	// config.header = {
	// 	"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
	// }
};
//设置请求结束后拦截器
http.interceptor.response = response => {
	//判断返回状态 执行相应操作
	return response;
};

/*8080端口*/
//获取商品列表
const getGood = (channel, pagesize, pageno) => http.get("8080/getgood", {
	channel,
	pagesize,
	pageno
});

//通过id获取商品详情图片
const getGoodDetailById = (num_iid) => http.get("8080/getdetailgood", {
	num_iid
});

//通过id获取商品明细
const getdlById = (num_iid) => http.get("8080/getdl_byid", {
	num_iid
});

//通过id获取优惠券
const getTicket = (num_iid) => http.get("8080/couponLinkInfo", {
	num_iid
});

//猜你喜欢商品列表（废弃）
const getLikeShop = (num_iid, device_type, pagesize, pageno) => http.get("8080/getYourLike", {
	num_iid,
	device_type,
	pagesize,
	pageno
})

//9.9包邮
// const getNineShop=(pagesize,pageno,cat)=>http.get('8080/NineShip',{
// 	pagesize,
// 	pageno,
// 	cat
// })

//发朋友圈
const circleFriends = (pagesize, pageno) => http.get("8080/circleFriends", {
	pagesize,
	pageno,
})

//聚划算
const JuCheap = (pagesize, pageno, sort) => http.get("8080/JuCheap", {
	pagesize,
	pageno,
	sort,
})

//淘抢购
const HotPurchase = (pagesize, pageno, sort) => http.get("8080/HotPurchase", {
	pagesize,
	pageno,
	sort,
})

//common接口
const getDetailCommon = (item_id) => http.get("8080/Detail", {
	item_id,
})

//两小时榜单接口
const VolumeHour = (pageno, pagesize, cid) => http.get("8080/VolumeHour", {
	pageno,
	pagesize,
	cid
})

//全天榜单
const VolumeDay = (pageno, pagesize, cid) => http.get("8080/VolumeDay", {
	pageno,
	pagesize,
	cid
})

//相似商品
const SimilarGoods = (pagesize, pageno, item_id) => http.get("8080/SimilarGoods", {
	pagesize,
	pageno,
	item_id
})

//9.9包邮
const NineShop = (pagesize, pageno, lowprice, highprice, sort) => http.get('8080/NineShop', {
	pagesize,
	pageno,
	lowprice,
	highprice,
	sort
})

//猜你喜欢（新）
const GuessLike = (sort, pagesize, pageno, device_type) => http.get('8080/GuessLike', {
	sort,
	pagesize,
	pageno,
	device_type
})

//淘口令
const tkl = (item_id) => http.get('8080/tkl', {
	item_id
})

//热搜关键词词典
const HotSearch = (page_size) => http.get('8080/HotSearch', {
	page_size
})

//搜索
const SearchCoupons = (pageno, pagesize, sort, q, youquan) => http.get('8080/SearchCoupons', {
	pageno,
	pagesize,
	sort,
	q,
	youquan
})

//高佣金
const HighCommission = (pageno, pagesize) => http.get('8080/HighCommission', {
	pageno,
	pagesize

})

//获取分类
const Type = () => http.get("8080/type", {

})

//是否已收藏
const MyCollectionsExsit = (token, item_id) => http.post("8088/UserCenter/MyCollectionsExsit", {
	token,
	item_id
})

//收藏
const AddMyCollections = (token,
	item_id,
	pict_url,
	title,
	quanhou_jiage,
	type_one_id,
	tkfee3) => http.post("8088/UserCenter/AddMyCollections", {
	token,
	item_id,
	pict_url,
	title,
	quanhou_jiage,
	type_one_id,
	tkfee3
})

//删除收藏
const DelMyCollections = (token, item_id_list, is_all) => http.post("8088/UserCenter/DelMyCollections", {
	token,
	item_id_list,
	is_all
})

//进入我的收藏
const MyCollections = (token, page, per_page) => http.post("8088/UserCenter/MyCollections", {
	token,
	page,
	per_page
})

//搜索联想
const suggest = (content) => http.get("8080/suggest", {
	content
})

//分类查询
const shop_type_detail = (pagesize, pageno, cid, q) => http.get("8080/shop_type_detail", {
	pagesize,
	pageno,
	cid,
	q
})

//分类查询
const classify_search = (sort, min_id, keyword) => http.get("8080/classify_search", {
	sort,
	min_id,
	keyword
})

/*5000端口*/
//获取验证码
const getRegisterCode = (phone) => http.get("8088/login/GetPhoneCode?phone", {
	phone,
	category: "authentication"
})

//获取邀请码
const getInviteCode = (phone,
	union_id,
	chief_code,
	name,
	user) => http.post(
	"8088/login/getInviteCode", {
		phone,
		union_id,
		chief_code,
		name,
		user
	})

//用户注册或登录
const login = (phone, code, union_id) => http.get("8088/login/index", {
	phone,
	code,
	union_id
})


//8888端口
//发单分享二维码
const qrCode = (item_id, relation_id) => http.get("8888/qrCode", {
	item_id,
	relation_id
})


// 8088端口
//获取淘宝授权淘口令
const GetTkl = (rtag) => http.get("8088/GetTkl", {
	rtag
})

//微信绑定
const BindWechat = (token, union_id) => http.post("8088/UserCenter/Setting/BindWechat", {
	token,
	union_id
})

//提现
const CashOut = (token, money, alipay, alipay_name) => http.post("8088/UserCenter/CashOut", {
	token,
	money,
	alipay,
	alipay_name
})

const BindPhone = (token, phone, code) => http.post("8088/UserCenter/Setting/BindPhone", {
	token,
	phone,
	code
})

//修改微信号
const WechatNum = (token, wechat_num) => http.post("8088/UserCenter/Setting/WechatNum", {
	token,
	wechat_num
})

const Authorization = (rtag) => http.get('8088/Authorization', {
	rtag
})

//保存relation_id
const GetAuth = (token, relation_id,flag) => http.post('8088/UserCenter/GetAuth', {
	token,
	relation_id,
	flag
})

//获取用户数据
const UserCenter = (token) => http.post(
	"8088/UserCenter/index", {
		token
	})

//我的订单
const MyOrders = (token, status, page, per_page,platform) => http.post("8088/UserCenter/MyOrders", {
	token,
	status,
	page,
	per_page,
	platform
})

//团队订单
const TeamOrders = (token, status, page, count,platform_type) => http.post("8088/UserCenter/TeamOrders", {
	token,
	status,
	page,
	count,
	platform_type
})

//我的团队
const MyTeam = (token, status, page, count) => http.post("8088/UserCenter/MyTeam", {
	token,
	status,
	page,
	count
})

const relation_tkl_q = (item_id, relation_id) => http.get("8080/gao_link", {
	item_id,
	relation_id
})


const relation_tkl = (item_id, relation_id) => http.get("8080/relation_tkl", {
	item_id,
	relation_id
})

//赚商品标题or ID
const open_shangpin_id = (content, to_title) => http.get("8080/open_shangpin_id", {
	content,
	to_title
})

//收益报表
const IncomeStatement=(token,income_type)=>http.post("8088/UserCenter/IncomeStatement",{
	token,
	income_type
})

//分享推广
const SharePoster=(token)=>http.get('8088/UserCenter/SharePoster',{
	token
})

//京东商品详情
const goods_detail=(goods_id)=>http.get('8080/goods_detail',{
	goods_id
})

//京东转链
const unionurl=(goods_id,positionid,couponurl)=>http.get('8080/unionurl',{
	goods_id,
	positionid,
	couponurl
})

//京东相拼详情
const jd_goods_list=(pageno,pagesize,keyword,sortname,sort,iscoupon)=>http.get('8080/jd_goods_list',{
	pageno,pagesize,keyword,sortname,sort,iscoupon
})


//拼多多系列
const pdd_goods_list=(page_no,page_size,sort_type,with_coupon,keyword)=>http.get('8080/pdd_goods_list',{
	page_no,page_size,sort_type,with_coupon,keyword
})

const pdd_goods_detail=(goods_id)=>http.get('8080/pdd_goods_detail',{
	goods_id
})

const pdd_union_url=(goods_id,pdd_id)=>http.get('8080/pdd_union_url',{
	goods_id,pdd_id
})

const create_pdd_id=(pdd_name)=>http.get('8080/create_pdd_id',{
	pdd_name
})

const get_recommend_goods=(page_no,page_size,channel_type)=>http.get('8080/get_recommend_goods',{
	page_no,page_size,channel_type
})

//所有id的获取

const GetAllPid=(token)=>http.get('8088/UserCenter/GetAllPid',{
	token
})

//添加足迹
const AddMyTracks=(token,item_id,pict_url,title,quanhou_jiage,type_one_id,tkfee3,cost_price,coupon,sales)=>http.post('8088/UserCenter/AddMyTracks',{
	token,item_id,pict_url,title,quanhou_jiage,type_one_id,tkfee3,cost_price,coupon,sales
})

//添加隐藏开关
const GetIosVersion=(version_num)=>http.get('8088/UserCenter/GetIosVersion',{
	version_num
})

//添加扩展开关
const GetExtendOnOff=(version_num)=>http.get('8088/UserCenter/GetExtendOnOff',{
	version_num
})
//版本控制

const HandleLink=(tkl,pic)=>http.get('8080/HandleLink',{
	tkl,pic
})

//暴露API
export default {
	getGood,
	getGoodDetailById,
	getdlById,
	getRegisterCode,

	getTicket,
	getLikeShop,
	// getNineShop,
	qrCode,
	circleFriends,
	JuCheap,
	HotPurchase,
	getDetailCommon,
	VolumeHour,
	VolumeDay,
	SimilarGoods,
	NineShop,
	GuessLike,
	tkl,
	HotSearch,
	SearchCoupons,
	HighCommission,
	getInviteCode,
	Type,
	shop_type_detail,
	GetAuth,
	UserCenter,
	login,
	MyOrders,
	TeamOrders,
	MyTeam,
	relation_tkl_q,
	relation_tkl,
	BindWechat,
	BindPhone,
	CashOut,
	AddMyCollections,
	DelMyCollections,
	MyCollections,
	MyCollectionsExsit,
	open_shangpin_id,
	WechatNum,
	IncomeStatement,
	classify_search,
	SharePoster,
	goods_detail,
	unionurl,
	jd_goods_list,
	pdd_goods_list,
	pdd_goods_detail,
	pdd_union_url,
	create_pdd_id,
	get_recommend_goods,
	GetAllPid,
	AddMyTracks,
	GetIosVersion,
	GetExtendOnOff,
	HandleLink
};
