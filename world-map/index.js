//
// Configuration
//

globe_bin_colors = [
  "#d8f3dc",
  "#b7e4c7",
  "#95d5b2",
  "#74c69d",
  "#52b788",
  "#40916c",
  "#2d6a4f",
  "#1b4332",
  "#081c15",
];

globe_bin_ranges = [
  { st: 0, end: 300 },
  { st: 301, end: 700 },
  { st: 701, end: 1200 },
  { st: 1201, end: 2000 },
  { st: 2001, end: 3500 },
  { st: 3501, end: 6000 },
  { st: 6001, end: 9000 },
  { st: 9001, end: 13000 },
  { st: 13001, end: 20000 },
];

function getCol_bin(num) {
  for (i = 0; i < globe_bin_colors.length; i++) {
    if (num >= globe_bin_ranges[i].st && num <= globe_bin_ranges[i].end) {
      return globe_bin_colors[i];
    }
  }
  return "#000";
}

function loadGlobe() {
  init_y = 0;
  for (i = 0; i < globe_bin_colors.length; i++) {
    d3.select("#color-scale")
      .append("rect")
      .attr("x", 0)
      .attr("y", init_y)
      .attr("height", "55")
      .attr("width", "20")
      .style("fill", globe_bin_colors[i]);

    d3.select("#color-scale")
      .append("text")
      .attr("x", 25)
      .attr("y", init_y + 32.5)
      .text(`${globe_bin_ranges[i].st} - ${globe_bin_ranges[i].end}`);
    // .style("fill", globe_bin_colors[i]);
    init_y += 55;
  }

  let max_num = 0,
    min_num = 10000000;
  let country = null;
  for (let data of Object.keys(country_data)) {
    if (data == "undefined") continue;
    let total = 0;
    for (let x of Object.keys(country_data[data]))
      total += Number(country_data[data][x]);
    country_data[data]["sum"] = total;
    if (total > max_num) {
      country = data;
    }
    max_num = Math.max(max_num, total);
    min_num = Math.min(min_num, total);
  }
  // console.log(max_num, min_num, country);
  let r_max = 216,
    g_max = 243,
    b_max = 220;
  let r_min = 8,
    g_min = 28,
    b_min = 21;

  function getColor(col, c_min, c_max) {
    if (max_num === min_num) return 0;
    max = max_num;
    min = min_num;
    var a = (1 / c_max - 1 / c_min) / (min - max);
    var b = 1 / c_max - a * min;
    return Math.floor(1 / (a * col + b));
  }

  // ms to wait after dragging before auto-rotating
  var rotationDelay = 3000;
  // scale of the globe (not the canvas element)
  var scaleFactor = 0.9;
  // autorotation speed
  var degPerSec = 6;
  // start angles
  var angles = { x: -20, y: 40, z: 0 };
  // colors
  var colorWater = "#48cae4";
  var colorLand = "#4b4b4b";
  var colorGraticule = "#48cae4";
  var colorCountry = "#ff0004";
  var countryMap = {};

  function findCaseIns(name) {
    for (const country in country_list) {
      if (country.toLowerCase() === name.toLowerCase())
        return country_data[country];
    }
    return undefined;
  }

  function enter(country) {
    var country = countryList.find(function (c) {
      return parseInt(c.id, 10) === parseInt(country.id, 10);
    });
    // console.log(country_data[country.name]);

    function showData(data) {
      if (data) {
        let total = data["sum"];
        // for (let x of Object.keys(data)) total += Number(data[x]);
        // console.log(total);
        const ranks = [
          "legendary grandmaster",
          "international grandmaster",
          "grandmaster",
          "international master",
          "master",
          "candidate master",
          "expert",
          "specialist",
          "pupil",
          "newbie",
        ];
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
        };
        let str = `<h1>${country.name}</h1><h4>${total} users</h4>`;
        for (const rank of ranks) {
          if (data[rank])
            str += `<text style="color:${ranks_colors[rank]}">${rank}</text> : ${data[rank]}<br/>`;
        }
        current
          // .style("left", event.pageX + 10)
          // .style("top", event.pageY - 15)
          .style("padding", "10px")
          .html(str);
      } else {
        current
          .style("padding", "10px")
          .html(`<h1>${country.name}</h1>No Data`);
      }
    }
    // if (country.name === "Russian Federation") {
    //   country.name = "Russia";
    // }
    if (country_data[country.name]) {
      showData(country_data[country.name]);
    } else {
      let tem_data = findCaseIns(country.name);
      if (tem_data) {
        showData(country_data[country.name]);
      } else {
        showData(undefined);
      }
    }
  }

  function leave(country) {
    current.style("padding", "0px").html("");
  }

  var current = d3.select("#current");
  var canvas = d3.select("#globe");
  var context = canvas.node().getContext("2d");
  var water = { type: "Sphere" };
  var projection = d3.geoOrthographic().precision(0.1);
  var graticule = d3.geoGraticule10();
  var path = d3.geoPath(projection).context(context);
  var v0; // Mouse position in Cartesian coordinates at start of drag gesture.
  var r0; // Projection rotation as Euler angles at start.
  var q0; // Projection rotation as versor at start.
  var lastTime = d3.now();
  var degPerMs = degPerSec / 1000;
  var width, height;
  var land, countries;
  var countryList;
  var autorotate, now, diff, roation;
  var currentCountry;

  //
  // Functions
  //

  function setAngles() {
    var rotation = projection.rotate();
    rotation[0] = angles.y;
    rotation[1] = angles.x;
    rotation[2] = angles.z;
    projection.rotate(rotation);
  }

  function scale() {
    width = document.documentElement.clientWidth * 0.4;
    height = document.documentElement.clientHeight * 0.9;

    canvas.attr("width", width).attr("height", height);
    projection
      .scale((scaleFactor * Math.min(width, height)) / 2)
      .translate([width / 2, height / 2]);
    // d3.select("#gradient").append("rect");
    // d3.select("#color-scale").translate([width / 2, 0]);
    render();
  }

  function startRotation(delay) {
    autorotate.restart(rotate, delay || 0);
  }

  function stopRotation() {
    autorotate.stop();
  }

  function dragstarted() {
    v0 = versor.cartesian(projection.invert(d3.mouse(this)));
    r0 = projection.rotate();
    q0 = versor(r0);
    stopRotation();
  }

  function dragged() {
    var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)));
    var q1 = versor.multiply(q0, versor.delta(v0, v1));
    var r1 = versor.rotation(q1);
    projection.rotate(r1);
    render();
  }

  function dragended() {
    startRotation(rotationDelay);
  }

  function render() {
    context.clearRect(0, 0, width, height);
    fill(water, colorWater);
    stroke(graticule, colorGraticule);

    for (x of countries.features) {
      let id = Number(x.id);
      // console.log(country_data[countryMap[id]]);
      if (country_data[countryMap[id]] && country_data[countryMap[id]]["sum"]) {
        fill(x, `${getCol_bin(country_data[countryMap[id]]["sum"])}`);
      } else {
        // console.log("no dtaa");
        fill(
          x,
          `rgb(${225},
            ${225},
            ${225})`
        );
      }
    }
    if (currentCountry) {
      // alert(JSON.stringify(currentCountry));
      fill(currentCountry, colorCountry);
    }
  }

  function fill(obj, color) {
    context.beginPath();
    path(obj);
    context.fillStyle = color;
    context.fill();
  }

  function stroke(obj, color) {
    context.beginPath();
    path(obj);
    context.strokeStyle = color;
    context.stroke();
  }

  function rotate(elapsed) {
    now = d3.now();
    diff = now - lastTime;
    if (diff < elapsed) {
      rotation = projection.rotate();
      rotation[0] += diff * degPerMs;
      projection.rotate(rotation);
      render();
    }
    lastTime = now;
  }

  function loadData(cb) {
    d3.json(
      "https://unpkg.com/world-atlas@1/world/110m.json",
      function (error, world) {
        if (error) throw error;
        d3.tsv(
          "https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv",
          function (error, countries) {
            if (error) throw error;
            cb(world, countries);
          }
        );
      }
    );
  }

  // https://github.com/d3/d3-polygon
  function polygonContains(polygon, point) {
    var n = polygon.length;
    var p = polygon[n - 1];
    var x = point[0],
      y = point[1];
    var x0 = p[0],
      y0 = p[1];
    var x1, y1;
    var inside = false;
    for (var i = 0; i < n; ++i) {
      (p = polygon[i]), (x1 = p[0]), (y1 = p[1]);
      if (y1 > y !== y0 > y && x < ((x0 - x1) * (y - y1)) / (y0 - y1) + x1)
        inside = !inside;
      (x0 = x1), (y0 = y1);
    }
    return inside;
  }

  function mousemove() {
    var c = getCountry(this);
    if (!c) {
      if (currentCountry) {
        leave(currentCountry);
        currentCountry = undefined;
        render();
      }
      return;
    }
    if (c === currentCountry) {
      return;
    }
    currentCountry = c;
    render();
    enter(c);
  }

  function getCountry(event) {
    var pos = projection.invert(d3.mouse(event));
    return countries.features.find(function (f) {
      return f.geometry.coordinates.find(function (c1) {
        return (
          polygonContains(c1, pos) ||
          c1.find(function (c2) {
            return polygonContains(c2, pos);
          })
        );
      });
    });
  }

  //
  // Initialization
  //

  setAngles();

  canvas
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .on("mousemove", mousemove);

  loadData(function (world, cList) {
    land = topojson.feature(world, world.objects.land);
    countries = topojson.feature(world, world.objects.countries);
    // console.log(countries);
    countryList = cList;
    // console.log(countryList);
    for (let x of countryList) {
      countryMap[Number(x.id)] = x.name;
    }

    // console.log(countryMap);
    window.addEventListener("resize", scale);
    scale();
    autorotate = d3.timer(rotate);
  });
}
loadGlobe();
