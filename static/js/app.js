

function update(patientName, data){
    // get and display demographic info
    var patientMeta = data.metadata.filter(
        patientData => patientData.id == patientName
    );
    var metaID = patientMeta[0].id;
    var metaEthnicity = patientMeta[0].ethnicity;
    var metaGender = patientMeta[0].gender;
    var metaAge = patientMeta[0].age;
    var metaLocation = patientMeta[0].location;
    var metaBBType = patientMeta[0].bbtype;
    var metaWFreq = patientMeta[0].wfreq;

    var demInfoElem = d3.select("#sample-metadata");
    demInfoElem.html("");
    demInfoElem.append("p").text("id: " + metaID);
    demInfoElem.append("p").text("ethnicity: " + metaEthnicity);
    demInfoElem.append("p").text("gender: " + metaGender);
    demInfoElem.append("p").text("age: " + metaAge);
    demInfoElem.append("p").text("location: " + metaLocation);
    demInfoElem.append("p").text("bbtype: " + metaBBType);
    demInfoElem.append("p").text("wfreq: " + metaWFreq);
    
    

    // get all the sample data for that patient
    var patientSample = data.samples.filter(
        patientInfo => patientInfo.id == patientName
    );
    
    var otu_ids = patientSample[0].otu_ids;
    var otu_ids_labels = otu_ids.map(id => "OTU " + id);
    var sample_vals = patientSample[0].sample_values;
    
    // Create a bar chart with data
    barTrace = {
        x : sample_vals.slice(0,10).reverse(),
        y : otu_ids_labels.slice(0,10).reverse(),
        type: "bar",
        orientation : "h",
        text: otu_ids_labels.slice(0,10).reverse()
    };
    barData = [barTrace];
    Plotly.newPlot("bar", barData);

    // Create a bubble chart with the data
    var bubbleTrace = {
        x: otu_ids,
        y: sample_vals,
        mode: 'markers',
        marker: {
          size: sample_vals,
          color: otu_ids,
          colorscale: 'RdBu'
        }
        
      };
      bubbleData = [bubbleTrace];
      bubbleLayout = {
          xaxis: {title: "OTU ID"}
      };
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    //   Create Gauge
    
    var gaugeTrace = {
        domain: { x: [0, 1], y: [0, 1] },
		value: metaWFreq,
        gauge: {
            bar: { color: "rgb(31,119,180)" },
            axis: { range: [0, 9] }
        },
		type: "indicator",
		mode: "gauge+number"
    }
    var title_text = "Belly Button Washing Frequency";
    title_text = title_text.bold();
    var sub_title_text = "<br>Scrubs per Week";
    var whole_title = title_text  + sub_title_text
    gaugeData = [gaugeTrace];
    gaugeLayout = {
        title: whole_title        
    }
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


}


d3.json("samples.json").then((data) => {
    // Create a variable to hold the Select ELement
    var selectElem = d3.select("#selDataset");

    // Get a list of all the DataSets(Patient 'names')
    var dataSets = data.names;
    
    // Add an option in the drop down for each data set
    dataSets.forEach(function(num){
        selectElem.append("option").text(num);
    })
    
    // Initialize the screen
    update(dataSets[0], data);

    // Create Event listener for change in option
    selectElem.on("change", function() {
        // Get the selected patient name
        var patientName = selectElem.property("value");

        update(patientName, data);

    // all update function code was here, taken out to allow for screen initialization

    })

});




