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
})
