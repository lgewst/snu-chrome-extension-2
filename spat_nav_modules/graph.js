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
  console.log(directed_graph);
  for (var i = 0; i < directed_graph.length; i++){
    reversed_graph_list.push([directed_graph[i][0]]);
  }

  for(var i = 0; i < directed_graph.length; i++){
    console.log(i);
    for(var j = 1; j < directed_graph[i].length; j++){
      console.log(directed_graph[i][j].node_id);
      console.log(reversed_graph_list[directed_graph[i][j].node_id]);
      console.log(directed_graph[i][0]);
      reversed_graph_list[directed_graph[i][j].node_id].push(directed_graph[i][0]);
    }
  }
  console.log(reversed_graph_list);
  return reversed_graph_list;
}

graph.prototype.make_rev_scc = function(scc){
// the return value (reversed_directed_graph_without_redundanc) is list of list.
// each list is composed with starting node and destination nodes.
// the first element is starting_node.
// ex> reverse_graph_list[10][0] = starting node
// ex> reverse_graph_list[10][1:] = all destination nodes list

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
    var tmp2 = this.scc[i][0];
    $.each(tmp, function(key, value){
      if($.inArray(value, tmp2) === -1) {
        tmp2.push(value);
      }
    })
  }
}

graph.prototype.trap_visualizer = function(border_color){
  for(var i = 0; i < this.scc.length; i++){
    if(this.scc.length != 1 && !this.scc[i][0].length){
      console.log("trap elements");
      for(var j = 1; j < this.scc[i].length; j++){
        // this.scc[i][j].style.backgroundColor = "#FDFF47"
	      // this.scc[i][j].style.color = "#47e0ff"
	      // this.scc[i][j].style.borderColor = border_color
	      // this.scc[i][j].style.borderStyle = "dashed"
        // this.scc[i][j].style.borderWidth = "2"
        this.result.push(this.scc[i][j]);
      }
    }
  }
}

graph.prototype.loop_visualizer = function(border_color){
  for(var i = 0; i < this.scc.length; i++){
    if(this.scc[i][0].length>=2){
      console.log("loop elements");
      for(var j = 1; j < this.scc[i].length; j++){
        // this.scc[i][j].style.backgroundColor = "#FDFF47"
	      // this.scc[i][j].style.color = "#47e0ff"
	      // this.scc[i][j].style.borderColor = border_color
	      // this.scc[i][j].style.borderStyle = "dashed"
	      // this.scc[i][j].style.borderWidth = "2"
        // console.log(this.scc[i][j]);
        this.result.push(this.scc[i][j]);
      }
    }
  }
}

graph.prototype.unreachable_visualizer = function(border_color){
  this.scc_visited = new Array(this.scc.length);
  // var index = document.body.spatNavSearch("down");
  var index = this.adj_list[0].scc_id;
  console.log(this.scc);
  console.log(this.rev_scc);
  console.log("unreachable elements")
  for(var i = 0; i < this.rev_scc[index].length; i++){
    this.unreachable_dfs(this.rev_scc[index][i], border_color);
  }
}

graph.prototype.unreachable_dfs = function(scc_id, border_color){
  this.scc_visited[scc_id] = 1;
  for(var j = 1; j < this.scc[scc_id].length; j++){
    // this.scc[scc_id][j].style.backgroundColor = "#FDFF47"
    // this.scc[scc_id][j].style.color = "#47e0ff"
    // this.scc[scc_id][j].style.borderColor = border_color
    // this.scc[scc_id][j].style.borderStyle = "dashed"
    // this.scc[scc_id][j].style.borderWidth = "2"
    this.result.push(this.scc[scc_id][j]);
    // console.log(this.scc[scc_id][j]);
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
	      // this.scc[i][j].style.backgroundColor = "#FDFF47"
	      // this.scc[i][j].style.color = "#47e0ff"
	      // this.scc[i][j].style.borderColor = border_color
	      // this.scc[i][j].style.borderStyle = "dashed"
        // this.scc[i][j].style.borderWidth = "2"
        // console.log(this.scc[i][j]);
        this.result.push(this.scc[i][j]);
      }
    }
  }
}


function trap_detector(){
  // if(scc.length == 1) return;
  var graph_trap = new graph();
  var timestamp = new Date().getTime();
  graph_trap.adj_array = graph_trap.make_adj_array(0);
  var timestamp2 = new Date().getTime();
  console.log(timestamp2 - timestamp);
  graph_trap.adj_list = graph_trap.make_adj_list(graph_trap.adj_array);
  var timestamp3 = new Date().getTime();
  console.log(timestamp3 - timestamp2);
  graph_trap.rev_adj_list = graph_trap.make_rev_adj_list(graph_trap.adj_list);
  var timestamp4 = new Date().getTime();
  console.log(timestamp4 - timestamp3);
  graph_trap.make_scc();
  var timestamp5 = new Date().getTime();
  console.log(timestamp5 - timestamp4);
  graph_trap.trap_visualizer("yellow")
  var timestamp6 = new Date().getTime();
  console.log(timestamp6 - timestamp5);
  return graph_trap.scc
}

