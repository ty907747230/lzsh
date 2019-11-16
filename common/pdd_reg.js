
// pdd_str = "https://mobile.yangkeduo.com/goods.html?_wvx=10&refer_share_uid=&page_from=35&refer_share_id=sQF6YMlid53B3JvkhNm3iJcClEKfVpR7&_wv=41729&refer_share_channel=copy_link&share_uid=&goods_id=4103112613"


function pddID(str) {
    try
    {
        var pdd_id = str.match(/goods_id=(\d+)/)[1];
		
    }catch(err)
    {
		
        pdd_id = false;
    }
    return pdd_id;
}   

// var id = pddID(pdd_str);

// console.log(id);

export default pddID;


