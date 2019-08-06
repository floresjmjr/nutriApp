//Testing D3 on one type of nutrient first


//Create Vitamins Bar Graph
// Create SVG
var svg = d3.select('#displayFood').append('svg')
  .attr('width', 600)
  .attr('height', 600)
  .attr('id', 'vitamins')

// Create W X H and Margins
const margin = {top: 20, bottom: 50, left: 120, right: 20}
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

// Create Graph Container
const vitaminsBarGraph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Create and adjust tooltip
const tip = d3.tip()
  .html((d)=> `<div>${d.value}${d.unit} (${d.dv}%)</div>`)
  .direction('e')
  .offset([0, 10])
  .style('font-size', '18px')

vitaminsBarGraph.call(tip)

// Request graph data
const request = new XMLHttpRequest();
const rootUrl = window.location.href.split(window.location.pathname)[0];
request.open('GET', rootUrl + `/userTotals`)
request.send()
request.addEventListener('load', (response)=>{
  if(request.status === 200) {
    console.log('raw data', JSON.parse(request.response))
    var data = JSON.parse(request.response).vitamins.sort((a, b)=>{
      var value = 0;
      if (a.dv > b.dv) { value = -1 }
      if (a.dv < b.dv) { value = 1 }
      return value;
    })
    console.log('vitmain data', data)

    // Create scales
    const x = d3.scaleLinear().domain([0, 100]).range([0, graphWidth])
    const y = d3.scaleBand().domain(data.map((d)=> d.name)).range([0, graphHeight])
      .paddingInner(0.2)
      .paddingOuter(0.2);
  
    // Axis groups
    const xAxisGroup = vitaminsBarGraph.append('g')
      .attr('transform', `translate(0, ${graphHeight})`)
    const yAxisGroup = vitaminsBarGraph.append('g')
      // .attr('transform', '
  
    // Create axes
    const xAxis = d3.axisBottom(x)
      .ticks(5)
      .tickFormat((d)=> `${d}%`)
      .tickSize(15);
    const yAxis = d3.axisLeft(y)

  
    //Create the graph
    vitaminsBarGraph.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('height', y.bandwidth)
      .attr('width', 0)
      .attr('fill', (d)=>{
        return d.dv > 100 ? 'seagreen' : 'indianred';
      })
      .attr('x', 3)
      .attr('y', (d)=> y(d.name))
      .transition().duration(1000)
        .attr('width', (d) => {
          return d.dv > 100 ? x(100) : x(d.dv)
        })


    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
  
  // Text adjustments
    svg.selectAll('text')
      .attr('font-size', '14px');

  //Event handlers
  vitaminsBarGraph.selectAll('rect')
    .on('mouseover', (d, i, n) =>{
      tip.show(d, n[i])
      d3.select(n[i]).attr('class', 'barHover')
    })
    .on('mouseleave', (d, i, n) =>{
      d3.select(n[i]).attr('class', '')
      tip.hide();
    })

  
  } else {
    console.log('NO userTotals!')
  }
})