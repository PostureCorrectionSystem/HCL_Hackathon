/*
References to the firebase database 
*/
const Database = firebase.database();
const ref7 = Database.ref("/Right/Pitch/Pitch");
const ref8 = Database.ref("/PastData");
let graphData;
ref8.on("value",(data)=>{
  graphData = data.val()
  showHistory()
  // Object.keys(b).forEach((key)=>{
  //   try{
  //     console.log(b[key].Posture,b[key].Time)
  //   }catch(err){
  //     console.log(err)
  //   }
  // })

  // b.forEach((datapoint)=>{
  //  try{
  //     console.log(datapoint.Posture,datapoint.time) 
  //  }catch(err){
  //    console.log("No time")
  //  }
  // })
})

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

// data is taken from global variable called "graph data"
// reference for this plot is taken from https://bl.ocks.org/d3noob/6f082f0e3b820b6bf68b78f2f7786084

function showHistory(){
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.Time); })
    .y(function(d) { return y(d.Posture); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#historycontainer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
// Scale the range of the data
x.domain(d3.extent(graphData, function(d) { return d.Time; }));
y.domain([0, d3.max(graphData, function(d) { return d.Posture; })]);

// Add the valueline path.
svg.append("path")
  .data([graphData])
  .attr("class", "line")
  .attr("d", valueline);
  
// Add the scatterplot
svg.selectAll("dot")
  .data(graphData)
.enter().append("circle")
  .attr("r", 5)
  .attr("cx", function(d) { return x(d.date); })
  .attr("cy", function(d) { return y(d.close); });

// Add the X Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
  .call(d3.axisLeft(y));

}