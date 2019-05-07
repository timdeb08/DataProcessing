/*
This page loads in the dataset and creates a barchart of the values
Dataset is from: www.OECD.org
*/

$( document ).ready(function() {

// Title of page
d3.select("head").append("title").text("Barchart using D3");
// Create body variable
var body = d3.select("body");
// Write chart's title, name, studentnumber and information of dataset on page
body.append("h1").text("Het kiloton olie-equivalent per OECD land in 2015")
    .style("color", "teal")
    .style("font-family", "Verdana");
d3.select("p").style("color", "black").style("font-family", "Verdana");
body.append("p").text("Name: Tim");
body.append("p").text("Studentnumber: 11202351");
body.append("p").text("This data set contains the oil-equivalent of the OECD's countries in 2015. Dataset is from OECD website");

// Create list for the values of json file
var ktoe = [];
// Load in the json file
var json = d3.json("d3.json");
json.then(function(data) {
  for (var i = 0; i < Object.keys(data).length; i++) {
    ktoe.push({'Country': Object.keys(data)[i], 'Value': data[Object.keys(data)[i]]['Value']})
  }
  console.log(ktoe);

  // Set margin, width and heigth
  var margin = {top: 50, right: 50, bottom: 50, left: 100};
  var svgWidth = 1200 - margin.left - margin.right;
  var svgHeight = 500 - margin.top - margin.bottom;

  // Scaling
  const xScale = d3.scaleBand()
                .domain(ktoe.map(function(d) { return d.Country; }))
                .range([0, svgWidth])
                .paddingInner(0.20)
                .paddingOuter(0.20);

  const yScale = d3.scaleLinear()
                .domain([0, d3.max(ktoe, function(d) { return d.Value; })])
                .range([svgHeight, 0]);

  // Define div for the tooltip
  var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

  // Create SVG element
  var svg = d3.select("body")
                .append("svg")
                .attr("width", svgWidth + margin.left + margin.right)
                .attr("height", svgHeight + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Create rectangle inside SVG and include event handler
  var rectangle = svg.selectAll("rect")
                .data(ktoe)
                .enter()
                .append("rect")
                .on("mouseover", function(d, i) {
                      d3.select(this)
                        .transition().duration(1)
                        .attr("fill", "orange");
                      // Shows bar value
                      div.transition().duration(50)
                        .style("opacity", 1)
                      div.html(d.Value)
                        .style("left", (d3.event.pageX - 50) + "px")
                        .style("top", (d3.event.pageY - 50) + "px");
                })
                .on("mouseout", function(d, i){
                      d3.select(this)
                        .transition().duration(1)
                        .attr("fill", "teal");

                      // Disappears bar value
                      div.transition().duration(50)
                        .style("opacity", 0);
                });

  rectangle.attr("x", function(d) {
                return xScale(d.Country);
                })
                .attr("y", function(d) {
                  return yScale(d.Value);
                })
                .attr("width", xScale.bandwidth)
                .attr("height", function(d) {
                  return svgHeight - yScale(d.Value);
                })
                .attr("fill", "teal")

  // Create the axis
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale)
                .ticks(7)
                .tickFormat(function(d) {
                  return d + " " + "KTOE";
                });
  // Call the axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + svgHeight + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "axis")
      .call(yAxis);

    });
});
