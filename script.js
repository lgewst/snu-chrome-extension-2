//컨텐츠 페이지를 대상으로 코드를 실행해주세요. 
var scc = [];
// chrome.tabs.executeScript(null, {file: "polyfill/spatnav-heuristic.js"}, function(){});
chrome.tabs.executeScript(null, {file: "spat_nav_modules/graph.js"},
function(){});

// function scc_list(scc){
//     for(var i = 0; i<scc.length; i++){
//         for(var j = 0; j<scc[i].length; j++){
//             var textNode = document.createTextNode(scc[i][j].textContent);
//             var element = document.createElement("div");
//             element.appendChild(textNode);
//             document.body.appendChild(element);
//         }   
//     }
// }