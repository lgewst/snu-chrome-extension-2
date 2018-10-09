/* A fuction that makes a data structure of Graph.
 * 
 * Two dimensional array
 * 
 * Row
 * Length of the number of focusble element.
 * 
 * Column
 * idx   | 0      | 1  | 2    | 3    | 4     |
 * Nodes | origin | up | down | left | right |
 *  
 */
function make_data_structure(){
    var focusable = document.body.focusableAreas({'mode': 'all'});
    var graph = new Array(focusable.length);
    var dir = [null, "up", "down", "left", "right"];

    for(var i = 0; i < focusable.length; i++){
        graph[i] = new Array(5);
        graph[i][0] = focusable[i];
        for(var j = 1; j < 1 + dir.length; j++){
            graph[i][j] = window.__spatialNavigation__.findNextTarget(graph[i][0],dir[j]);
        }
    }
    return graph;
}
