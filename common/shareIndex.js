function shareFn(drawList,content,callback){
	console.log(content)
	//以下为计算菜单的nview绘制布局，为固定算法，使用者无关关心
	let screenWidth = plus.screen.resolutionWidth
	let screenHigth = plus.screen.resolutionHeight
	//以360px宽度屏幕为例，上下左右边距及2排按钮边距留25像素，图标宽度55像素，同行图标间的间距在360宽的屏幕是30px，但需要动态计算，以此原则计算4列图标分别的left位置
	//图标下的按钮文字距离图标5像素，文字大小12像素
	//底部取消按钮高度固定为44px
	//TODO 未处理横屏和pad，这些情况6个图标应该一排即可
	let marginTop = 25,//上间距
		marginLeft=25,//左间距
		iconWidth = screenWidth*0.1,//图标宽宽
		iconHeight=screenHigth*0.15,//图标高度
		icontextSpace = 20,//图标与文字间距
		textHeight = 12//文字大小
	let left1 = marginLeft / 360 * screenWidth;
	let colNumber=Math.floor(screenWidth/(iconWidth+marginLeft));
	let i=(screenWidth-(iconWidth+marginLeft)*colNumber-marginLeft)/(colNumber+1);
	let initMargin=marginLeft+i;
	let itemWidth=iconWidth+initMargin;
	let itemHeight=iconHeight+icontextSpace+textHeight+marginTop;
	let textTop=iconHeight+icontextSpace;
	let alphaBg = new plus.nativeObj.View("alphaBg", { //先创建遮罩层
		top: '0px',
		left: '0px', 
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.6)',
	},[
		{id:'back1', tag:'img', src:'/static/index/exit.png', position:{top:screenHigth*0.7+20+'px',width:iconWidth,height:iconWidth,left:screenWidth*0.5-15+'px'},
	}]);
	alphaBg.addEventListener("click", function() { //处理遮罩层点击
		alphaBg.hide();
		shareMenu.hide();
	})
	let shareMenu = new plus.nativeObj.View("shareMenu", { //创建底部图标菜单
		top: screenHigth*0.3,
		left: '15%',
		height:screenHigth*0.4+ 'px',
		width: '70%',
		backgroundColor: 'rgba(0,0,0,0)',
		radius:'15px',
	});
	shareMenu.drawRect({color:'rgba(255,255,255,1)',borderWidth:'2px',radius:'10px'},
		{top:'0px',left:'0px',width:'100%',height:'100%'});
	//绘制底部图标菜单的内容
	shareMenu.draw([
		{
			tag: 'rect',//左分割灰线
			color: '#e7e7e7',
			position: {
				bottom:iconWidth*2+20,
				height: '1px',
				width:'25%',
				left:'10%',
			}
		},
		{
			tag: 'font',
			 id: 'content1',//底部取消按钮的文字
			text: '搜索平台',
			
			textStyles: {
				size: '12px',
				color:'#949494'
				
			},
			position: {
				bottom:iconWidth*2+10,
				left:'35%',
				 height:'20px',
				 width:'30%'
			}
		},
		{
			tag: 'rect',//右分割灰线
			color: '#e7e7e7',
			position: {
				bottom:iconWidth*2+20,
				height: '1px',
				width:'25%',
				left:'65%',
			}
		},
		{
			tag:"img",//顶部标题图片
			src:'/static/index/search.png',
			position:{top:'0px',left:'0px',width:'100%',height:iconHeight}
		},
		{
			tag: 'font',
			 id: 'content',//底部取消按钮的文字
			text: content,
			textStyles: {
				size: '14px',
				whiteSpace:'normal',
				overflow:'ellipsis'
			},
			position: {
				top: iconHeight+screenHigth*0.01, 
				left:'5%',
				 width:'90%',
				height: '40px'
			}
		}
	]);
	drawList.map((v,k)=>{
		let time=new Date().getTime();
		let col=k%colNumber;
		//图标样式
		let item=[{
			src:v.icon,
			id:Math.random()*1000+time,
			tag:"img",
			backgroundColor:'#f00',
			position:{
				bottom:iconWidth,
				left:screenWidth*0.05+screenWidth*k*0.2+iconWidth/2+'px',
				width:iconWidth,
				height:iconWidth
			}
		},{
			text:v.text,
			id:Math.random()*1000+time,
			tag:"font",
			textStyles:{
				size: textHeight
			},
			position:{
				bottom:0,		
				left:screenWidth*0.05+screenWidth*k*0.2+iconWidth/2+'px',
				width:iconWidth,
				height:iconWidth
			}
		}];
		shareMenu.draw(item);
	});
	shareMenu.addEventListener("click", function(e) { //处理底部图标菜单的点击事件，根据点击位置触发不同的逻辑
		console.log(e.clientX,e.clientY)
		//检测3个图标的位置
		if(e.clientY<screenHigth*0.4&&e.clientY>(screenHigth*0.4-iconWidth*2)){
			//淘宝
			if(e.clientX>screenWidth*0.05&&e.clientX<screenWidth*0.25){
				//console.log("淘宝")
				callback&&callback(0);
				alphaBg.hide();
				shareMenu.hide();
			}
			else if(e.clientX>screenWidth*0.3&&e.clientX<screenWidth*0.5){
				//console.log("京东")
				callback&&callback(1);
				alphaBg.hide();
				shareMenu.hide();
			}
			else if(e.clientX>screenWidth*0.55&&e.clientX<screenWidth*0.75){
				//console.log("拼多多")
				callback&&callback(2);
				alphaBg.hide();
				shareMenu.hide();
			}
			
		}
	})
	return {alphaBg,shareMenu};
};
export default shareFn;
