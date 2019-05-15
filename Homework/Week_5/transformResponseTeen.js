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
