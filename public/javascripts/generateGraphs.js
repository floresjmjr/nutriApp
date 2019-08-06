

BarGraph = {

  margin: {top: 20, bottom: 50, left: 120, right: 20},
  svgSize: {width: 500, height: 400},
  graphWidth: function(){
    return this.svgSize.width - this.margin.left - this.margin.right;
  },
  
  graphHeight: function(){
    return this.svgSize.height - this.margin.top - this.margin.bottom;
  },

  createSVG: function(name){
    this.svg = d3.select('#overview').append('svg')
    .attr('width', this.svgSize.width)
    .attr('height', this.svgSize.height)
    .attr('id', name + ' chart')
    .attr('viewBox', '0 0 500 400')
  },

  setupBarGraph: function(){
    this.barGraph = this.svg.append('g')
      .attr('width', this.graphWidth())
      .attr('height', this.graphHeight())
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
  },

  loadGraph: function(name, data){
    this.data = data;
    this.createSVG(name);
    this.setupBarGraph();
    this.createAxisGroups()
    this.createScales();
    this.createAxis();
    this.createBarGraph()
    this.xAxisGroup.call(this.xAxis)
    this.yAxisGroup.call(this.yAxis)
    this.textAdjustments()
    this.createTip();
    this.barGraph.call(this.tip)
    this.eventHandlers();
  },

  createAxisGroups: function(){
    this.xAxisGroup = this.barGraph.append('g')
      .attr('transform', `translate(0, ${this.graphHeight()})`)
    this.yAxisGroup = this.barGraph.append('g') 
  },

  createScales: function(){
    this.xScale = d3.scaleLinear().domain([0, 100]).range([0, this.graphWidth()])
    this.yScale = d3.scaleBand().domain(this.data.map((d)=> d.name)).range([0, this.graphHeight()])
      .paddingInner(0.2)
      .paddingOuter(0.2);
  },

  createAxis: function(){
    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(5)
      .tickFormat((d)=> `${d}%`)
      .tickSize(15);
    this.yAxis = d3.axisLeft(this.yScale)
  },

  createBarGraph: function(){
    this.barGraph.selectAll('rect')
    .data(this.data)
    .enter()
    .append('rect')
    .attr('height', this.yScale.bandwidth)
    .attr('width', 0)
    .attr('fill', (d)=> d.dv > 100 ? 'seagreen' : 'indianred')
    .attr('x', 3)
    .attr('y', (d)=> this.yScale(d.name))
    .transition().duration(1000)
      .attr('width', (d) => {
        return d.dv > 100 ? this.xScale(100) : this.xScale(d.dv)
      })
  },

  textAdjustments: function(){
    this.svg.selectAll('text')
    .attr('class', 'svgText')
  },

  createTip: function(){
    this.tip = d3.tip()
      .html((d)=> `<div>${d.value.toFixed(2)} ${d.unit} (${d.dv}%)</div>`)
      .direction('e')
      .offset([0, 10])
      .attr('class', 'svgText')
  },

  eventHandlers: function(){
    this.barGraph.selectAll('rect')
    .on('mouseover', (d, i, n) =>{
      this.tip.show(d, n[i])
      d3.select(n[i]).attr('class', 'barHover')
    })
    .on('mouseleave', (d, i, n) =>{
      d3.select(n[i]).attr('class', '')
      this.tip.hide();
    })
  },

}

PieChart = {

  svgSize: { width: 450, height: 300 },
  chartSize: { innerRadius: 20, outerRadius: 120 },
  legendPosition: {x: 280, y: 70},
  legendSize: {width: 15, height: 15},

  createSVG: function(name) {
    this.svg = d3.select('#overview')
      .append('svg')
      .attr('height', this.svgSize.height)
      .attr('width', this.svgSize.width)
      .attr('id', name + ' chart')
      .attr('viewBox', '0 0 450 300')
  },

  createChartContainer: function() {
    this.chartContainer = this.svg.append('g')
      .attr('transform', `translate(${this.svgSize.width/2 - 100}, ${this.svgSize.height/2})`)
  },

  createScale: function() {
    this.scale = d3.scaleOrdinal(d3.schemeSet1);
  },

  createAngles: function() {
    this.pie = d3.pie().value((d)=> d.value);
  },

  setupArcs: function() {
    this.arc = d3.arc()
      .innerRadius(this.chartSize.innerRadius)
      .outerRadius(this.chartSize.outerRadius)
  },

  createArcs: function() {
    this.arcs = this.chartContainer.selectAll('arc')
      .data(this.pie(this.data))
      .enter()
      .append('g')
  },

  createPaths: function() {
    this.arcs.append('path')
      .attr('fill', (d, i)=> this.scale(i))
      .attr('d', this.arc)
      .attr('stroke', 'black')
      .attr('opacity', '.6')
  },

  createArcTexts: function() {
    this.arcs.append('text')
      .attr('transform', (d)=> `translate(${this.arc.centroid(d)})`)
      .text((d)=> d.data.name)
      .style('text-anchor', 'middle')
      .attr('class', 'svgText')
  },

  createLegend: function() {
    this.legendContainer = this.svg.append('g')
      .attr('transform', `translate(${this.legendPosition.x}, ${this.legendPosition.y})`)
  },

  addLegendItems: function() {
    this.legendItems = this.legendContainer.selectAll('legendItem')
      .data(this.data)
      .enter()
        .append('g')
        .attr('class', 'legendItem')
  },

  addLegendIdentifiers: function() {
    this.legendItems.append('rect')
      .attr('class', 'legendRect')
      .attr('x', 0)
      .attr('y', (d, i)=> i * (this.legendSize.height*2) - 15)
      .attr('width', this.legendSize.width)
      .attr('height', this.legendSize.height)
      .attr('fill', (d, i)=> this.scale(i))
      .attr('stroke', 'black')
      .attr('opacity', '.6')
  },

  addLegendText: function() {
    this.legendItems.append('text')
      .attr('x', 30)
      .attr('y', (d, i)=> i * (this.legendSize.height*2))
      .text((d)=> `${d.percentage}% ( ${d.value}g )`)
      .attr('class', 'svgText')
  },

  loadChart: function(name, data) {
    this.data = data;
    this.createSVG(name);
    this.createChartContainer();
    this.createScale();
    this.createAngles();
    this.setupArcs();
    this.createArcs();
    this.createPaths();
    this.createArcTexts();
    this.createLegend();
    this.addLegendItems();
    this.addLegendIdentifiers();
    this.addLegendText();
    this.addLegendText();
  },


}


if(window.location.pathname === '/analysis') {
  const request = new XMLHttpRequest();
  const rootUrl = window.location.href.split(window.location.pathname)[0];
  request.open('GET', rootUrl + `/userTotals`)
  request.send()
  request.addEventListener('load', (response)=>{
    if(request.status === 200) {
      const data = JSON.parse(request.response);

      // Load Pie Chart - Macronutrients
      PieChart.loadChart('macros', data.macros)
      console.log(data)

      // Load Bar Charts - Micronutrients
      const barCategories = ['vitamins', 'minerals'];
      barCategories.forEach((graphName)=>{

        // Sort Data
        const sortedData = data[graphName].sort((a, b)=>{
          let value = 0;
          if (a.dv > b.dv) { value = -1 }
          if (a.dv < b.dv) { value = 1 }
          return value;
        })
        BarGraph.loadGraph(graphName, sortedData)
      })
    } else {
      console.log('no data!')
    }
  })
}




