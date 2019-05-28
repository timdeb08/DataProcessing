/*
Name: Tim de Boer
Studentnummer: 11202351
*/

$( document ).ready(function(){

  // Load dataset
  d3v5.csv("oorzaakverkeer.csv", function(d) {
    return {
      Jaar: d.Jaar,
      Verkeersdoden: +d.Totaal,
      Voetgangers: +d.Voetganger,
      Fietsers: +d.Fiets,
      Bromfiets: +d.Bromsnorfiets,
      Motorfiets: +d.Motorfiets,
      Personenauto: +d.Personenauto,
      Vrachtauto: +d.Bestelvrachtauto,
      Invalidevoertuig: +d.Gemotoriseerdinvalidenvoertuig,
      Overig: +d.Overig,
      Onbekend: +d.Onbekend
    };
  }).then(function(data){

      console.log(data);


        // Set margin, width and height
        margin = {top: 20, right: 60, bottom: 30, left:40, mid: 20};
        width = 600 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;

        // Initiate SVG element
        const svg1 = d3v5.select("body")
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Initiate tooltip
        const tooltip = d3v5.select("body")
                          .append("div")
                            .attr("class", "toolTip")
                          .style("opacity", 0);

        // Initiate x axis
        const xScale = d3v5.scaleBand()
                        .domain(data.map(function(d) { return d.Jaar; }))
                        .rangeRound([0, width])
                        .paddingInner(0.40)
                        .paddingOuter(0.40);

        const xAxis = d3v5.axisBottom(xScale)
                        .ticks(10)
                        .tickSize(6);

        // Initiate y axis
        const yScale = d3v5.scaleLinear()
                        .domain([0, d3v5.max(data, function(d) { return d.Verkeersdoden; })])
                        .rangeRound([height, 0]);

        const yAxis = d3v5.axisLeft(yScale)
                        .ticks(10)
                        .tickSize(6);

        // Call the axis
        svg1.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        svg1.append("g")
          .attr("class", "axis")
          .call(yAxis);

        // Initiate rectangles
        const rectangle = svg1.selectAll("rect")
                            .data(data)
                            .enter()
                            .append("rect")
                            .on("mouseover", function(d) {
                                d3v5.select(this)
                                  .transition().duration(1)
                                  .attr("fill", "lightblue");

                                // Show bar value
                                tooltip.transition().duration(50)
                                  .style("opacity", 1)
                                tooltip.style("left", d3v5.event.pageX - 50 + "px")
                                  .style("top", d3v5.event.pageY - 70 + "px")
                                  .style("display", "inline-block")
                                  .html("Jaar: " + (d.Jaar) + "<br>" + "Aantal: " + (d.Verkeersdoden));
                            })
                            .on("mouseout", function(d){
                                d3v5.select(this)
                                  .transition().duration(1)
                                  .attr("fill", "orange");

                                // Disappears bar value
                                tooltip.style("opacity", 0);
                            });

        rectangle.attr("x", function(d) { return xScale(d.Jaar); })
                .attr("y", function(d) { return yScale(d.Verkeersdoden); })
                .attr("width", xScale.bandwidth())
                .attr('height', function(d) { return height - yScale(d.Verkeersdoden); })
                .attr("fill", "orange");

        // Create pie chart for the first year of the dataset
        // // CODE!!!!
        // Set width, height, radius, colors
        var width = 960,
            height = 500,
            radius = Math.min(width, height) / 2;

        var color = d3v5.scaleOrdinal(d3v5.schemeCategory10);

        // Initiate arc element
        var arc = d3v5.arc()
                    .innerRadius(radius - 100)
                    .outerRadius(radius - 20);

        // Initiate pie chart
        var pie = d3v5.pie()
                    .value(function(d) { return d.Voetganger + ; })
                    .sort(null);

        // Initiate svg element
        var svg = d3v5.select("body")
                    .append("svg")
                      .attr("width", width)
                      .attr("height", height)
                    .append("g")
                      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg2.datum(data).selectAll("path")
                    .data(pie)
                    .enter()
                    .append("path")
                      .attr("fill", function(d, i) { return color(i); })
                      .attr("d", arc)
                      .each(function(d) { this._current = d; });
    })
  });
