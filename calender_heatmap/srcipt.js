var width = 1000,
  height = 150,
  cellSize = 17; // cell size

var percent = d3.format(".1%"),
  format = d3.timeFormat("%Y-%m-%d");

var color = d3
  .scaleQuantize()
  .domain([0, 1])
  .range(["q0-7", "q1-7", "q2-7", "q3-7", "q4-7", "q5-7", "q6-7"]);

var svg1 = d3
  .select(".calender_heatmap")
  .selectAll("svg")
  .data(d3.range(2022, 2023))
  .enter()
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "RdYlGn")
  .append("g")
  .attr(
    "transform",
    "translate(" +
      (width - cellSize * 53) / 2 +
      "," +
      (height - cellSize * 7 - 1) +
      ")"
  )
  .attr("viewBox", `${-width / 2} ${height / 5} ${width} ${height}`);

var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
var monthLabels = svg1.append("g").attr("class", "month-labels");
monthLabels
  .selectAll(".month-label")
  .data(months)
  .enter()
  .append("text")
  .text(function (d) {
    return d;
  })
  .attr("x", function (d, i) {
    return i * cellSize * 4.5 + (cellSize * 4) / 2;
  })
  .attr("y", -7)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("class", "month-label")
  .style("font-size", "20px");

var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var dayLabels = svg1.append("g").attr("class", "day-labels");

dayLabels
  .selectAll(".day-label")
  .data(daysOfWeek)
  .enter()
  .append("text")
  .text(function (d) {
    return d;
  })
  .attr("x", -7)
  .attr("y", function (d, i) {
    return i * cellSize + cellSize / 2 + 4;
  })
  .attr("text-anchor", "end")
  .attr("alignment-baseline", "middle")
  .attr("class", "day-label")
  .style("font-size", "15px");

var rect = svg1
  .selectAll(".day")
  .data(function (d) {
    return d3.timeDays(new Date(d, 0, 1), new Date(d, 12, 1));
  })
  .enter()
  .append("rect")
  .attr("class", "day")
  .attr("width", cellSize)
  .attr("height", cellSize)
  .attr("x", function (d) {
    return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
  })
  .attr("y", function (d) {
    return d.getDay() * cellSize;
  })
  .datum(format);

rect.append("title").text(function (d) {
  return d;
});

svg1
  .selectAll(".month")
  .data(function (d) {
    return d3.timeMonths(new Date(d, 0, 1), new Date(d, 12, 1));
  })
  .enter()
  .append("path")
  .attr("class", "month")
  .attr("d", monthPath);