function loop_detector(){
  var graph_loop_up = new graph();
  graph_loop_up.adj_array = graph_loop_up.make_adj_array(1);
  graph_loop_up.adj_list = graph_loop_up.make_adj_list(graph_loop_up.adj_array);
  graph_loop_up.rev_adj_list = graph_loop_up.make_rev_adj_list(graph_loop_up.adj_list);
  graph_loop_up.make_scc();
  graph_loop_up.loop_visualizer("red")

  var graph_loop_down = new graph();
  graph_loop_down.adj_array = graph_loop_down.make_adj_array(2);
  graph_loop_down.adj_list = graph_loop_down.make_adj_list(graph_loop_down.adj_array);
  graph_loop_down.rev_adj_list = graph_loop_down.make_rev_adj_list(graph_loop_down.adj_list);
  graph_loop_down.make_scc();
  graph_loop_down.loop_visualizer("yellow")

  var graph_loop_left = new graph();
  graph_loop_left.adj_array = graph_loop_left.make_adj_array(3);
  graph_loop_left.adj_list = graph_loop_left.make_adj_list(graph_loop_left.adj_array);
  graph_loop_left.rev_adj_list = graph_loop_left.make_rev_adj_list(graph_loop_left.adj_list);
  graph_loop_left.make_scc();
  graph_loop_left.loop_visualizer("blue")

  
  var graph_loop_right = new graph();
  graph_loop_right.adj_array = graph_loop_right.make_adj_array(4);
  graph_loop_right.adj_list = graph_loop_right.make_adj_list(graph_loop_right.adj_array);
  graph_loop_right.rev_adj_list = graph_loop_right.make_rev_adj_list(graph_loop_right.adj_list);
  graph_loop_right.make_scc();
  graph_loop_right.loop_visualizer("green");
}

function unreachable_detector(){
  var graph_unreachable = new graph();
  graph_unreachable.adj_array = graph_unreachable.make_adj_array(0);
  graph_unreachable.adj_list = graph_unreachable.make_adj_list(graph_unreachable.adj_array);
  graph_unreachable.rev_adj_list = graph_unreachable.make_rev_adj_list(graph_unreachable.adj_list);
  graph_unreachable.make_scc();
  graph_unreachable.make_rev_scc(graph_unreachable.scc);
  graph_unreachable.unreachable_visualizer("purple");
  return graph_unreachable;
}

function isolation_detector(){
  var graph_isolation = new graph();
  graph_isolation.adj_array = graph_isolation.make_adj_array(0);
  graph_isolation.adj_list = graph_isolation.make_adj_list(graph_isolation.adj_array);
  graph_isolation.rev_adj_list = graph_isolation.make_rev_adj_list(graph_isolation.adj_list);
  graph_isolation.make_scc();
  graph_isolation.make_rev_scc(graph_isolation.scc);
  graph_isolation.isolation_visualizer("purple");
}

function focus_error_detector(){
  var focusable = document.body.focusableAreas({'mode': 'all'});
  var result = [];
  setTimeout(function(){
    for(var i = 0; i < focusable.length; i++){
      var outline_color = getComputedStyle(focusable[i]).outlineColor;
      var border_color = getComputedStyle(focusable[i]).borderColor;
      var background_color = getComputedStyle(focusable[i]).backgroundColor;

      focusable[i].focus();
      var focused_outline_color = getComputedStyle(focusable[i]).outlineColor;
      var focused_outline_width = getComputedStyle(focusable[i]).outlineWidth;
      if(outline_color == focused_outline_color){
        result.push(focusable[i]);
      }
      else if(border_color == focused_outline_color){
        result.push(focusable[i]);
        break;
      }
      else if(background_color == focused_outline_color){
        result.push(focusable[i]);
        break;
      }
      else if(focused_outline_width.substring(0, focused_outline_width.length-2) < 1){
        result.push(focusable[i]);
        break;
      }
    }
    console.log(result);
  }, 3000); 
  return result;
  // let clearFocusRing = document.getElementsByClassName('small-box3');
  // clearFocusRing[0].focus();
  // console.log(getComputedStyle(clearFocusRing[0]).getPropertyValue(`outline`).trim());
}

function outline_detector(outline, focused_outline){
  var property_outline = property_extractor(outline);
  var property_focused_outline = property_extractor(focused_outline);
  if(property_outline[0] == property_focused_outline[0]){
    return true;
  }
  else if(property_focused_outline[1] == "none"){
    return true;
  }
  else if(property_focused_outline[1].getComputedStyle("background") == "none"){
    return true;
  }
  else if(parseInt(property_focused_outline[2]) < 1){
    return true;
  }
}

function non_focusable_button(){
  var element = document.body.getElementsByTagName("*");
  var result = [];
  for (var i = 0; i < element.length; i++){
    if(element[i].hasAttribute('onClick')){
      if(!element[i].hasAttribute('tabIndex') || element.getAttribute('tablIndex') < 0){
        result.push(element[i]);
      }
    }
  }
  console.log(result);
  return result;
}

function fixed_or_sticky(){
  var element = document.body.getElementsByTagName("*");
  var result = [];
  for (var i = 0; i < element.length; i++){
    if(getComputedStyle(element[i]).position == "sticky" || getComputedStyle(element[i]).position == "fixed"){
      result.push(element[i]);
    }
  }
  console.log(result);
  return result;
}

// trap_detector();
// unreachable_detector();
// loop_detector();
// isolation_detector();
focus_error_detector();
// non_focusable_button();

//var hello_to_dev_tool_panel = "hello from graph.js!";
//hello_to_dev_tool_panel;
// var focusable = document.body.focusableAreas({'mode': 'all'});
// focusable[0].id;
// ["1","2","3"];
