var scc = [];
// chrome.tabs.executeScript(null, {file: "polyfill/spatnav-heuristic.js"}, function(){});
chrome.tabs.executeScript({
    //code: 'document.querySelector("body").innerText'
    code: 'document.body.focusableAreas({"mode": "visible"})[0].id;'
}, function(result){
    alert(result);
});