var spanDuration = [];

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}
// console.log(timeConverter(1681383600));
d3.json("./calender_heatmap/cal_data.json", function (error, json) {
  // d3.csv("./yearly.csv",function(error,json){
  if (error) throw error;
  // console.log(json);
  json.result.forEach(function (d) {
    let time = timeConverter(d.startTimeSeconds);
    time = time.split(" ");
    // console.log(time);
    if (time[2] == 2022) {
      d.startTimeSeconds = time;
      d.time = d.startTimeSeconds[3];
      if (d.startTimeSeconds[1].length == 1) {
        d.startTimeSeconds[1] = "0" + d.startTimeSeconds[1];
      }
      if (d.startTimeSeconds[0].length == 1) {
        d.startTimeSeconds[0] = "0" + d.startTimeSeconds[0];
      }
      d.startTimeSeconds =
        d.startTimeSeconds[2] +
        "-" +
        d.startTimeSeconds[1] +
        "-" +
        d.startTimeSeconds[0];
      spanDuration.push(d);
    }
  });
  console.log(spanDuration);
  newSpanDuration = [];
  for (var i = spanDuration.length - 1; i > 0; i--) {
    if (
      spanDuration[i].startTimeSeconds == spanDuration[i - 1].startTimeSeconds
    ) {
      continue;
    }
    newSpanDuration.push(spanDuration[i]);
  }
  spanDuration = newSpanDuration;
  // console.log("spanDuration", spanDuration);
  /* div 1,2,3,4, 1+2, educational, global */
  const colorScale = d3
    .scaleOrdinal()
    .domain([
      "Div. 4",
      "Div. 3",
      "Div. 2",
      "Educational",
      "Global",
      "Div. 1 and Div. 2",
      "Div. 1 + Div. 2",
    ])
    .range([
      "#f9844a",
      "#f9c74f",
      "#f94144",
      "#3d348b",
      "#b08968",
      "#90be6d",
      "#4d908e",
    ]); // Replace with your own colors

  const legend = d3
    .select(".calender_heatmap")
    .append("svg")
    .attr("class", "legend")
    .attr("width", 110)
    .attr("height", 140)
    .selectAll("g")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

  legend
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text((d) => d);
  var data = d3
    .nest()
    .key(function (d) {
      return d.startTimeSeconds;
    })
    .rollup(function (d) {
      let value = 0;
      // console.log(d);
      d.forEach(function (obj) {
        if (obj.name.includes("Educational")) {
          value = 6 / 7;
        } else if (obj.name.includes("Global")) {
          value = 1 / 7;
        } else if (obj.name.includes("Div. 1 + Div. 2")) {
          value = 5 / 7;
        } else if (obj.name.includes("Div. 1")) {
          value = 4 / 7;
        } else if (obj.name.includes("Div. 3")) {
          value = 3 / 7;
        } else if (obj.name.includes("Div. 4")) {
          value = 2 / 7;
        } else {
          value = 0;
        }
      });
      return value;
    })
    .map(spanDuration);

  rect
    .filter(function (d) {
      return data.has(d);
    })
    .attr("class", function (d) {
      // console.log(d,data.get(d),"here");
      return "day " + color(data.get(d));
    })
    .on("mouseover", function (d) {
      d3.select(".calender_heatmap")
        .style("cursor", "pointer")
        // .style("stroke","#333")
        // .style("stroke-width","2px")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("left", "80px")
        .style("top", "200px")
        .style("z-index", "10")
        .style("opacity", 1)
        .style("background", "rgba(220, 220, 220, 1)")
        .style("padding", "10px")
        .style("color", "#262626")
        .style("border-radius", "5px")
        .style("border", "1px solid rgba(0, 0, 0, 0.24)")
        .style("box-shadow", "rgba(0, 0, 0, 0.24) 0px 3px 8px")
        .html(
          `
              <h2 style="font-size:25px">
                ${
                  spanDuration
                    .find((x) => x.startTimeSeconds === d)
                    .name.includes("(Div. 1)")
                    ? spanDuration.find((x) => x.startTimeSeconds === d).name +
                      " and (Div. 2)"
                    : spanDuration.find((x) => x.startTimeSeconds === d).name
                }
              </h2>
              <h3 style="font-size:15px">
                Type: ${spanDuration.find((x) => x.startTimeSeconds === d).type}
              </h3>
              <h3 style="font-size:15px">
                Time: ${spanDuration.find((x) => x.startTimeSeconds === d).time}
              </h3>
              <h3 style="font-size:15px">
                Date: ${
                  spanDuration.find((x) => x.startTimeSeconds === d)
                    .startTimeSeconds
                }
              </h3>
            `
        );
    })
    .on("mouseout", function () {
      d3.select(".calender_heatmap").style("cursor", "default");
      d3.select(".tooltip").remove();
    });
});

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
    d0 = t0.getDay(),
    w0 = d3.timeWeek.count(d3.timeYear(t0), t0);
  (d1 = t1.getDay()), (w1 = d3.timeWeek.count(d3.timeYear(t1), t1));
  return (
    "M" +
    (w0 + 1) * cellSize +
    "," +
    d0 * cellSize +
    "H" +
    w0 * cellSize +
    "V" +
    7 * cellSize +
    "H" +
    w1 * cellSize +
    "V" +
    (d1 + 1) * cellSize +
    "H" +
    (w1 + 1) * cellSize +
    "V" +
    0 +
    "H" +
    (w0 + 1) * cellSize +
    "Z"
  );
}
