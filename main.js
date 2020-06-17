const occupations = []

d3.csv("data/jobs.csv", function(error, data) {
    data.forEach(datum => {
        const values = Object.values(datum)
        let employed = 0
        for (let i=3; i<values.length; i++) {
            employed += parseFloat(values[i])
        }
        occupations.push({
            job: datum.Occupation,
            probability: datum.Probability,
            employed: employed
        })
    })
    let filteredOccupations = occupations.filter(obj => obj.employed > 0)
    filteredOccupations.sort((a,b) => a.employed - b.employed)
    console.log('occupations after sort: ', filteredOccupations)

    let height = 1200;
    let width = 1500;

    var tooltip = d3.select("#chart")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html(
          "Occupation: " + d.job +
          "Peopled employed : " + d.employed + 
          "Probability of automation : " + d.probability
      )
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }

  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")

    let radiusScale = d3.scaleSqrt().domain([30, 4528570]).range([5, 50])
    
    var circles = svg.selectAll(".occupation")
        .data(filteredOccupations)
        .enter().append("circle")
        .attr("class", "artist")
        .attr("r", function(d) {
            return radiusScale(d.employed)
        })
        .attr("fill", "#eceaea")
        .attr("stroke", "grey")
        // -3- Trigger the functions for hover
        .on("mouseover", showTooltip )
        // .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )
    // the simulation is a collection of forces about where we want our circles to go and how we want them to interact
    const simulation = d3.forceSimulation()
        .force("x", d3.forceX(width).strength(0.01))
        .force("y", d3.forceY(height).strength(0.01))
        .force("collide", d3.forceCollide(function(d) {
            return radiusScale(d.employed) + 3
        }))

    simulation.nodes(filteredOccupations)
        .on('tick', ticked)
        
    function ticked() {
        circles
            .attr("cx", function(d) {
                return d.x
            })
            .attr("cy", function(d) {
                return d.y
            })
    }
})