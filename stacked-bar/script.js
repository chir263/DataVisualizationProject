const ranges = [
  [800, 1000],
  [1000, 1200],
  [1200, 1400],
  [1400, 1600],
  [1600, 1900],
  [1900, 2200],
  [2200, 2400],
  [2400, 2600],
  [2600, 3000],
  [3000, 3600],
];
// console.log([`${Math.random()}abcd]);

let color_big = [
  "#1f77b4", // blue
  "#ff7f0e", // orange
  "#2ca02c", // green
  "#d62728", // red
  "#9467bd", // purple
  "#8c564b", // brown
  "#e377c2", // pink
  "#bcbd22", // lime
  "#17becf", // teal
  "#393b79", // dark blue
  "#5254a3", // deep blue
  "#6b6ecf", // strong blue
  "#9c9ede", // light blue
  "#637939", // dark green
  "#8ca252", // green
  "#b5cf6b", // light green
  "#bd9e39", // dark orange
  "#e7ba52", // yellow
  "#ce6dbd", // magenta
  "#de9ed6", // light magenta
  "#bd3939", // dark red
  "#e7969c", // light pink
  "#7b4173", // dark purple
  "#ffbb78", // peach
  "#a6cee3", // light blue
  "#1f78b4", // blue
  "#b2df8a", // light green
  "#33a02c", // dark green
  "#fb9a99", // light red
  "#e31a1c", // red
  "#fdbf6f", // light orange
  "#ff7f00", // orange
  "#cab2d6", // light purple
  "#6a3d9a", // dark purple
  "#ffff99", // light yellow
  "#b15928", // dark brown
  "#fdae61", // orange-yellow
];

let color_small = [
  "#1f77b4", // blue
  "#ff7f0e", // orange
  "#2ca02c", // green
  "#d62728", // red
  "#9467bd", // purple
  "#8c564b", // brown
  "#e377c2", // pink
  "#bcbd22", // lime
  "#17becf", // teal
  "#393b79", // dark blue
  "#5254a3", // deep blue
  "#6b6ecf", // strong blue
  "#9c9ede", // light blue
  "#637939", // dark green
  "#8ca252", // green
];

