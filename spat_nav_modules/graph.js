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
    var dir = ["up", "down", "left", "right"];

    for(var i = 0; i < focusable.length; i++){
        graph[i] = new Array(5);
        graph[i][0] = focusable[i];

        for(var j = 0; j < dir.length; j++){
            graph[i][j+1] = window.__spatialNavigation__.findNextTarget(graph[i][0],dir[j]);
        }
    }
    return graph;
}

function remove_redundancy_in_array(input_array){
  var output_array = [];
  $.each(input_array, function(i, el){
    if($.inArray(el, output_array) === -1) output_array.push(el);
});
  var filtered_output_array = output_array.filter(function (el) {
  return el != null;
  });
  return filtered_output_array;
}


/* A fuction that makes a  directed graph in the form of two dimensional list
 *
 * Row
 * Length of the number of focusble element.
 *
 * Column
 * Nodes | origin | [destinations]
 *
 */

 // Here, directed graph means a grpah only having directed edge
 // that can be represented with a pair of two nodes (from, to)
 // which is not related to arrow keys direction.

 // To use this function the html code should import JQuery as below.
 // <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>

function make_directed_graph(arrow_graph){

  var directed_graph = [];

  for(var i = 0; i < arrow_graph.length; i++){
    var tmp = new Array();
    var origin = arrow_graph[i][0];
    var destinations_with_each_arrow_keys = arrow_graph[i].slice(1,arrow_graph[i].length);
    var destinations_without_redundancy = remove_redundancy_in_array(destinations_with_each_arrow_keys);

    tmp.push(origin);
    Array.prototype.push.apply(tmp,destinations_without_redundancy);
    directed_graph.push(tmp);
  }
  return directed_graph;
}

/* A fuction that makes a  reversed directed graph in the form of {key,value} list
 *
 * Row
 * Length of the number of focusble element.
 *
 * Column
 * Nodes | origin | [destinations]
 *
 */

function make_reversed_directed_graph(directed_graph){

  var reversed_directed_graph = {}; // A Dicitionary containing starting node as a key and destination nodes as a list

  for(var i = 0; i < directed_graph.length; i++){

    var former_origin = directed_graph[i][0];

    for(var j=1; j< directed_graph[i].length; j++){

      var former_destination = directed_graph[i][j];

      if (former_destination.id in reversed_directed_graph){ // check whether former_destination is aleady in the starting node list.
        reversed_directed_graph[former_destination.id].push(former_origin) // If so, push former_origin to the destination.
      }
      else {
        reversed_directed_graph[former_destination.id] = [former_origin]; // If not, create a new list with it.
      }
    }
  }
  return reversed_directed_graph;
}
