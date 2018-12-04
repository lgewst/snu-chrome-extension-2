# snu-chrome-extension-2

## test_page/index.html 와 test_page/trapped.html에 대해 동작을 확인하는 방법

1. `git clone https://github.com/lgewst/snu-chrome-extension-2.git` 으로 받은 다음에 chrome 설정 => 도구 더보기 => 확장프로그램.
1. 압축해제된 확장프로그램을 로드합니다 click => clone한 folder click => 확인.
1. chrome에서 우클릭 => 검사를 누르고 spat_nav탭에 들어가면 UI를 볼 수 있다.
1. UI에서 각각의 detector를 누르면 검사를 실행하고 해당 요소들을 출력함.

## SCC (Strongly Connected Component)
1. 같은 SCC 내에 속하는 임의의 서로 다른 두 정점은 서로 도달 가능하다.
1. 어떤 정점이나 간선도 1의 조건을 만족하면서 이 SCC에 추가될 수 없다.(최대부분집합)
1. SCC를 node로 보았을 때, edge들이 condensation된 상태에서 DAG형태로 변환 할 수 있다.

- focusable element의 directed graph를 SCC를 이용하여 DAG를 그리면 topological order로 정렬할 수 있다.
이렇게 만든 SCC를 가지고서 각종 error를 탐지하고 리포트를 한다.
- 코사라주 알고리즘을 이용하여 SCC를 만들었으며 O(V+E), Condensation은 찾을 수 없어서 직접 구현하였다 O(V+E).

## Detectors with SCC
### trap detector
topological order로 정렬된 SCC에서, 나가는 방향의 edge가 없는 SCC는 trap으로 간주 할 수 있다.

테스트 페이지에서 잘 작동하는 것으로 보인다. SCC가 하나인 경우에도(즉, 현재 보이는 element들이 전부 하나의 trap으로 탐지) highlight되게 설정해놓았으며, UI를 만들고 난 뒤에는 SCC가 둘 이상인 경우에만 작동하도록 할 예정.

`trapped.html`의 경우 `'visible'`모드인 경우 SCC가 하나라고 탐지하여 highlight되는 경우이며, `'all'` 인 경우는 기대한대로 작동하여 trap을 탐지한다.

### loop detector
focusable element의 directed graph를 만들 때, 한 방향키의 input만 있다고 가정하고 `{"up", "down", "left", "right"}` 4가지 graph로 SCC를 만든다.

각 노드의 edge가 최대 하나인 경우에 SCC의 구성 요소가 2개 이상인 경우 해당 SCC에서 다른 SCC로 나가는 edge는 존재 할 수 없으며, 따라서 해당 SCC는 loop라고 할 수 있다. 

실제로 loop가 있는 경우는 탐지가능하다고 추정 중이나 실제 케이스가 없어서 확인은 못한 상태. test page처럼 다이나믹하게 변하는 경우는 탐지 불가능 한 상태.

### unreachable detector
starting point가 어디냐에 따라 unreachable element가 바뀔 수 있다. isolated SCC가 없다는 가정하에, 어떤 SCC에서 시작하여 방향키를 누른다면 SCC는 DAG상태로 정렬 되어 있으므로 나가는 방향의 SCC만 탐색할 수 있다. 따라서 SCC의 edge들을 역으로 뒤집은 후에, DFS함으로써 unreachable SCC를 찾을 수 있다.

`index.html`에서 잘 작동하는 것으로 보이며, `'visible'` 일 때 잘 작동하는 것을 확인 할 수 있었다. focusable element들 중 가장 처음 element에서 시작하며, 키보드로만 움직인다는 가정하에 만들었다. unreachable의 경우에 방향키가 아닌 우연한(터치, 탭 등등) 방법으로 unreachable element에 focus되었을 때, 키보드를 누르면 다른 element로 focus를 옮길 수 있다.

### isolation detector
위의 가정과는 다르게, isolated된 SCC가 있다는 가정하에 적용할 수 있다. 이 경우가 실제 웹에서 발생 할 수 있는지는 확실치 않다.

고립되어있는 SCC는 해당 SCC내에서는 자유롭게 움직일 수 있지만 다른 SCC로 넘어 갈 수 없다. unreachable과는 다르게 우연히 isolated SCC에 focus가 갔을 때, 키보드로는 다른 SCC로 넘어 갈 방법이 없는 것을 상정하였다.

## Other detectors

### focus_error_detector
focus가 가능한 element에 대해서 focus ring이 명확하지 않은 경우를 탐지한다.
focus ring의 색깔을 기존의 outline, border, background와 비교하여 차이가 적으면 에러로 탐지한다.
또한 focus ring 두께가 1px미만인 경우에도 사람 눈에 보이기 힘들다고 판단하여 에러로 탐지한다.

### non_focusable_button_detector
clickable하거나 마우스로는 event를 발생시킬 수 있지만, 키보드로는 접근 불가능한 경우를 탐지한다.

### fixed_sticky_detector
fixed element와 sticky element를 탐지한다.
이런 요소들은 element간의 상대적인 위치를 변화시키기 때문에 spat_nav에 혼란을 줄 수 있다.
따라서 warning을 띄우도록 한다.

### iframe_detector
iframe의경우 html내의 html로써 iframe도 하나의 element이면서 내부의 element를 가지고 있는 상태이다.
이런 경우에 예상과는 다르게 작동할 가능성이 존재하여, warning을 띄우도록 한다.

## UI templete.
### License
http://tympanus.net/codrops/licensing/
Thanks to tympanus for the templete.
