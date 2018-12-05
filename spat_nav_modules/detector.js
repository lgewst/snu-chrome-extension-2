
function trap_detector(){
  var graph_trap = new graph();
  graph_trap.adj_array = graph_trap.make_adj_array("all");
  graph_trap.adj_list = graph_trap.make_adj_list(graph_trap.adj_array);
  graph_trap.rev_adj_list = graph_trap.make_rev_adj_list(graph_trap.adj_list);
  if(!graph_trap.valid) return "detector cannot work in this page due to iframes"
  graph_trap.make_scc();
  return graph_trap.detect_trap();
}

function loop_detector(){
  var graph_loop_up = new graph();
  graph_loop_up.adj_array = graph_loop_up.make_adj_array("up");
  graph_loop_up.adj_list = graph_loop_up.make_adj_list(graph_loop_up.adj_array);
  graph_loop_up.rev_adj_list = graph_loop_up.make_rev_adj_list(graph_loop_up.adj_list);
  if(!graph_loop_up.valid) return "detector cannot work in this page due to iframes"
  graph_loop_up.make_scc();

  var graph_loop_down = new graph();
  graph_loop_down.adj_array = graph_loop_down.make_adj_array("down");
  graph_loop_down.adj_list = graph_loop_down.make_adj_list(graph_loop_down.adj_array);
  graph_loop_down.rev_adj_list = graph_loop_down.make_rev_adj_list(graph_loop_down.adj_list);
  if(!graph_loop_down.valid) return "detector cannot work in this page due to iframes"
  graph_loop_down.make_scc();

  var graph_loop_left = new graph();
  graph_loop_left.adj_array = graph_loop_left.make_adj_array("left");
  graph_loop_left.adj_list = graph_loop_left.make_adj_list(graph_loop_left.adj_array);
  graph_loop_left.rev_adj_list = graph_loop_left.make_rev_adj_list(graph_loop_left.adj_list);
  if(!graph_loop_left.valid) return "detector cannot work in this page due to iframes"
  graph_loop_left.make_scc();

  
  var graph_loop_right = new graph();
  graph_loop_right.adj_array = graph_loop_right.make_adj_array("right");
  graph_loop_right.adj_list = graph_loop_right.make_adj_list(graph_loop_right.adj_array);
  graph_loop_right.rev_adj_list = graph_loop_right.make_rev_adj_list(graph_loop_right.adj_list);
  if(!graph_loop_right.valid) return "detector cannot work in this page due to iframes"
  graph_loop_right.make_scc();

  return [graph_loop_up.detect_loop(), graph_loop_down.detect_loop(), graph_loop_left.detect_loop(), graph_loop_right.detect_loop()];
}

function unreachable_detector(){
  var graph_unreachable = new graph();
  graph_unreachable.adj_array = graph_unreachable.make_adj_array("all");
  graph_unreachable.adj_list = graph_unreachable.make_adj_list(graph_unreachable.adj_array);
  graph_unreachable.rev_adj_list = graph_unreachable.make_rev_adj_list(graph_unreachable.adj_list);
  if(!graph_unreachable.valid) return "detector cannot work in this page due to iframes"
  graph_unreachable.make_scc();
  graph_unreachable.make_rev_scc(graph_unreachable.scc);
  return graph_unreachable.detect_unreachable();
}

function isolation_detector(){
  var graph_isolation = new graph();
  graph_isolation.adj_array = graph_isolation.make_adj_array("all");
  if(!graph_isolation.valid) return "detector cannot work in this page due to iframes"
  graph_isolation.adj_list = graph_isolation.make_adj_list(graph_isolation.adj_array);
  graph_isolation.rev_adj_list = graph_isolation.make_rev_adj_list(graph_isolation.adj_list);
  graph_isolation.make_scc();
  graph_isolation.make_rev_scc(graph_isolation.scc);
  graph_isolation.detect_isolation();
  return graph_isolation.result;
}

/* focus_error_detector() detects ambiguous focus outline.
  * it compares original outline color, background color, border color with focused outline
  * and checks whether focused outline is too thin or not. 
  *
  */
function focus_error_detector(){
  var focusable = document.body.focusableAreas({'mode': 'all'});
  if(!graph_loop_up.valid) return "detector cannot work in this page due to iframes"

  console.log(focusable);
   

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
      }
      else if(background_color == focused_outline_color){
        result.push(focusable[i]);
      }
      else if(focused_outline_width.substring(0, focused_outline_width.length-2) < 1){
        result.push(focusable[i]);
      }
    }
    console.log(result);
  }, 3000); 
  return result;
}

/* non_focusable_button() detects non_focusable_button with clickable event.
  * it checks it has attribue of "Onclick" and 'tabIndex'. 
  *
  */
function non_focusable_button_detector(){
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

/* fixed_sticky_detector() detects fixed element and sticky element.
  * These elements may confuse the behavior of spat_nav as they change state of position among elements.
  *
  */
function fixed_sticky_detector(){ 
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

/* iframe_detector() detects fixed element and sticky element.
  * As iframe has html in it, it may cause trap case.
  *
  */
function iframe_detector(){
  var result = document.body.getElementsByTagName("iframe");
  console.log(result);
  return result;
}