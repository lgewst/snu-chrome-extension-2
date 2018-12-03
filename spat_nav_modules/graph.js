function graph(){
  this.adj_array = this.make_adj_array();
  this.adj_list = [];
  this.rev_adj_list = [];
  this.node_num;
  this.rev_scc = [];
  this.scc = [];
  this.visited;
  this.stack = [];
  this.scc_visited = [];
  this.result = [];
}

/* A fuction that makes a data structure of Graph. 
 *
 * Argument
 * 0 : all directions
 * 1 : up
 * 2 : down
 * 3 : left
 * 4 : right
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
graph.prototype.make_adj_array = function(direction){
    var focusable = document.body.focusableAreas({'mode': 'visible'});
    this.node_num = focusable.length;
    console.log(this.node_num);
    console.log(focusable);
    this.visited = new Array(this.node_num).fill(0);
    var graph = new Array(this.node_num);
    var dir = ["up", "down", "left", "right"];

    for(var i = 0; i < this.node_num; i++){
      focusable[i].node_id = i
      if(!direction){
        graph[i] = new Array(5);
        graph[i][0] = focusable[i];
        for(var j = 0; j < dir.length; j++){
          graph[i][j+1] = window.__spatialNavigation__.findNextTarget(graph[i][0],dir[j],{'mode': 'visible'});
        }
      }
      else {
        graph[i] = new Array(2);
        graph[i][0] = focusable[i];
        graph[i][1] = window.__spatialNavigation__.findNextTarget(graph[i][0],dir[direction-1],{'mode': 'visible'});
      }
    }
    return graph;
}


/* A fuction that removes empty and redundant element.
 *
 */
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

/* A fuction that makes a reversed adj_list with directed graph
 *
 * Row
 * Length of the number of focusble element.
 * Same order of directed graph.
 *
 * Column
 * Nodes | destination | [origins] (in view point of directed graph)
 * 
 */

graph.prototype.make_rev_adj_list = function(directed_graph){
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

/* A fuction that makes a reversed scc with scc.
 *
 * has same algorithm with 'make_rev_adj_list'.
 * 
 */
graph.prototype.make_rev_scc = function(scc){
  var rev_scc = [];

  for (var i = 0; i < scc.length; i++){
    rev_scc.push([]);
  }

  for(var i = 0; i < scc.length; i++){
    for(var j = 0; j < scc[i][0].length; j++){
      rev_scc[scc[i][0][j]].push(i);
    }
  }

  this.rev_scc = rev_scc;
}

/*
 * SCC(Strong Conected Component) with DFS
 * scc[i][0] contains edges.
 * (e.g : scc[0][0] == [1,2] means scc[0] has directed edges to scc[1], scc[2])
 * scc[i][j] (j >= 1) is a node of scc.
 * scc[i][1], scc[i][2], scc[i][3] ... are nodes that belong to scc[i]
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
      this.scc[this.scc.length-1].push([]);
      this.rev_dfs(node_id)
    }
  }

  this.condensation();
}

/* A fuction that traverse graph in dfs (for recursive method).
 *
 */
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

/* A fuction that traverse graph in dfs (for recursive method).
 * To make scc, it uses rev_adj_list.
 * 
 */
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

/* A fuction that condense redundant edges of scc.
 * 
 */
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
    var tmp2 = this.scc[i][0];
    $.each(tmp, function(key, value){
      if($.inArray(value, tmp2) === -1) {
        tmp2.push(value);
      }
    })
  }
}


graph.prototype.detect_trap = function(border_color){
  for(var i = 0; i < this.scc.length; i++){
    if(this.scc.length != 1 && !this.scc[i][0].length){
      console.log("trap elements");
      for(var j = 1; j < this.scc[i].length; j++){
        this.result.push(this.scc[i][j]);
      }
    }
  }
}

graph.prototype.detect_loop = function(border_color){
  for(var i = 0; i < this.scc.length; i++){
    if(this.scc[i][0].length>=2){
      console.log("loop elements");
      for(var j = 1; j < this.scc[i].length; j++){
        this.result.push(this.scc[i][j]);
      }
    }
  }
}

/* A fuction that detect unreachable elements 
 * Assume that someone push "down" button at current screen.
 * 
 */
graph.prototype.detect_unreachable = function(border_color){
  this.scc_visited = new Array(this.scc.length);
  //var index = document.body.spatialNavigationSearch("down");
  var index = this.adj_list[0].scc_id;
  console.log("unreachable elements")
  for(var i = 0; i < this.rev_scc[index].length; i++){
    this.unreachable_dfs(this.rev_scc[index][i], border_color);
  }
}

graph.prototype.unreachable_dfs = function(scc_id, border_color){
  this.scc_visited[scc_id] = 1;
  for(var j = 1; j < this.scc[scc_id].length; j++){
    this.result.push(this.scc[scc_id][j]);
  }
  for(var i = 0; i < this.rev_scc[scc_id].length; i++){
    if(!this.scc_visited[scc_id]){
      this.unreachable_dfs(this.rev_scc[scc_id][i], border_color)
    }
  }
}

graph.prototype.isolation_visualizer = function(border_color){
  for(var i = 0; i < this.scc.length; i++){
    if(!this.scc[i][0].length && !this.rev_scc[i].length){
      console.log("isolated elements")
      for(var j = 1; j < this.scc[i].length; j++){
        this.result.push(this.scc[i][j]);
      }
    }
  }
}





// trap_detector();
// unreachable_detector();
// loop_detector();
// isolation_detector();
// focus_error_detector();
// iframe_detector();
// focus_error_detector();
// non_focusable_button();

var hello = "Hello from graph.js";
hello;

[1,2,3,4,5];
["1","2","3"];

var res = document.body.focusableAreas({'mode': 'all'});
var res_arr = Array();
for(i=0; i<res.length; i++){
	res_arr[i] = res[i].outerHTML;
}
res_arr;

/*
var dict = [];
dict["name"]="HYUNSUN";
dict;
["H","Y","U"];

var res = unreachable_detector().adj_list[0]
alert("res lenght"+ res.length");
res;
["H","Y","U"];
*/
//var hello_to_dev_tool_panel = "hello from graph.js!";
//hello_to_dev_tool_panel;
// var focusable = document.body.focusableAreas({'mode': 'all'});
// focusable[0].id;
// ["1","2","3"];
