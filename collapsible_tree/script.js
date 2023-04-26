var treeData =
{
    "name": "CODEFORCES USER",
    "subname": "USER (BY RATING)",
    "fill": "#52796f",
    "children": [
        {
            "name": "NEWBIE",
            "subname": "Rating: (0 - 1200)",
            "fill": "#8d99ae",
            "children": [
                {
                    "name": "Implementation",
                    "fill": "#8d99ae"
                },
                {
                    "name": "Math",
                    "fill": "#8d99ae"
                },
                {
                    "name": "Greedy",
                    "fill": "#8d99ae"
                },
            ]
        },
        { "name": "PUPIL", "subname": "CODE N1", "fill": "#57cc99",
            "children": [
                {
                    "name": "Sortings",
                    "fill": "#57cc99"
                },
                {
                    "name": "Constructive Algorithms",
                    "fill": "#57cc99"
                }
            ] 
        },
        {
            "name": "SPECIALIST", "subname": "CODE N1", "fill": "#90f1ef",
            "children": [   
                {
                    "name": "Binary Search",
                    "fill": "#90f1ef"
                },
                {
                    "name": "Number Theory",
                    "fill": "#90f1ef"
                },
                {
                    "name": "two pointers",
                    "fill": "#90f1ef"
                }
            ]
        },
        {
            "name": "EXPERT", "subname": "CODE N1", "fill": "#4361ee",
            "children": [
                {
                    "name": "dynamic programming",
                    "fill": "#4361ee"
                },
                {
                    "name": "dfs and similar",
                    "fill": "#4361ee"
                },
                {
                    "name": "shortest paths",
                    "fill": "#4361ee"
                }
                
            ]
        },
        {
            "name": "CANDIDATE MASTER", "subname": "CODE N1", "fill": "#7209b7",
            "children": [
                {
                    "name": "trees",
                    "fill": "#7209b7"
                },
                {
                    "name": "graphs",
                    "fill": "#7209b7"
                },
                {
                    "name": "combinatorics",
                    "fill": "#7209b7"
                }
            ]
        },
        {
            "name": "MASTER", "subname": "CODE N1", "fill": "#ff9b54",
            "children": [
                {
                    "name": "dsu",
                    "fill": "#ff9b54"
                },
                {
                    "name": "strings",
                    "fill": "#ff9b54"
                },
                {
                    "name": "data structures",
                    "fill": "#ff9b54"
                }
            ]
        },
        {
            "name": "INTERNATIONAL MASTER", "subname": "CODE N1", "fill": "#ff7f51",
            "children": [
                {
                    "name": "bitmasks",
                    "fill": "#ff7f51"
                },
                {
                    "name": "hashing",
                    "fill": "#ff7f51"
                },
                {
                    "name": "probabilities",
                    "fill": "#ff7f51"
                }
            ]
        },
        {
            "name": "GRANDMASTER", "subname": "CODE N1", "fill": "#ad2831",
            "children": [
                {
                    "name": "divide and conquer",
                    "fill": "#ad2831"
                },
                {
                    "name": "games",
                    "fill": "#ad2831"
                }
            ]
        },
        {
            "name": "INTERNATIONAL GRANDMASTER", "subname": "CODE N1", "fill": "#800e13",
            "children": [
                {
                    "name": "matrices",
                    "fill": "#800e13"
                },
                {
                    "name": "meet-in-the-middle",
                    "fill": "#800e13"
                },
                {
                    "name": "graph matchings",
                    "fill": "#800e13"
                }
            ]
        },
        {
            "name": "LEGENDARY GRANDMASTER", "subname": "CODE N1", "fill": "#640d14",
            "children": [
                {
                    "name": "fft",
                    "fill": "#640d14"
                },
                {
                    "name": "flows",
                    "fill": "#640d14"
                },
                {
                    "name": "string suffix structures",
                    "fill": "#640d14"
                }
            ]
        },
    ]
};

// Set the dimensions and margins of the diagram
var margin = { top: 20, right: 90, bottom: 30, left: 10 },
    width = 1000 - margin.left - margin.right,
    height = 610 - margin.top - margin.bottom;

// append the svg object to the collapsible_tree of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".collapsible_tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function (d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
    if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

function update(source) {

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 360 });

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll('g.node')
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function (d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

    var rectHeight = 20, rectWidth = 225;

    nodeEnter.append('rect')
        .attr('class', 'node')
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("x", 0)
        .attr("y", (rectHeight / 2) * -1)
        .attr("rx", "5")
        .style("text-align", "center")
        .attr('cursor', 'pointer')
        .style("fill", function (d) {
            return d.data.fill;
        });

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function (d) {
            return 110;
        })
        .attr("text-anchor", function (d) {
            return "middle";
        })
        .text(function (d) { return d.data.name; })
        .style("text-align", "center")
        .attr('cursor', 'pointer');


    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function (d) {
            return d._children ? "#b0c4de" : "#fff";
        })
        .attr('cursor', 'pointer');


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link')
        .data(links, function (d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function (d) {
            var o = { x: source.x0, y: source.y0 }
            return diagonal(o, o)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function (d) { return diagonal(d, d.parent) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function (d) {
            var o = { x: source.x, y: source.y }
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

        path = `M ${s.y} ${s.x}
    C ${(s.y + d.y) / 2} ${s.x},
      ${(s.y + d.y) / 2} ${d.x},
      ${d.y} ${d.x}`

        return path
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}
