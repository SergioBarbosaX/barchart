const margin = 80;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;

const svg = d3.select("svg");
const svgContainer = d3.select('#container');

// Set the origin of chart in (80, 80)
const chart = svg.append("g")
                 .attr("transform", `translate(${margin}, ${margin})`);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then((jsonData) => {

  arrValueGDP = jsonData.data.map((element) => {
    return (element[1]);
  });

  const barWidth = width/arrValueGDP.length;

  arrDateGDP = jsonData.data.map((element) => {
    return (new Date(element[0]));
  });

  arrRawDateGDP = jsonData.data.map((element) => {
    return (element[0]);
  });


  const arrYearAndPeriod = jsonData.data.map((dataItem) => {
    let year = dataItem[0].slice(0, 4);
    let period;

    switch (dataItem[0].slice(5, 7)) {
        case '01':
            period = 'Q1';
            break;
        case '04':
            period = 'Q2';
            break;
        case '07':
            period = 'Q3';
            break;
        case '10':
            period = 'Q4';
            break;
    };
    return year+" "+period;
  });


  const yScale = d3.scaleLinear()
                  .range([height, 0])
                  .domain([0, d3.max(arrValueGDP)]);

                 chart.append("g")
                      .attr("id", "y-axis")
                      .call(d3.axisLeft(yScale));

  const xScale = d3.scaleTime()
                   .range([0, width])
                   .domain([d3.min(arrDateGDP), d3.max(arrDateGDP)]);
                  
                 chart.append("g")
                      .attr("id", "x-axis")
                      .attr("transform", `translate(0, ${height})`)
                      .call(d3.axisBottom(xScale));


  // Scale chart values
  const linearScale = d3.scaleLinear()
                        .domain([0, d3.max(arrValueGDP)])
                        .range([0, height]);

  const scaledGDP = arrValueGDP.map((item) => {
                          return linearScale(item);
                        });

  // Create tooltip
  const tooltip = d3.select("#container")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

  
  chart.selectAll()
         .data(scaledGDP)
         .enter()
         .append("rect") 
         .attr("class", "bar")
         .attr('data-date', (d, i) => {
            return arrRawDateGDP[i];
          })
         .attr('data-gdp', (d, i) => {
            return arrValueGDP[i];
          })
         .attr("y", (d, i) => {
            return height - d;
          })
          .attr("x", (d, i) => {
            return xScale(arrDateGDP[i]);
          })
          .attr("height", (d, i) => {
            return d;
          })
          .attr("width", barWidth)
          .on("mouseover", function (d, i) {
            tooltip.transition()
                   .duration(300)
                   .style("opacity", 0.90);
            tooltip.html("<p>"+arrYearAndPeriod[i]+"</p><p>GDP: $"+arrValueGDP[i]+" B</p>")
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY - 100) + "px");
            tooltip.attr('data-date', arrRawDateGDP[i]);
          })
          .on("mouseout", function() {
            tooltip.transition()
                   .duration(300)
                   .style("opacity", 0);
          });
          
    svg.append("text")
       .attr("id", "yAxisText")
       .attr("x", -(height / 2) - margin )
       .attr("y", margin / 2.4 )
       .attr("transform", "rotate(-90)")
       .style("text-anchor", "middle")
       .text("Gross Domestic Product");

    svg.append("text")
       .attr("id", "xAxisText")
       .attr("x", (width / 2) + margin)
       .attr("y", height + (1.5 * margin))
       .style("text-anchor", "middle")
       .text("Years");

       svg.append("text")
       .attr("id", "xAxisSourceText")
       .attr("x", width - 2.2 * margin)
       .attr("y", height + (2 * margin))
       .style("text-anchor", "right")
       .text("Source: "+jsonData.source_name);
});