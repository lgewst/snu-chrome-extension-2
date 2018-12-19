# snu-chrome-extension-2

## How to install
1. `git clone https://github.com/lgewst/snu-chrome-extension-2.git`.
1. Navigate to `chrome://extension`.
1. Switch on the developer mode.
1. Click `LOAD UNPACKED` and select the extension folder.

## SCC (Strongly Connected Component)
1. 같은 SCC 내에 속하는 임의의 서로 다른 두 정점은 서로 도달 가능합니다.
1. 어떤 정점이나 간선도 1의 조건을 만족하면서 이 SCC에 추가될 수 없습니다.(최대부분집합)
1. SCC를 node로 보았을 때, edge들이 condensation된 상태에서 DAG형태로 변환 할 수 있습니다.

- focusable element의 directed graph를 SCC를 이용하여 DAG를 그리면 topological order로 정렬할 수 있습니다.
이렇게 만든 SCC를 가지고서 각종 error를 탐지하고 리포트를 합니다.
- 코사라주 알고리즘을 이용하여 SCC를 만들었으며 O(V+E), SCC Condensation은 직접 구현하였습니다 O(V+E).

## Detectors with SCC
### trap detector
- Trap element는 해당 element group에 포커스가 갔을 때, 그 그룹의 element를 제외한 element들에 접근할 수 없게되는 요소입니다.
### loop detector
- Loop element는 해당 element에서 한 방향키를 계속해서 눌렀을 때 다시 해당 element로 포커스가 돌아오는 요소입니다. 
### unreachable detector
- Unreachable element는 키보드를 가지고 해당 element에 접근할 수 없는 요소입니다.
### isolation detector
- Isolation element는 고립되어 있는 element로써, 키보드로는 해당 element에 접근할수도 없고, 우연히 접근한 상태에서도 다른 element로 갈 수 없는 요소입니다.

## Other detectors
### focus_error_detector
- Focus error element는 해당 요소에 focus가 갔을 때, 사용자가 focus ring을 인지하기 힘든 요소입니다.
- Focus ring과 background의 RGB색상거리, Focus ring의 width, style을 검사합니다.
### non_focusable_button_detector
- Iframe element는 Html안의 Html로써, 해당 요소가 있을 때 Spat_nav의 작동이 잘 안될 수 있습니다.
### fixed_sticky_detector
- 해당 element는 마우스로 클릭시에 이벤트가 발생하지만, 키보드로는 focus를 받을 수 없는 요소입니다.
### iframe_detector
- 이 요소들은 focusable element들 간의 상대위치를 변화시켜서 Spat_nav의 작동에 혼란을 줍니다.

## UI templete.
### License
- http://tympanus.net/codrops/licensing.

Thanks to tympanus for the templete!