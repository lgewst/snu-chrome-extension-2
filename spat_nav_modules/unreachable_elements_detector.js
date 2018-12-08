var res = unreachable_detector();
alert(res.length);
//var res = document.body.focusableAreas({'mode': 'all'});
var res_arr = Array();
for(i=0; i<res.length; i++){
	res_arr[i] = res[i].outerHTML;
}
res_arr;

