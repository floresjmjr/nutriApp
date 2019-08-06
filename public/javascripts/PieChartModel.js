
// Dataset 
var data = [{name: 'Protein', value: 2, percentage: '20%' },{name: 'Fats', value: 4, percentage: '40%'}, {name: 'Carbohydates', value: 3, percentage: '60%'}];

// Setup SVG
var svg = d3.select('#chart-area').append('svg')  
  .attr('height', 350)
  .attr('width', 300)

// Append Pie Chart Container
var pieChartContainer = svg.append('g').attr('transform', 'translate(150, 200)');

// Create Scale
var scale = d3.scaleOrdinal(d3.schemeSet1)

//  Create pie angles
  var pie = d3.pie().value((d)=> d.value );

// Create general arc 'height' and 'width'  
  var arc = d3.arc()
    .innerRadius(60)
    .outerRadius(120);

// Generate groups
  var arcs = pieChartContainer.selectAll('arc')
    .data(pie(data))
    .enter()
    .append('g')


// Draw arc paths
  arcs.append('path').attr('fill', (d,i,n)=>{
    return scale(i)
  }).attr('d', arc)
  .attr('stroke', 'black')
  .attr('opacity', '.6');

  arcs.append('text')
    .attr('transform', (d)=> `translate(${arc.centroid(d)})`)
    .text((d)=> `${d.data.name}` )
    .style('text-anchor', 'middle')
    .style('font-size', '14px')

  // Setup Legend
  var legend = svg.append('g')
    .attr('transform', 'translate(115, 175)');

  var legendItems = legend.selectAll('legendItem')
    .data(data)
    .enter()
      .append('g')
      .attr('class', 'legendItem')

  legendItems.append('rect')
    .attr('class', 'legendRect')
    .attr('x', 0)
    .attr('y', function (d, i) { return i * 20 })
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', function (d, i) {
      return scale(i)
    })

  legendItems.append('text')
    .attr('class', 'legendText')
    .attr('x', 20)
    .attr('y', function (d, i) { return i * 20 + 10 })
    .text(function (d) {
      return `${d.percentage} (${d.value}g)`;
    })
    .style('font-size', '12px')

