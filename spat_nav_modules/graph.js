function graph(){
  this.adj_array = this.make_adj_array();
  this.adj_list = [];
  this.rev_adj_list = [];
  this.node_num;
  this.scc = [];
  this.visited;
  this.stack = [];
}

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
graph.prototype.make_adj_array = function(){
    var focusable = document.body.focusableAreas({'mode': 'visible'});
    this.node_num = focusable.length;
    this.visited = new Array(this.node_num).fill(0);

    var graph = new Array(this.node_num);
    var dir = ["up", "down", "left", "right"];

    for(var i = 0; i < this.node_num; i++){
      focusable[i].node_id = i
      graph[i] = new Array(5);
      graph[i][0] = focusable[i];

      for(var j = 0; j < dir.length; j++){
          graph[i][j+1] = window.__spatialNavigation__.findNextTarget(graph[i][0],dir[j]);
      }
    }
    return graph;
}

graph.prototype.remove_redundancy_in_array = function(input_array){
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

 graph.prototype.make_adj_list = function(arrow_graph){

  var directed_graph = [];

  for(var i = 0; i < arrow_graph.length; i++){
    var tmp = new Array();
    var origin = arrow_graph[i][0];
    var destinations_with_each_arrow_keys = arrow_graph[i].slice(1,arrow_graph[i].length);
    var destinations_without_redundancy = this.remove_redundancy_in_array(destinations_with_each_arrow_keys);

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
graph.prototype.insert_node_in_directed_graph = function(starting_node, dest_node, graph_list){
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


graph.prototype.make_rev_adj_list = function(directed_graph){
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
    for(var j = 1; j < directed_graph[i].length; j++){
      reversed_graph_list[directed_graph[i][j].node_id].push(directed_graph[i][0]);
    }
  }
  return reversed_graph_list;
}


/*
 * SCC(Strong Conected Component) with DFS
 * 
 */

graph.prototype.make_scc = function(){
  for(var node_id = 0; node_id < this.node_num; node_id++){
    if(!this.visited[node_id]){
      this.front_dfs(node_id);
    }
  }

  this.visited.fill(0);
  while(this.stack.length){
    var node_id = this.stack.pop();
    if(!this.visited[node_id]){
      this.scc.push([]);
      this.rev_dfs(node_id)
    }
  }

  this.condensation();
}

graph.prototype.front_dfs = function(node_id){
  this.visited[node_id] = 1;
  for(var i = 1; i < this.adj_list[node_id].length; i++){
    var next_node_id = this.adj_list[node_id][i].node_id;
    if(!this.visited[next_node_id]){
      this.front_dfs(next_node_id);
    }
  }
  this.stack.push(node_id);
}

graph.prototype.rev_dfs = function(node_id){
  this.visited[node_id] = 1;
  this.adj_list[node_id].scc_id = this.scc.length-1;
  this.scc[this.scc.length-1].push(this.rev_adj_list[node_id][0]);
  for(var i = 1; i < this.rev_adj_list[node_id].length; i++){
    var next_node_id = this.rev_adj_list[node_id][i].node_id;
    if(!this.visited[next_node_id]){
      this.rev_dfs(next_node_id)
    }
  }
}

graph.prototype.condensation = function(){
  var tmp = [];
  for(var i = 0; i < this.scc.length; i++){
    tmp.length = 0;
    for(var j = 1; j < this.scc[i].length; j++){
      var node = this.scc[i][j];
      var o_arrow_num = this.adj_list[node.node_id].length;
      for(var k = 1; k < o_arrow_num; k++){
        var o_node = this.adj_list[node.node_id][k].node_id
        if(this.adj_list[o_node].scc_id != this.adj_list[node.node_id].scc_id) tmp.push(this.adj_list[o_node].scc_id);
      }
    }
    $.each(tmp, function(key, value){
      if($.inArray(value, this.scc[i][0]) === -1) this.scc[i][0].push(value);
    })
  }
}

function trap_detector(){
  // if(scc.length == 1) return;
  var graph_trap = new graph();
  graph_trap.adj_list = graph_trap.make_adj_list(graph_trap.adj_array);
  graph_trap.rev_adj_list = graph_trap.make_rev_adj_list(graph_trap.adj_list);
  graph_trap.make_scc();
  for(var i = 0; i < graph_trap.scc.length; i++){
    if(!graph_trap.scc[i][0].length){
      for(var j = 0; j < graph_trap.scc[i].length; j++){
	      graph_trap.scc[i][j].style.backgroundColor = "#FDFF47"
	      graph_trap.scc[i][j].style.color = "#47e0ff"
	      graph_trap.scc[i][j].style.borderColor = "yellow"
	      graph_trap.scc[i][j].style.borderStyle = "dotted"
	      graph_trap.scc[i][j].style.borderWidth = "1"
      }
    }
  }
  return graph_trap.scc
}

function loop_detector(){

}

function unreachable_detector(){

}

chrome.storage.sync.set(
  {'scc' : trap_detector()}
)