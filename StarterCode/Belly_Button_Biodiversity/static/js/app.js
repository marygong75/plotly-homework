function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
 
  var url = `/metadata/${sample}`

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  var sample_metadata = d3.select("#sample-metadata")

  sample_metadata.html("")
  
  d3.json(url).then(data=> {
    Object.entries(data).forEach(([key, value])=> {
      var p = sample_metadata.append("p")
      p.text(`${key}: ${value}`)
    })
  })
}

function buildCharts(sample) {

  var url = `/samples/${sample}`

  // Pie Chart
  d3.json(url).then(data=> {
    var trace1 = {
      "values": data.sample_values.slice(0,10),
      "labels": data.otu_ids.slice(0,10),
      // figure out the correct hover stuff, currently hover is incorrect, needs otu_labels 
      // "hoverinfo": 'label+value+percent',
      "type": "pie"
    }
    Plotly.newPlot("pie", [trace1])

    // Bubble Chart
    var trace2 = {
      "x": data.otu_ids,
      "y": data.sample_values,
      "mode": "markers",
      "marker": {
        "size": data.sample_values,
        "color": data.otu_ids
      },
      "text": data.otu_lables,
      "type": "bubble"
    }
    Plotly.newPlot("bubble", [trace2])
  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}
  

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();