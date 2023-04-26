let race_ticker;

let race_paused = false;

let isStarted = false;

function plotRace() {
  // Feel free to change or delete any of the code you see in this editor!
  var height = 450;
  var width = window.innerWidth - 50;
  var svg = d3
    .select("#race_chart")
    .attr("width", width)
    .attr("height", height);

  var tickDuration = 300;

  var top_n = 7;

  const margin = {
    top: 80,
    right: 0,
    bottom: 5,
    left: 0,
  };

  let barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);

  let title = svg
    .append("text")
    .attr("class", "title")
    .attr("y", 24)
    .html("Number of users in India over the time");

  let subTitle = svg
    .append("text")
    .attr("class", "subTitle")
    .attr("y", 55)
    .html("User count");

  let caption = svg
    .append("text")
    .attr("class", "caption")
    .attr("x", width)
    .attr("y", height - 5)
    .style("text-anchor", "end")
    .html("Source: CF API");

  let year = 2010;

  var Tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "chirag")
    .style("position", "absolute")
    .style("z-index", "-1")
    .style("opacity", "0")
    .style("background", "rgba(240,240,240,0.9)")
    .style("padding", "10px")
    // .style("border", `2px solid black`)
    // .style("border-radius", `5px`)
    .style("color", `#262626`)
    .style("border-radius", `5px`)
    .style("box-shadow", `rgba(0, 0, 0, 0.24) 0px 3px 8px`)
    .text("a simple tooltip");

  d3.csv("data.csv").then(function (data) {
    //if (error) throw error;

    console.log(data);

    data.forEach((d) => {
      (d.value = +d.value),
        (d.lastValue = +d.lastValue),
        (d.value = isNaN(d.value) ? 0 : d.value),
        (d.year = +d.year),
        (d.colour = "#828282");
      if (d.name === "India") {
        d.colour = "#00aaff";
      }
    });

    // console.log(data);

    let yearSlice = data
      .filter((d) => d.year == year && !isNaN(d.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, top_n);

    yearSlice.forEach((d, i) => (d.rank = i));

    console.log("yearSlice: ", yearSlice);

    let x = d3
      .scaleLinear()
      .domain([0, d3.max(yearSlice, (d) => d.value)])
      .range([margin.left, width - margin.right - 65]);

    let y = d3
      .scaleLinear()
      .domain([top_n, 0])
      .range([height - margin.bottom, margin.top]);

    let xAxis = d3
      .axisTop()
      .scale(x)
      .ticks(width > 500 ? 5 : 2)
      .tickSize(-(height - margin.top - margin.bottom))
      .tickFormat((d) => d3.format(",")(d));

    svg
      .append("g")
      .attr("class", "axis xAxis")
      .attr("transform", `translate(0, ${margin.top})`)
      .call(xAxis)
      .selectAll(".tick line")
      .classed("origin", (d) => d == 0);

    svg
      .selectAll("rect.bar")
      .data(yearSlice, (d) => d.name)
      .enter()
      .append("rect")
      .on("mouseover", function (d) {
        // alert("df");
        Tooltip.style("z-index", "1000")
          .transition()
          .ease(d3.easeLinear)
          .duration(100)
          .style("opacity", 1);
        let color = d.name === "India" ? "#00aaff" : "#828282";
        d3.select(this).style("fill", d3.color(color).darker());
      })
      .on("mousemove", function (d) {
        // let hr = Math.floor(data[i].duration / 60);
        // let min = data[i].duration % 60;
        let name = d.name;
        Tooltip.style("left", d3.mouse(this)[0] + "px")
          .style("color", "#4d4d4d")
          .style(
            "top",
            document.documentElement.scrollHeight -
              window.innerHeight +
              d3.mouse(this)[1] +
              -50 +
              "px"
          )
          .html((d) => {
            let color = name === "India" ? "#00aaff" : "#828282";
            return `<h3 style="margin-top:0px;margin-bottom:0px; color:${d3
              .color(color)
              .darker()}"><b>${name}</b></h3>`;
          });
      })
      .on("mouseleave", function (d) {
        let color = d.name === "India" ? "#00aaff" : "#828282";
        d3.select(this).style("fill", d3.color(color));
        Tooltip.style("z-index", "-1").style("opacity", 0);
      })
      .attr("class", "bar")
      .attr("x", x(0) + 1)
      .attr("width", (d) => Math.max(x(d.value) - x(0) - 1, 0))
      .attr("y", (d) => y(d.rank) + 5)
      .attr("height", y(1) - y(0) - barPadding)
      .style("fill", (d) => d.colour);

    svg
      .selectAll("text.label")
      .data(yearSlice, (d) => d.name)
      .enter()
      .append("text")
      .attr("class", "label")
      .style("cursor", "default")
      .attr("x", (d) => x(d.value) - 8)
      .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1)
      .style("text-anchor", "end")
      .style("fill", "white")
      .html((d) => d.name);

    svg
      .selectAll("text.valueLabel")
      .data(yearSlice, (d) => d.name)
      .enter()
      .append("text")
      .attr("class", "valueLabel")
      .style("fill", (d) => d.colour)
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1)
      .text((d) => d3.format(",.0f")(d.lastValue));

    let yearText = svg
      .append("text")
      .attr("class", "yearText")
      .attr("x", width - margin.right)
      .attr("y", height - 25)
      .style("text-anchor", "end")
      .html(~~year)
      .call(halo, 10);

    var call_back = (e) => {
      yearSlice = data
        .filter((d) => d.year == year && !isNaN(d.value))
        .sort((a, b) => b.value - a.value)
        .slice(0, top_n);

      yearSlice.forEach((d, i) => (d.rank = i));

      //console.log('IntervalYear: ', yearSlice);

      x.domain([0, d3.max(yearSlice, (d) => d.value)]);

      svg
        .select(".xAxis")
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .call(xAxis);

      let bars = svg.selectAll(".bar").data(yearSlice, (d) => d.name);

      bars
        .enter()
        .append("rect")
        .attr("class", (d) => `bar ${d.name.replace(/\s/g, "_")}`)
        .attr("x", x(0) + 1)
        .attr("width", (d) => Math.max(x(d.value) - x(0) - 1, 0))
        .attr("y", (d) => y(top_n + 1) + 5)
        .attr("height", y(1) - y(0) - barPadding)
        .style("fill", (d) => d.colour)
        .on("mouseover", function (d) {
          // alert("df");
          Tooltip.style("z-index", "1000")
            .transition()
            .ease(d3.easeLinear)
            .duration(100)
            .style("opacity", 1);
          let color = d.name === "India" ? "#00aaff" : "#828282";
          d3.select(this).style("fill", d3.color(color).darker());
        })
        .on("mousemove", function (d) {
          // let hr = Math.floor(data[i].duration / 60);
          // let min = data[i].duration % 60;
          let name = d.name;
          //   console.log(
          //     document.documentElement.scrollHeight,
          //     window.innerHeight,
          //       d3.mouse(this)[1],
          //     document.documentElement.scrollHeight -
          //         window.innerHeight +
          //         d3.mouse(this)[1] +
          //         -50
          //   );
          Tooltip.style("left", d3.mouse(this)[0] + 0 + "px")
            .style("color", "#4d4d4d")
            .style(
              "top",
              document.documentElement.scrollHeight -
                window.innerHeight +
                d3.mouse(this)[1] +
                -50 +
                "px"
            )
            .html((d) => {
              let color = name === "India" ? "#00aaff" : "#828282";
              return `<h3 style="margin-top:0px;margin-bottom:0px; color:${d3
                .color(color)
                .darker()}"><b>${name}</b></h3>`;
            });
        })
        .on("mouseleave", function (d) {
          let color = d.name === "India" ? "#00aaff" : "#828282";
          d3.select(this).style("fill", d3.color(color));
          Tooltip.style("z-index", "-1").style("opacity", 0);
        })

        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("y", (d) => y(d.rank) + 5);

      bars
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("width", (d) => Math.max(x(d.value) - x(0) - 1, 0))
        .attr("y", (d) => y(d.rank) + 5);

      bars
        .exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("width", (d) => Math.max(x(d.value) - x(0) - 1, 0))
        .attr("y", (d) => y(top_n + 1) + 5)
        .remove();

      let labels = svg.selectAll(".label").data(yearSlice, (d) => d.name);

      labels
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => x(d.value) - 8)
        .attr("y", (d) => y(top_n + 1) + 5 + (y(1) - y(0)) / 2)
        .style("text-anchor", "end")
        .style("fill", "white")
        .style("cursor", "default")
        .html((d) => d.name)
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1);

      labels
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d) => x(d.value) - 8)
        .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1);

      labels
        .exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d) => x(d.value) - 8)
        .attr("y", (d) => y(top_n + 1) + 5)
        .remove();

      let valueLabels = svg
        .selectAll(".valueLabel")
        .data(yearSlice, (d) => d.name);

      valueLabels
        .enter()
        .append("text")
        .attr("class", "valueLabel")
        .attr("x", (d) => x(d.value) + 5)
        .attr("y", (d) => y(top_n + 1) + 5)
        .style("fill", (d) => d.colour)

        .text((d) => d3.format(",.0f")(d.lastValue))
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1);

      valueLabels
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d) => x(d.value) + 5)
        .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1)
        .tween("text", function (d) {
          let i = d3.interpolateRound(d.lastValue, d.value);
          return function (t) {
            this.textContent = d3.format(",")(i(t));
          };
        });

      valueLabels
        .exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d) => x(d.value) + 5)
        .attr("y", (d) => y(top_n + 1) + 5)
        .remove();

      yearText.html(~~year);

      if (year == 2023.3) {
        race_ticker.stop();
        // race_ticker = null;
        race_paused = false;
      }
      year = d3.format(".1f")(+year + 0.1);
    };
    race_ticker = d3.interval(call_back, tickDuration);

    function abcd(event) {
      event.preventDefault();
      // alert("1 " + String(race_paused));
      if (race_paused === true) {
        race_ticker = d3.interval(call_back, tickDuration);
        race_paused = false;
        return;
      }
      race_ticker.stop();
      race_paused = false;
      race_ticker = undefined;
      butt.removeEventListener("click", abcd);
      d3.select("#chirag").style("z-index", "-1").style("opacity", 0);
      d3.select("#race_chart").selectAll("*").remove();
      plotRace();
    }

    var butt = document.getElementById("race_button");
    butt.addEventListener("click", abcd);
  });

  const halo = function (text, strokeWidth) {
    text
      .select(function () {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .style("fill", "#ffffff")
      .style("stroke", "#ffffff")
      .style("stroke-width", strokeWidth)
      .style("stroke-linejoin", "round")
      .style("opacity", 1);
  };

  // if (isStarted === false) {
  //   isStarted = true;
  //   if (race_paused) return;
  //   race_ticker.stop();
  //   race_paused = true;
  //   d3.select("#chirag").style("z-index", "-1").style("opacity", 0);
  // }
  // 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
}
plotRace();

// pause_race();
// function pause_race() {}

document
  .getElementById("pause_button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // pause_race();
    if (race_paused) return;
    race_ticker.stop();
    race_paused = true;
    d3.select("#chirag").style("z-index", "-1").style("opacity", 0);
    // alert(race_paused);
    // d3.select("#race_chart").selectAll("*").remove();
    // plotRace();
  });
