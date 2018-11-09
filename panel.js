chrome.tabs.executeScript({
    file: 'dev_test_js.js'
}, function(result){
    document.querySelector('#result_test').innerText = result;
});

chrome.tabs.executeScript({
    file: 'spat_nav_modules/graph.js'
}, function(result){
    document.querySelector('#result_graph').innerText = result;
});

