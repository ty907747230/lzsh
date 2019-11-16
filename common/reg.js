// str = "https://item.m.jd.com/product/56892272560.html?wxa_abtest=o&utm_source=iosapp&utm_medium=appshare&utm_campaign=t_335139774&utm_term=CopyURL&ad_od=share&utm_user=plusmember"




function jdID(str) {
    try
    {
        var jd_id = str.match(/product\/(\S*?).html/)[1];
    }catch(err)
    {
        jd_id = false
    }
    return jd_id;
}   

// var id = jdID(str)

// console.log(id);

export default jdID;

