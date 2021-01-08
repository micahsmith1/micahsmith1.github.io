function buildPlot(id) {
    // D3 library to read in `samples.json`
    d3.json("./Data/samples.json").then((data) => {
        // console.log(data);
        
        // Horizontal bar chart with a dropdown menu 
        // to display to display the top 10 OTUs found in that individual 
        let wfreq = data.metadata.map(d => d.wfreq)
        // console.log(`Washing Freq: ${wfreq}`);

        // Filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        // console.log(samples);

        // Getting the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();

        // Top 10 otu ids for the plot OTU and reversing it.
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        var OTU_id = OTU_top.map(d => "OTU" + d)
        // console.log(`OTU IDS: ${OTU_id}`)

        // Labels for the plot 
        var labels = samples.otu_labels.slice(0, 10);

        // console.log(`Sample Values: ${samplevalues}`)
        // console.log(`ID Values: ${OTU_top}`)

        // Trace variable 
        var trace = {
            x: samplevalues,
            y: OTU_id, 
            text: labels, 
            type: "bar",
            orientation: "h",
        };

        // Data variable 
        var data = [trace];

        // Layout variable 
        var layout = {
            title: "Top 10 OTUs"
        };

        // Bar Chart
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart 

        // Trace variable 
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.oty_labels
        };

        // Data variable 
        var data1 = [trace1]

        // Layout variable 
        var layout1 = {
            xaxis: {title: "OTU ID"},
            height: 600, 
            width: 1000
        };

        // Bubble Chart 
        Plotly.newPlot("bubble", data1, layout1);

        });

}

// Function to get data
function getInfo(id){
    // Read json file 
    d3.json("Data/samples.json").then((data) =>{
        // Metadata info for the demographic panel 
        var metadata = data.metadata;
        // console.log(metadata);

        // Filter metadata info by ID 
        var result = metadata.filter(md => md.id.toString() === id)[0];

        // Demographic panel 
        var demInfo = d3.select("#sample-metadata");

        // Refreshing demographic panel 
        demInfo.html("");

        // Data for  the id 
        // Append info to demographic panel 
        Object.entries(result).forEach((key) => {
            demInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });

    });
} 

// Function for Change Event 
function optionChanged(id) {
    buildPlot(id);
    getInfo(id);
}

// Function for initial data rendering 
function init() {
    // Dropdown menu 
    var dropdown = d3.select("#selDataset");

    // Read the data 
    d3.json("Data/samples.json").then((data) => {
        // console.log(data);

        // ID Data to the dropdown menu 
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

    // Call functions 
    buildPlot(data.names[0]);
    getInfo(data.names[0]);
    });
} init();