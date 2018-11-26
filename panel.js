chrome.tabs.executeScript({
    file: 'spat_nav_modules/graph.js' //result 는 첫번째 focusable element
}, function(result){
	alert(result);
	var _code = 'document.getElementById("'+result+'").style.background = "orange"'
	//chrome.tabs.executeScript({code: _code });

	document.querySelector('#result_graph').innerText = _code;
	document.querySelector('#result_graph').addEventListener('mousemove', function (e) {
		chrome.tabs.executeScript({code: _code});
	}, false);
});


