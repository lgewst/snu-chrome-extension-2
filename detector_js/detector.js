/* This detector.js contains codes of detecting Spat-Nav Errors. */
function trap_detector() {
    var graph_trap = new graph();
    graph_trap.adj_array = graph_trap.make_adj_array("all");
    graph_trap.adj_list = graph_trap.make_adj_list(graph_trap.adj_array);
    graph_trap.rev_adj_list = graph_trap.make_rev_adj_list(graph_trap.adj_list);
    if (!graph_trap.valid) return -1;
    graph_trap.make_scc();
    return graph_trap.detect_trap();
}

function loop_detector() {
    var graph_loop_up = new graph();
    graph_loop_up.adj_array = graph_loop_up.make_adj_array("up");
    graph_loop_up.adj_list = graph_loop_up.make_adj_list(graph_loop_up.adj_array);
    graph_loop_up.rev_adj_list = graph_loop_up.make_rev_adj_list(graph_loop_up.adj_list);
    if (!graph_loop_up.valid) return -1
    graph_loop_up.make_scc();

    var graph_loop_down = new graph();
    graph_loop_down.adj_array = graph_loop_down.make_adj_array("down");
    graph_loop_down.adj_list = graph_loop_down.make_adj_list(graph_loop_down.adj_array);
    graph_loop_down.rev_adj_list = graph_loop_down.make_rev_adj_list(graph_loop_down.adj_list);
    if (!graph_loop_down.valid) return -1
    graph_loop_down.make_scc();

    var graph_loop_left = new graph();
    graph_loop_left.adj_array = graph_loop_left.make_adj_array("left");
    graph_loop_left.adj_list = graph_loop_left.make_adj_list(graph_loop_left.adj_array);
    graph_loop_left.rev_adj_list = graph_loop_left.make_rev_adj_list(graph_loop_left.adj_list);
    if (!graph_loop_left.valid) return -1
    graph_loop_left.make_scc();


    var graph_loop_right = new graph();
    graph_loop_right.adj_array = graph_loop_right.make_adj_array("right");
    graph_loop_right.adj_list = graph_loop_right.make_adj_list(graph_loop_right.adj_array);
    graph_loop_right.rev_adj_list = graph_loop_right.make_rev_adj_list(graph_loop_right.adj_list);
    if (!graph_loop_right.valid) return -1
    graph_loop_right.make_scc();

    return [graph_loop_up.detect_loop(), graph_loop_down.detect_loop(), graph_loop_left.detect_loop(), graph_loop_right.detect_loop()];
}

function unreachable_detector() {
    var graph_unreachable = new graph();
    graph_unreachable.adj_array = graph_unreachable.make_adj_array("all");
    graph_unreachable.adj_list = graph_unreachable.make_adj_list(graph_unreachable.adj_array);
    graph_unreachable.rev_adj_list = graph_unreachable.make_rev_adj_list(graph_unreachable.adj_list);
    if (!graph_unreachable.valid) return -1;
    graph_unreachable.make_scc();
    graph_unreachable.make_rev_scc(graph_unreachable.scc);
    return graph_unreachable.detect_unreachable();
}

function isolation_detector() {
    var graph_isolation = new graph();
    graph_isolation.adj_array = graph_isolation.make_adj_array("all");
    if (!graph_isolation.valid) return -1
    graph_isolation.adj_list = graph_isolation.make_adj_list(graph_isolation.adj_array);
    graph_isolation.rev_adj_list = graph_isolation.make_rev_adj_list(graph_isolation.adj_list);
    graph_isolation.make_scc();
    graph_isolation.make_rev_scc(graph_isolation.scc);
    return graph_isolation.detect_isolation();
}

/* focus_error_detector() detects ambiguous focus outline.
 * it compares original outline color, background color, border color with focused outline
 * and checks whether focused outline is too thin or not. 
 *
 */
function focus_error_detector() {
    var focusable = document.body.focusableAreas({
        'mode': 'all'
    });
    var result = [];
    setTimeout(function() {
        for (var i = 0; i < focusable.length; i++) {
            var outline_color = getComputedStyle(focusable[i]).outlineColor;
            var border_color = getComputedStyle(focusable[i]).borderColor;
            var background_color = getComputedStyle(focusable[i]).backgroundColor;

            focusable[i].focus();
            var focused_outline_color = getComputedStyle(focusable[i]).outlineColor;
            var focused_outline_width = getComputedStyle(focusable[i]).outlineWidth;
            var focused_outline_style = getComputedStyle(focusable[i]).outlineStyle;
            if (rgb_distance(outline_color, focused_outline_color) <= 96) {
                result.push(focusable[i]);
                // document.body.aaaa = "hello world";
            } else if (rgb_distance(border_color, focused_outline_color) <= 96) {
                result.push(focusable[i]);
            } else if (rgb_distance(background_color, focused_outline_color) <= 96) {
                result.push(focusable[i]);
            } else if (focused_outline_width.substring(0, focused_outline_width.length - 2) < 1) {
                result.push(focusable[i]);
            } else if (focused_outline_width.substring(0, focused_outline_width.length - 2) <= 2 & focused_outline_style == "dotted") {
                result.push(focusable[i]);
            }
        }
        var contents = "";

        for (i = 0; i < result.length; i++) {
            contents += "<xmp>\"" + result[i].outerHTML + "\"</xmp><br>";
        }

        document.body.foucus_error_result = contents;
    }, 2000);
    return result;
}

String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}

function rgb_distance(rgb1, rgb2) {
    var rgb1_string = rgb1.split('(');
    var rgb1_color = rgb1_string[1].replaceAll(" ", "").replace(")", "");
    rgb1_color = rgb1_color.split(',');

    var rgb2_string = rgb2.split('(');
    var rgb2_color = rgb2_string[1].replaceAll(" ", "").replace(")", "");
    rgb2_color = rgb2_color.split(',');

    var diff = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        diff[i] = Math.abs(Number(rgb1_color[i]) - Number(rgb2_color[i]));
    }

    return (diff[0] + diff[1] + diff[2]);
}

/* non_focusable_button() detects non_focusable_button with clickable event.
 * it checks it has attribue of "Onclick" and 'tabIndex'. 
 *
 */
function non_focusable_button_detector() {
    var element = document.body.getElementsByTagName("*");
    var result = [];
    for (var i = 0; i < element.length; i++) {
        if (element[i].hasAttribute('onClick')) {
            if (!element[i].hasAttribute('tabIndex') || element[i].getAttribute('tablIndex') < 0) {
                result.push(element[i]);
            }
        }
    }
    return result;
}

/* fixed_sticky_detector() detects fixed element and sticky element.
 * These elements may confuse the behavior of spat_nav as they change state of position among elements.
 *
 */
function fixed_sticky_detector() {
    var element = document.body.getElementsByTagName("*");
    var result = [];
    for (var i = 0; i < element.length; i++) {
        if (getComputedStyle(element[i]).position == "sticky" || getComputedStyle(element[i]).position == "fixed") {
            result.push(element[i]);
        }
    }
    return result;
}

/* iframe_detector() detects fixed element and sticky element.
 * As iframe has html in it, it may cause trap case.
 *
 */
function iframe_detector() {
    var result = document.body.getElementsByTagName("iframe");
    return result;
}