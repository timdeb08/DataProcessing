/*
Name: Tim de Boer
Studentnummer: 11202351
*/

$( document ).ready(function(){

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

    // Initiate svg element
    var svg2 = d3v5.select("body")
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
