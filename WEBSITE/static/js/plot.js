/*
References to the firebase database 
*/
const Database = firebase.database();
const ref7 = Database.ref("/Right/Pitch/Pitch");
const ref8 = Database.ref("/PastData");
let graphData;

ref8.on("value", (data) => {
  graphData = {};
  b = data.val(); 
  Object.keys(b).forEach((keys) => {
    try {
      let key = b[keys].Time.split(" ")[0];
      if (b[keys].Posture == "NO") {
        if (!graphData[`${key}`]) {
          graphData[`${key}`] = 1;
        } else {
          graphData[`${key}`] += 1;
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
  let gdata = Array();
  // console.log(graphData);
  graphData = Object.keys(graphData).sort().reduce((a, c) => (a[c] = graphData[c], a), {});
  console.log(graphData);
  Object.keys(graphData).forEach((t) => {
    gdata.push({ Time: t, count: graphData[t] });
  });
  graphData = gdata //to plot graph
});

ref7.on("value", gotData);
/* 
global variable to hold the current angle
and function to updata angle
*/
var angle;
function gotData(data) {
  angle = data.val();
  // console.log(angle);
  // createGraph();
}

/**
 Helper function to convert to radians
 */
function toCorrectRadians(angle) {
  let actualAngle = angle + 270; // for right shoulder do -(angle)+90
  return (Math.PI / 180) * actualAngle;
}

/**
 * Main function that creates the graph. DO NOT EDIT
 * Need to fix the red line which goes out of the graph
 *
 */

function createGraph() {
  var width = 960;
  var height = 500;
  radius = 200;

  var r = d3.scaleLinear().domain([0, 0.5]).range([0, radius]);
  //get angle in radians
  var angleRadians = toCorrectRadians(angle); //firebase value should go here. Negative sign is not important

  var data = d3.range(0, 2 * Math.PI, 0.01).map(function (t) {
    return [t, t < Math.PI ? angleRadians : Math.PI / 2 + angleRadians];
  });

  var line = d3
    .radialLine()
    .radius(function (d) {
      return r(d[0]);
    })
    .angle(function (d) {
      return d[1];
    });

  //Create SVG element
  var svg1 = d3
    .select("#svgcontainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(-160,20)");

  //Adds the circles
  var gr = svg1
    .append("g")
    .attr("class", "r axis")
    .selectAll("g")
    .data(r.ticks(5).slice(1))
    .enter()
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); //

  // change the properties
  gr.append("circle").attr("r", r);

  var ga = svg1
    .append("g")
    .attr("class", "a axis")
    .selectAll("g")
    .data(d3.range(0, 360, 30))
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(480,250),rotate(" + -d + ")";
    });

  ga.append("line").attr("x2", radius);

  ga.append("text")
    .attr("x", radius)
    .attr("dy", ".35em")
    .style("text-anchor", function (d) {
      return d < 270 && d > 90 ? "end" : null;
    })
    .attr("transform", function (d) {
      return d < 270 && d > 90 ? "rotate(180 " + radius + ",0)" : null;
    })
    .text(function (d) {
      return d + "°";
    });

  svg1
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
}

function showHistory() {
  
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 360 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  var svg = d3
    .select("#historycontainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    graphData.forEach(function(d) {
      d.sales = +d.sales;
    });
  
    // Scale the range of the graphData in the domains
    x.domain(graphData.map(function(d) { return d.Time; }));
    y.domain([0, d3.max(graphData, function(d) { return d.count; })]);
  
    // append the rectangles for the bar chart
    svg.selectAll(".bar")
    .data(graphData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Time); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); });
  
    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "13px") 
        .style("text-decoration", "underline")  
        .text("Times sat in bad position during the day(24H)");

}
