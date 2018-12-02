// grid dummy data

var dummyData = [];

chrome.tabs.executeScript({
    file: 'spat_nav_modules/graph.js' //result 는 첫번째 focusable element
}, function(result){


/*    var getText = Array();
    alert(result[0].length);

    for (i = 0; i < result[0].length; i++)
    {getText [i] = result[0][i];
    alert("dummy console:"+getText);
    }
*/

    var unreachable_elements = "";

    for (i = 0; i < result[0].length; i++)
    {
    unreachable_elements += result[0][i] + "<br>";
    }

    dummyData["What is unreachable element"] = "<h1>Unreachable elements are the elements in this webpage which is not able to be reached with spatial Navigation Search.</h1>"
    dummyData["Unreachable elements"] = "<h2>Unreachable elements</h2>"+unreachable_elements;
	
});
