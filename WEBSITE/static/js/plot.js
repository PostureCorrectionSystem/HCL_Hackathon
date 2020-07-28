var x = document.getElementById("myBtn");

const Database = firebase.database();
const ref4 = Database.ref('/Right/Pitch/Pitch')

ref4.on('value', gotData);


var angle;
function gotData(data){
    var pitch = data.val();
    angle = pitch
    console.log(pitch);

    //var element=document.createElement("div");
    //document.getElementsByTagName("body")[0].appendChild(element);
    //element.innerHTML+=pitch
}


// add a div with id svgcontainer in Dashboard.html
function toCorrectRadians(angle){
    let actualAngle = angle+270 // for right do -(angle)+90
    return (Math.PI/180)*actualAngle
}

function createGraph(){
  var width = 960;
var height = 500;
radius = 200;

var r = d3.scaleLinear()
.domain([0, .5])
.range([0, radius]);

var angleRadians = toCorrectRadians(angle) //firebase value should go here. Negative sign is not important

var data = d3.range(0, 2*Math.PI,0.01).map(function(t) {
return [t,t<Math.PI?angleRadians:Math.PI/2+angleRadians];
});

var line = d3.radialLine()
.radius(function(d) { return r(d[0]); })
.angle(function(d) { return d[1] });

//Create SVG element
var svg1 = d3.select("#svgcontainer")
.append("svg")
.attr("width", width)
.attr("height", height)
        .append("g")
        .attr("transform","translate(-160,20)");



//Adds the circles
var gr = svg1.append("g")
.attr("class", "r axis")
    .selectAll("g")
    .data(r.ticks(5).slice(1))
    .enter().append("g")
    .attr("transform","translate(" + width / 2 + "," + height / 2 + ")"); //

// change the properties
gr.append("circle")
.attr("r", r)

//     gr.append("text")
// .attr("y", function(d) { return -r(d) - 4; })
// .attr("transform", "rotate(15)")
// .style("text-anchor", "middle")
// .text(function(d) { return d; });

var ga = svg1.append("g")
.attr("class", "a axis")
.selectAll("g")
.data(d3.range(0, 360, 30))
.enter().append("g")
.attr("transform", function(d) { return "translate(480,250),rotate(" + -d + ")"; })

ga.append("line")
.attr("x2", radius)


ga.append("text")
.attr("x", radius)
.attr("dy", ".35em")
.style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
.attr("transform", function(d) { return d < 270 && d > 90 ? "rotate(180 " + (radius) + ",0)" : null; })
.text(function(d) { return d + "°"; });

svg1.append("path")
.datum(data)
.attr("class", "line")
.attr("d", line)
.attr("transform","translate(" + width / 2 + "," + height / 2 + ")");

}
