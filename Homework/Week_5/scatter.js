window.onload = function() {

    // Define the requests for the datasets
    var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
    var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
    var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
    var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

    Promise.all(requests).then(function(response) {
        // console.log(response);

        // Get the values of each dataset
        var teenViolent = Object.values(transformResponseTeen(response[0]));
        var teenPreg = Object.values(transformResponseTeen(response[1]));
        var countryGDP = Object.values(transformResponseGDP(response[2]));
        // console.log(countryGDP);
        // console.log(teenPreg);
        //console.log(teenViolent);

        // Create datastructure
        var dataStructure = {
          "2012" : [],
          "2013" : [],
          "2014" : [],
          "2015" : []
        }

        // Get the results from convertion
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
        return dataStructure;

    }).catch(function(e) {
        throw(e);
    });
  };

  /********
   * Transforms response of OECD request for teen pregancy rates.
   * https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017
   *
   * Also used for transform of response of OECD request for children living in area with high rates of crime and violence.
   * https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017
   **/
  function transformResponseTeen(data) {

      // Save data
      let originalData = data;

      // Access data property of the response
      let dataHere = data.dataSets[0].series;

      // Access variables in the response and save length
      let series = data.structure.dimensions.series;
      let serieLength = series.length;

      // Set up array of variables and length
      let varArray = [];
      let lenArray = [];

      series.forEach(function(serie) {
        varArray.push(serie);
        lenArray.push(serie.values.length);
      });

      // Get the time periods of the dataset
      let observation = data.structure.dimensions.observation[0];

      // Add time periods to the variables but since it's not included in the
      // 0:0:0 format it's not included in the array of lengths
      varArray.push(observation);

      // Create array of all possible combinations of the 0:0:0 format
      let strings = Object.keys(dataHere);

      // Set up output object, an object with each country being a key and an array
      // as value
      let dataObject = {};

      // For each string we've created
      strings.forEach(function(string) {

        // For each observation and its index
        observation.values.forEach(function(obs, index) {
          let data = dataHere[string].observations[index];
          if (data != undefined) {

            // Set up temporary object
            let tempObj = {};

            let tempString = string.split(":").slice(0, -1);
            tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });
            // Every datapoint has a time and datapoint
            tempObj["Time"] = obs.name;
            tempObj["Datapoint"] = data[0];
            tempObj["Indicator"] = originalData.structure.dimensions.series[1].values[0].name;

            // Add to total object
            if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                };

          }
        });
      });

      // Return the dict
      return dataObject;
  }

  /********
 * Transforms response of OECD request for GDP.
 * https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions
 **/
  function transformResponseGDP(data){

    // Save data
    let originalData = data;

    // access data
    let dataHere = data.dataSets[0].observations;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.observation;
    let seriesLength = series.length;

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        observation.values.forEach(function(obs, index){
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ':'
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                    dataObject[tempObj["Country"]].push(tempObj);
                };

            }
        });
    });

    // return the finished product!
    return dataObject;
}

function createScatterplot(dataset) {

  // Set margin, width and heigth
  var margin = {top: 50, right: 50, bottom: 50, left: 100};
  var width = 1200 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  // Scale the x-axis
  var xScale = d3.scaleLinear()
                .range([0, width]);

  // Create x-axis
  var xAxis = d3.axisBottom(xScale);

  // Call the axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + svgHeight + ")")
      .call(xAxis);

  // Scale the y-axis
  var yScale = d3.scaleLinear()
                range([height, 0]);
  // Create y-axis
  var yAxis = d3.axisLeft(yScale);

  // Call the y-axis
  svg.append("g")
      .attr("class", "axis")
      .call(yAxis);

  // Create svg element
  var svg = d3.select("svg")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define div for tooltip
  var div = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

  // Create circles inside SVG and include event handler
  var circles = svg.selectAll("circle").data(......)
                  .enter()
                  .append("circle")



}
