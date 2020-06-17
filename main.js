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