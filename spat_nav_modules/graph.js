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
var node_num;

function make_data_structure(){
    var focusable = document.body.focusableAreas({'mode': 'all'});
    node_num = focusable.length;
    var graph = new Array(node_num);
    var dir = ["up", "down", "left", "right"];

    for(var i = 0; i < node_num; i++){
      focusable[i].node_id = i
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
function insert_node_in_directed_graph(starting_node, dest_node, graph_list){
// graph_list is list of list.
// each list is composed with starting node and destination nodes.
// the first element is starting_node.
// ex> reverse_graph_list[10][0] = starting node
// ex> reverse_graph_list[10][1:] = all destination nodes list

  for(var i = 0; i < graph_list.length; i++){
    var curr_node = graph_list[i][0];
    if( curr_node == starting_node){ graph_list[i].push(dest_node); return graph_list; }
  }
  graph_list.push([starting_node,dest_node]);
  return graph_list;
}


function make_reversed_directed_graph(directed_graph){
// the return value (reversed_directed_graph_without_redundanc) is list of list.
// each list is composed with starting node and destination nodes.
// the first element is starting_node.
// ex> reverse_graph_list[10][0] = starting node
// ex> reverse_graph_list[10][1:] = all destination nodes list

  var reversed_graph_list = [];

  for (var i = 0; i < directed_graph.length; i++){
    reversed_graph_list.push([directed_graph[i][0]]);
  }

  for(var i = 0; i < directed_graph.length; i++){

    var former_starting_node = directed_graph[i][0];

    for(var j=1; j< directed_graph[i].length; j++){
      var former_destination = directed_graph[i][j];
      var reverse_graph_list = insert_node_in_directed_graph(former_destination, former_starting_node, reversed_graph_list)
    }
  }

  var reversed_directed_graph_without_redundancy = []
  // redundancy must be removed in destination list of each starting node.
  for(var k=0; k< reversed_graph_list.length; k++){
    var element = [reverse_graph_list[k][0]]
    element = element.concat(remove_redundancy_in_array(reverse_graph_list[k].slice(1,reverse_graph_list[k].length)));
    reversed_directed_graph_without_redundancy.push(element)
  }

  return reversed_directed_graph_without_redundancy;
}

var graph = make_data_structure(); var res = make_directed_graph(graph); var rev = make_reversed_directed_graph(res);

/*
 * SCC(Strong Conected Component) with DFS
 * 
 */

var scc = [];
var visited = new Array(node_num).fill(0);
var stack = [];

function make_scc(){
  for(var node_id = 0; node_id < node_num; node_id++){
    if(!visited[node_id]){
      front_dfs(node_id);
    }
  }

  visited.fill(0);
  while(stack.length){
    var node_id = stack.pop();
    if(!visited[node_id]){
      scc.push([]);
      scc[scc.length-1].push([]);
      rev_dfs(node_id)
    }
  }

  condensation();
}

function front_dfs(node_id){
  visited[node_id] = 1;
  for(var i = 1; i < res[node_id].length; i++){
    var next_node_id = res[node_id][i].node_id;
    if(!visited[next_node_id]){
      front_dfs(next_node_id);
    }
  }
  stack.push(node_id);
}

function rev_dfs(node_id){
  visited[node_id] = 1;
  res[node_id].scc_id = scc.length-1;
  scc[scc.length-1].push(rev[node_id][0]);
  for(var i = 1; i < rev[node_id].length; i++){
    var next_node_id = rev[node_id][i].node_id;
    if(!visited[next_node_id]){
      rev_dfs(next_node_id)
    }
  }
}

function condensation(){
  var tmp = [];
  for(var i = 0; i < scc.length; i++){
    tmp.length = 0;
    for(var j = 1; j < scc[i].length; j++){
      var node = scc[i][j];
      var o_arrow_num = res[node.node_id].length;
      for(var k = 1; k < o_arrow_num; k++){
        var o_node = res[node.node_id][k].node_id
        if(res[o_node].scc_id != res[node.node_id].scc_id) tmp.push(res[o_node].scc_id);
      }
    }
    $.each(tmp, function(key, value){
      if($.inArray(value, scc[i][0]) === -1) scc[i][0].push(value);
    })
  }
}

function trap_detector(){
  for(var i = 0; i < scc.length; i++){
    if(!scc[i][0].length){
      for(var j = 1; j < scc[i].length; j++){
	      scc[i][j].style.backgroundColor = "#FDFF47"
	      //scc[i][j].style.color = "#47e0ff"
      }
    }
  }
}

make_scc();
trap_detector();
