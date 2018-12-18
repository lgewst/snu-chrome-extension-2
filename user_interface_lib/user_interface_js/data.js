var Data = [];

Data["What is unreachable element"] =
        "<h1>Unreachable elements</h1><br> <p>Unreachable elements are the elements in this webpage which is not able to be reached with spatial Navigation Search.</p>"


Data["What is Trap element"] =
        "<h1>Trap elements</h1><br> <p>topological order로 정렬된 SCC에서, 나가는 방향의 edge가 없는 SCC는 trap으로 간주 할 수 있다. 테스트 페이지에서 잘 작동하는 것으로 보인다. SCC가 하나인 경우에도(즉, 현재 보이는 element들이 전부 하나의 trap으로 탐지) highlight되게 설정해놓았>으며, UI를 만들고 난 뒤에는 SCC가 둘 이상인 경우에만 작동하도록 할 예정.`trapped.html`의 경우 `'visible'`모드인 경우 SCC가 하나라고 탐지하여highlight되는 경우이며, `'all'` 인 경우는 기대한대로 작동하여 trap을 탐지한다.</p>"

Data["What is Loop element"] =
        "<h1>Loop elements</h1><br> <p>focusable element의 directed graph를 만들 때, 한 방향키의 input만 있다고 가정하고 `{up,down,left,right}4가지 graph로 SCC를 만든다. 각 노드의 edge가 최대 하나인 경우에 SCC의 구성 요소가 2개 이상인 경우 해당 SCC에서 다른 SCC로 나가는 edge는 존재 할 수 없으며, 따라서 해당 SCC는 loop라고 할 수 있다. 실제로 loop가 있는 경우는 탐지가능하다고 추정 중이나 실제 케이스가 없어서 확인은 못>한 상태. test page처럼 다이나믹하게 변하는 경우는 탐지 불가능 한 상태.</p>"

Data["What is Isolation element"] = ""
Data["What is Focus Error element"] = ""
Data["What is Iframe Error lement"] = ""
Data["What is Non Focussable element"] = ""
Data["What is Fixed Sticky element"] = ""

