/*
Name: Tim de Boer
Studentnummer: 11202351
This page loads in the dataset and creates a scatterplot of the values
API is from: www.OECD.org
*/


// Define the requests for the datasets
var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

Promise.all(requests).then(function(response) {

    // Get the values of each dataset
    var teenViolent = Object.values(transformResponseTeen(response[0]));
    var teenPreg = Object.values(transformResponseTeen(response[1]));
    var countryGDP = Object.values(transformResponseGDP(response[2]));

    // Create datastructure
    var dataStructure = {
      "2012" : [],
      "2013" : [],
      "2014" : [],
      "2015" : []
    }

    // Add teen violence to dict
    Object.keys(teenViolent).forEach(function(keys) {
      teenViolent[keys].forEach(function(value) {
        if (dataStructure[value.Time]) {
          dataStructure[value.Time].push({
            "Country": value.Country,
            "Violence": value.Datapoint
          })
        }
      })
    });

    // Add teen pregancy to dict
    Object.keys(teenPreg).forEach(function(keys) {
      teenPreg[keys].forEach(function(value) {
        if (dataStructure[value.Time]) {
          dataStructure[value.Time].forEach(function(d) {
            if (d.Country == value.Country) {
              d["teenPreg"] = value.Datapoint
            }
          })
        }
      })
    });

    // Add GDP to dict
    Object.keys(countryGDP).forEach(function(keys) {
      countryGDP[keys].forEach(function(value) {
        if (dataStructure[value.Year]) {
          dataStructure[value.Year].forEach(function(d) {
            if (d.Country == value.Country) {
              d["GDP"] = value.Datapoint
            }
          })
        }
      })
    });

    // Delete countries with unknown values
    Object.keys(dataStructure).forEach(function(years) {
      for (year = 2012; year < 2016; year++) {
        for (i = 0; i < dataStructure[year].length; i++) {
          if (!(dataStructure[year][i].GDP) || !(dataStructure[year][i].teenPreg) || !(dataStructure[year][i].Violence)) {
            dataStructure[year].splice(i);
          }
        }
      }
    });

    // Title of page
    d3.select("head").append("title").text("Scatterplot");

    // Set margin, width and heigth
    var margin = {top: 50, right: 50, bottom: 50, left: 70};
    var width = 1400 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var paddingRight = 300;

    // Scale the x-axis
    const xScale = d3.scaleLinear()
                  .domain([0, d3.max(dataStructure['2015'], function(d) { return d.Violence; })])
                  .range([0, width - paddingRight])
                  .nice();

    // Scale the y-axis
    const yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataStructure["2015"], function(d) { return d.teenPreg; })])
                  .range([height, 0])
                  .nice();

    // Define div for tooltip
    var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

    // Create svg element
    var svg = d3.select("body")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create circles inside SVG
    // Set date variable equal to 2015
    var year = '2015';
    d3.selectAll(".yrs")
      .on("click", function() {
        var year = this.getAttribute("value");
        svg.selectAll("circle")
            .data(dataStructure[year])
            .transition()
            .attr("cx", function(d) { return xScale(d.Violence); })
            .attr("cy", function(d) { return yScale(d.teenPreg); })
            .attr("fill", function(d){
              if (d.GDP < 20000){ return "#ffffcc"}
              if (d.GDP > 20000 && d.GDP < 30000){ return "#a1dab4"}
              if (d.GDP > 30000 && d.GDP < 40000){ return "#41b6c4"}
              if (d.GDP > 40000 && d.GDP < 50000){ return "#2c7fb8"}
              if (d.GDP > 50000){ return "#253494"}
            })
            .transition()
            .duration(500);
          });

    // Include event handler
    svg.selectAll("circle")
      .data(dataStructure[year])
      .enter()
      .append("circle")
      .attr("cx", function(d) { return xScale(d.Violence); })
      .attr("cy", function(d) { return yScale(d.teenPreg); })
      .attr("r", 5)
      .attr("fill", function(d){
        if (d.GDP < 20000){ return "#ffffcc"}
        if (d.GDP > 20000 && d.GDP < 30000){ return "#a1dab4"}
        if (d.GDP > 30000 && d.GDP < 40000){ return "#41b6c4"}
        if (d.GDP > 40000 && d.GDP < 50000){ return "#2c7fb8"}
        if (d.GDP > 50000){ return "#253494"}
      })
      .on("mouseover", function(d, i) {
            d3.select(this)
              .transition().duration(1)
              .attr("fill", "orange");

            // Shows bar value
            div.transition().duration(50)
              .style("opacity", 1)
            div.html(d.Country)
              .style("left", (d3.event.pageX - 50) + "px")
              .style("top", (d3.event.pageY - 50) + "px");
      })
      .on("mouseout", function(d, i){
            d3.select(this)
              .transition().duration(1)
              .attr("fill", function(d){
                if (d.GDP < 20000){ return "#ffffcc"}
                if (d.GDP > 20000 && d.GDP < 30000){ return "#a1dab4"}
                if (d.GDP > 30000 && d.GDP < 40000){ return "#41b6c4"}
                if (d.GDP > 40000 && d.GDP < 50000){ return "#2c7fb8"}
                if (d.GDP > 50000){ return "#253494"}
              });

            // Disappears bar value
            div.transition().duration(50)
              .style("opacity", 0);
      });

    // Create the axis
    var xAxis = d3.axisBottom(xScale)
                  .ticks(10)
                  .tickFormat(function(d) { return d; });
    var yAxis = d3.axisLeft(yScale)
                  .ticks(7)
                  .tickFormat(function(d) { return d; });

    // Call the axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "axis")
        .call(yAxis);

    // Text label for x axis
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + 40)
        .style("text-anchor", "end")
        .text("Percentage of teens living in a violent area in a specific country");

    // Text label for y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height/13))
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("The percentage of teens getting pregnant in a specific country");

    // Title for scatterplot
    svg.append("text")
        .attr("x", width/4)
        .attr("y", height - 420)
        .text("Correlation teen pregnancies against teens living in violent areas")
        .style("font-weight", "bold");

    // Legend for the scatterplot
    svg.append("text").attr("x", 1000).attr("y", 30).text("Legend").style("font-weight", "bold")
    svg.append("circle").attr("cx", 1000).attr("cy", 50).attr("r", 5).attr("fill", "#ffffcc")
    svg.append("circle").attr("cx", 1000).attr("cy", 70).attr("r", 5).attr("fill", "#a1dab4")
    svg.append("circle").attr("cx", 1000).attr("cy", 90).attr("r", 5).attr("fill", "#41b6c4")
    svg.append("circle").attr("cx", 1000).attr("cy", 110).attr("r", 5).attr("fill", "#2c7fb8")
    svg.append("circle").attr("cx", 1000).attr("cy", 130).attr("r", 5).attr("fill", "#253494")
    svg.append("text").attr("x", 1020).attr("y", 54).text("GDP < 20000")
    svg.append("text").attr("x", 1020).attr("y", 74).text("20000 > GDP < 30000")
    svg.append("text").attr("x", 1020).attr("y", 94).text("30000 > GDP < 40000")
    svg.append("text").attr("x", 1020).attr("y", 114).text("40000 > GDP < 50000")
    svg.append("text").attr("x", 1020).attr("y", 134).text("GDP > 50000")


}).catch(function(e) {
    throw(e);
});