// console.log(
//   tags_name_short.map((d) =>
//     d3.format("#x")(
//       d3.rgb(Math.random() * 185, Math.random() * 185, Math.random() * 185)
//     )
//   )
// );
function load(type) {
  function getRange(d) {
    if (type === "rating") {
      for (const x of ranges) {
        if (d.rating >= x[0] && d.rating < x[1]) {
          return `${x[0]} - ${x[1]}`;
        }
      }
    } else if (type === "index") {
      return d.index;
    }

    return "";
  }

  let map = {};
  for (let x of problemset_data) {
    if (!x.rating) continue;
    for (let y of x.tags) {
      if (map[y]) {
        if (map[y][getRange(x)]) {
          map[y][getRange(x)]++;
        } else {
          map[y][getRange(x)] = 1;
        }
      } else {
        map[y] = {};
        map[y][getRange(x)] = 1;
      }
    }
  }
  //   console.log(Object.keys(map).length, map);
  let data = [];
  let maxm = 0;
  let indexes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  let i = 0,
    j = 0;
  for (let key of Object.keys(map)) {
    let arr = [];
    for (let key2 of Object.keys(map[key])) {
      //   console.log(key2.split(" - ")[0]);
      i = 0;
      for (; i < ranges.length; i++)
        if (ranges[i][0] === Number(key2.split(" - ")[0])) break;
      j = 0;
      //   console.log(key, map[key]);
      for (; j < indexes.length; j++) if (key2 === indexes[j]) break;
      arr.push({
        date: type === "rating" ? 2000 + i : 2000 + j,
        price: map[key][key2],
        label:
          type === "rating" ? `${ranges[i][0]} - ${ranges[i][1]}` : indexes[j],
      });
      maxm = Math.max(Number(map[key][key2]), maxm);
    }
    // arr.sort();
    arr.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));
    data.push({
      name: key,
      values: arr,
    });
  }
  //   console.log(maxm);
  return { data, maxm };
}
function plotLine(type, len) {
  let color_multi_line = d3
    .scaleOrdinal()
    .range(len === 0 ? color_small : color_big);

  const ranks_colors = {
    "legendary grandmaster": "#ff0707",
    "international grandmaster": "#ff0707",
    grandmaster: "#ff0000",
    "international master": "#ff8b00",
    master: "#ffc783",
    "candidate master": "#d23abc",
    expert: "#7b37ff",
    specialist: "#00afa2",
    pupil: "#008e0f",
    newbie: "#828282",
    everyone: "#45c850",
  };
  d3.select("#chart_line").selectAll("*").remove();
  d3.select("#chart_line_labels1").selectAll("*").remove();
  d3.select("#chart_line_labels").selectAll("*").remove();
  let { data, maxm } = load(type);

  if (len === 0) {
    data = data.filter((x) => {
      sum = 0;
      for (y of x.values) {
        sum += +y.price;
      }
      console.log(x);
      return sum >= 500;
    });
  }

  console.log(data.map((d) => d.name));
  // data.sort(function compare(a, b) {
  //   if (a.name < b.name) {
  //     return -1;
  //   }
  //   if (a.name > b.name) {
  //     return 1;
  //   }
  //   return 0;
  // });
  console.log(window.innerHeight);
  var width = 0.57 * window.innerWidth;
  var height = 0.85 * window.innerHeight;

  var margin = 50;
  var duration = 100;

  var lineOpacity = "0.45";
  var lineOpacityHover = "0.95";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "2.5px";
  var lineStrokeHover = "3.5px";

  var circleOpacity = "0.85";
  var circleOpacityOnLineHover = "0.25";
  var circleRadius = 3;
  var circleRadiusHover = 6;

  var div_width = 300;
  var div_height = "320";

  var xScale = d3
    .scalePoint()
    .domain(data[0].values.map((d) => d.label))
    .range([0, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([0, maxm])
    .range([height - margin, 0]);

  var svg = d3
    .select("#chart_line")
    .append("svg")
    .attr("width", width + margin + "px")
    .attr("height", height + margin + "px")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(5);
  svg
    .append("text")
    .attr("x", (width - margin) / 2)
    .attr("y", 0 - margin / 2)
    .html(`tags >500 problems (${type})`)
    .style("font-size", "18px")
    .attr("text-anchor", "middle");
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Count");

  var line = d3
    .line()
    .x((d) => {
      return xScale(d.label);
    })
    .y((d) => yScale(d.price));

  let lines = svg.append("g").attr("class", "lines");

  const replaceStr = (str, rep, sub) => {
    return str.split(rep).join(sub);
  };

  let timeout_start_id, timeout_end_id;

  const line_mouse_over = (d) => {
    // console.log("mouse_over", d);
    var xxx = d;

    var tag_info = tags_data_info[d.name];

    let color_freq = {
      "less frequent": "#cbcb00",
      frequent: "#19c2ff",
      "very frequent": "#17c34d",
    };

    let cc = "";

    for (let c of tag_info.recommended) {
      cc += `<span style='background-color:${ranks_colors[c]}; color:white; padding:2px;
       border-radius:5px; display:inline-block; font-size:14px; margin:2px;'>${c}</span>`;
    }

    d3.selectAll(".line").style("opacity", otherLinesOpacityHover);
    d3.selectAll(".circle").style("opacity", circleOpacityOnLineHover);
    d3.select("#line_chart" + replaceStr(d.name, " ", "_"))
      .transition()
      .duration(duration)
      .style("opacity", lineOpacityHover)
      .style("stroke-width", lineStrokeHover)
      .style("cursor", "pointer");
    d3.select(".circle_line_chart" + replaceStr(d.name, " ", "_"))
      .selectAll(".circle")
      .style("opacity", circleOpacity)
      .append("text")
      .attr("class", "text")
      .text((d) => {
        // console.log(d);
        if (!d.price || !d.label) return "";
        return `${d.price}`;
      })
      .attr("x", (d) => {
        if (!xScale(d.label) && xScale(d.label) != 0) return -100;
        return xScale(d.label) + 5 || 0;
      })
      .attr("y", (d) => yScale(d.price) - 10 || 0);
    // console.log(xxx);
    d3.select("#f_line_chart_info").style("visibility", "visible");
    d3.select("#line_chart_info")
      .html(
        `<h2 style="color:${color_multi_line(
          xxx.name
        )}; margin-left:10px; margin-bottom:0">${xxx.name}
        <span style='background-color:${
          color_freq[tag_info.frequency]
        }; color:white; padding:5px; border-radius:5px; font-size:14px; display:inline-block'>${
          tag_info.frequency
        }</span>
        
        </h2>
        <p style="margin:10px;margin-top:5px; padding:5px; background-color: #e7e7e7; border-radius:5px; color:#616161">
          
        
        ${
          type == "rating"
            ? tag_info.conclusion_rating
            : tag_info.conclusion_problem
        }
        </p>

        <span style="margin:10px;margin-top:5px; padding:5px; background-color: #d4d4d4; border-radius:5px 5px 0 0; color:#616161">
        Recommended</span>
        <p style="margin:10px;margin-top:0px; padding:5px; background-color: #d4d4d4; border-radius:0px 5px 5px 5px">
          
        
        ${cc}
        
        </p>
        
        `
      )
      .transition()
      .duration(duration)
      .style("visibility", "visible")
      .style("font-size", "16px");

    clearTimeout(timeout_end_id);
    clearTimeout(timeout_start_id);
    timeout_start_id = window.setTimeout(function () {
      var elem = document.getElementById("line_chart_info");
      elem.scrollTop = elem.scrollHeight;
    }, 2000);
  };

  const line_mouse_out = (d) => {
    // console.log("mouse_out", d);
    d3.selectAll(".line").style("opacity", lineOpacity);
    d3.selectAll(".circle").style("opacity", circleOpacity);
    d3.select("#line_chart" + replaceStr(d.name, " ", "_"))
      .transition()
      .duration(duration)
      .style("stroke-width", lineStroke)
      .style("cursor", "none");
    d3.select(".circle_line_chart" + replaceStr(d.name, " ", "_"))
      .selectAll("text")
      .remove();

    d3.select("#f_line_chart_info").style("visibility", "hidden");

    d3.select("#line_chart_info")
      .transition()
      .duration(duration)
      .style("visibility", "hidden");

    clearTimeout(timeout_start_id);
    clearTimeout(timeout_end_id);
    timeout_end_id = window.setTimeout(function () {
      var elem = document.getElementById("line_chart_info");
      elem.scrollTop = 0;
    }, 2000);
  };

  var fo = svg
    .append("foreignObject")
    .attr("id", "f_line_chart_info")
    .attr("x", width - div_width - margin)
    .attr("y", -50)
    .attr("width", div_width)
    .attr("height", div_height)
    .style("padding", "0px")
    .style("visibility", "hidden")
    .style("border-radius", "5px")
    .style("box-shadow", `rgba(0, 0, 0, 0.24) 0px 3px 8px`)
    .style("z-index", "1000");

  var div = fo
    .append("xhtml:div")
    .attr("class", "my-div")
    .attr("id", "line_chart_info")
    .style("margin", "0")
    .style("width", "100%")
    .style("height", "100%")
    .style("background-color", "rgba(238,238,238,0.5)")
    .style("border-radius", "5px")
    .style("z-index", "1000")
    .style("overflow", "scroll")
    .style("overflow-x", "hidden")
    .style("box-shadow", `rgba(0, 0, 0, 0.24) 0px 3px 8px`)
    .text("This is my div!")
    .style("visibility", "hidden");

  lines
    .selectAll(".line-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "line-group")
    .on("mouseover", function (d, i) {
      // svg
      //   .append("text")
      //   .attr("class", "title-text")
      //   .style("fill", color_multi_line(i))
      //   .text(d.name)
      //   .attr("text-anchor", "middle")
      //   .attr("x", (width - margin) / 2)
      //   .attr("y", 5)
      //   .style("font-size", "20px");
    })
    .on("mouseout", function (d) {
      // svg.select(".title-text").remove();
    })
    .append("path")
    .attr("class", "line")
    .attr("id", (d) => {
      return "line_chart" + replaceStr(d.name, " ", "_");
    })
    .attr("d", (d) => {
      return line(d.values);
    })
    .style("stroke", (d, i) => color_multi_line(d.name))
    .style("opacity", lineOpacity)
    .on("mouseover", line_mouse_over)
    .on("mouseout", line_mouse_out);

  lines
    .selectAll("circle-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", (d) => {
      return "circle_line_chart" + replaceStr(d.name, " ", "_");
    })
    .style("fill", (d, i) => color_multi_line(d.name))
    .selectAll("circle")
    .data((d) => d.values)
    .enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function (d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`${d.price}`)
        .attr("x", (d) => xScale(d.label) + 5)
        .attr("y", (d) => yScale(d.price) - 10);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text")
        .remove();
    })
    .append("circle")
    .attr("cx", (d) => xScale(d.label))
    .attr("cy", (d) => yScale(d.price))
    .attr("r", circleRadius)
    .style("opacity", circleOpacity)
    .on("mouseover", function (d) {
      d3.select(this)
        .transition()
        .duration(duration)
        .attr("r", circleRadiusHover);
    })
    .on("mouseout", function (d) {
      d3.select(this).transition().duration(duration).attr("r", circleRadius);
    });

  function side_labels_mouseover(data_name, name_arr) {
    line_mouse_over(data_name);
    // svg
    //   .append("text")
    //   .attr("class", "title-text")
    //   .style("fill", color_multi_line(name_arr))
    //   .text(name_arr)
    //   .attr("text-anchor", "middle")
    //   .attr("x", (width - margin) / 2)
    //   .attr("y", 5)
    //   .style("font-size", "20px");
    d3.select("#chart_line_labels").selectAll("text").style("opacity", "0.25");
    d3.select("#chart_line_labels1").selectAll("text").style("opacity", "0.25");
    d3.select("#chart_line_labels").selectAll("rect").style("opacity", "0.25");
    d3.select("#chart_line_labels1").selectAll("rect").style("opacity", "0.25");
    d3.select("#line_label_" + replaceStr(name_arr, " ", "_"))
      .style("fill", d3.color(color_multi_line(name_arr)).darker())
      .style("opacity", "1")
      .attr("font-weight", "bold");
    d3.select("#line_rect_" + replaceStr(name_arr, " ", "_"))
      .style("fill", d3.color(color_multi_line(name_arr)).darker())
      .style("opacity", "1");
  }

  function side_labels_mouseout(data_name, name_arr) {
    line_mouse_out(data_name);
    // svg.select(".title-text").remove();

    d3.select("#line_label_" + replaceStr(name_arr, " ", "_")).style(
      "fill",
      color_multi_line(name_arr)
    );
    d3.select("#chart_line_labels").selectAll("text").style("opacity", "1");
    d3.select("#chart_line_labels1").selectAll("text").style("opacity", "1");
    d3.select("#chart_line_labels").selectAll("rect").style("opacity", "1");
    d3.select("#chart_line_labels1").selectAll("rect").style("opacity", "1");
    d3.select("#line_label_" + replaceStr(name_arr, " ", "_"))
      .style("fill", d3.color(color_multi_line(name_arr)))
      .style("opacity", "1")
      .attr("font-weight", "normal");
    d3.select("#line_rect_" + replaceStr(name_arr, " ", "_"))
      .style("fill", d3.color(color_multi_line(name_arr)))
      .style("opacity", "1");
  }

  let i = 0,
    y_pos = 15;
  for (; i < data.length / 2; i++) {
    let name_arr = data[i].name;
    let data_name = data[i];
    d3.select("#chart_line_labels")
      .append("text")
      .attr("x", "25px")
      .attr("y", y_pos)
      .attr("id", "line_label_" + replaceStr(name_arr, " ", "_"))
      .text(name_arr)
      .style("fill", color_multi_line(name_arr))
      .style("font-size", "16px")
      .style("cursor", "pointer")
      .on("mouseover", function (d) {
        side_labels_mouseover(data_name, name_arr);
      })
      .on("mouseout", function (d) {
        side_labels_mouseout(data_name, name_arr);
      });

    d3.select("#chart_line_labels")
      .append("rect")
      .attr("x", "0px")
      .attr("y", y_pos - 15)
      .attr("id", "line_rect_" + replaceStr(name_arr, " ", "_"))
      .attr("width", "20px")
      .attr("height", "20px")
      .style("fill", color_multi_line(name_arr));
    y_pos += 25;
  }
  y_pos = 15;
  // console.log(
  //   data
  //     .map((x) => {
  //       sum = 0;
  //       for (var n of x.values) sum += Number(n.price) || 0;
  //       return { name: x.name, value: sum };
  //     })
  //     .sort((a, b) => -a.value + b.value)
  // );
  for (; i < data.length; i++) {
    let name_arr = data[i].name;
    let data_name = data[i];
    d3.select("#chart_line_labels1")
      .append("text")
      .attr("x", "25px")
      .attr("y", y_pos)
      .attr("id", "line_label_" + replaceStr(name_arr, " ", "_"))
      .text(name_arr)
      .style("fill", color_multi_line(name_arr))
      .style("font-size", "16px")
      .style("cursor", "pointer")
      .on("mouseover", function (d) {
        side_labels_mouseover(data_name, name_arr);
      })
      .on("mouseout", function (d) {
        side_labels_mouseout(data_name, name_arr);
      });

    d3.select("#chart_line_labels1")
      .append("rect")
      .attr("x", "0px")
      .attr("y", y_pos - 15)
      .attr("id", "line_rect_" + replaceStr(name_arr, " ", "_"))
      .attr("width", "20px")
      .attr("height", "20px")
      .style("fill", color_multi_line(name_arr));
    y_pos += 25;
  }

  let current_index = 0;
  let bool_start = false;
  const delays = data.map(() => 3000);
  let timeout_sim_id;

  function resetTimer() {
    bool_start = false;
    document.getElementById("multi_line_chart_start").innerHTML =
      '        <img src="./stacked-bar/img/icons8-play-button-circled-64.png" />';
    document.getElementById("multi_line_chart_start").title = "Start";
    side_labels_mouseout(data[current_index], data[current_index].name);
    if (current_index)
      side_labels_mouseout(
        data[current_index - 1],
        data[current_index - 1].name
      );
    clearTimeout(timeout_sim_id);
    current_index = 0;
    document.getElementById("framework").hidden = false;
  }

  document
    .getElementById("multi_line_chart_start")
    .addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("framework").hidden = true;
      if (!bool_start) {
        // icons8-pause-button-48
        document.getElementById("multi_line_chart_start").innerHTML =
          '<img src="./stacked-bar/img/icons8-pause-button-48.png" />';
        document.getElementById("multi_line_chart_start").title = "Pause";
        bool_start = true;
        function countWithDelays() {
          if (current_index < data.length) {
            // console.log(current_index);
            if (current_index != 0) {
              // console.log("stop", current_index - 1);
              // console.log("start", current_index);
              side_labels_mouseout(
                data[current_index - 1],
                data[current_index - 1].name
              );
              side_labels_mouseover(
                data[current_index],
                data[current_index].name
              );
            } else {
              // console.log("start", current_index);
              side_labels_mouseover(
                data[current_index],
                data[current_index].name
              );
            }

            timeout_sim_id = setTimeout(countWithDelays, delays[current_index]);
            current_index++;
          } else {
            bool_start = false;
            document.getElementById("multi_line_chart_start").innerHTML =
              '<img src="./stacked-bar/img/icons8-play-button-circled-64.png" />';
            document.getElementById("multi_line_chart_start").title = "Start";
            side_labels_mouseout(
              data[current_index - 1],
              data[current_index - 1].name
            );
            clearTimeout(timeout_sim_id);
            current_index = 0;
            document.getElementById("framework").hidden = false;
          }
        }

        countWithDelays();
      } else {
        bool_start = false;
        document.getElementById("multi_line_chart_start").innerHTML =
          '<img src="./stacked-bar/img/icons8-continue-32.png" />';
        document.getElementById("multi_line_chart_start").title = "Continue";

        // icons8-continue-32
        clearTimeout(timeout_sim_id);
      }
    });

  document
    .getElementById("multi_line_chart_reset")
    .addEventListener("click", function (event) {
      event.preventDefault();
      resetTimer();
    });

  document
    .getElementById("multi_line_chart_next")
    .addEventListener("click", function (event) {
      event.preventDefault();
      // resetTimer();
      side_labels_mouseout(data[current_index], data[current_index].name);
      current_index = (data.length + current_index + 1) % data.length;
      side_labels_mouseover(data[current_index], data[current_index].name);
    });

  document
    .getElementById("multi_line_chart_back")
    .addEventListener("click", function (event) {
      event.preventDefault();
      // resetTimer();
      side_labels_mouseout(data[current_index], data[current_index].name);
      current_index = (data.length + current_index - 1) % data.length;
      side_labels_mouseover(data[current_index], data[current_index].name);
    });
}
