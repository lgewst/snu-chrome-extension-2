//컨텐츠 페이지를 대상으로 코드를 실행해주세요. 

chrome.tabs.executeScript({
    code:'document.querySelector("body").innerText'
}, function(result){
    //위의 콛그ㅏ 실행 된 후에 이 함수를 호출해주세요. 그때 result에 담아주세요.
    var bodyText = result;
    alert(bodyText)
    // document.querySelector('#result').innerText =
});

