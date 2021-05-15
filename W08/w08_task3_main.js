d3.csv("https://KentaroUchida.github.io/InfoVis2021/W08/data_task3.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:30, right:10, bottom:50, left:30},
            radius: 150
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class PieChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 512,
            height: config.height || 512,
            margin: config.margin || {top:30, right:10, bottom:50, left:30},
            radius: config.radius || 150
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.pie = d3.pie()
            .value( d => d.value );
        
        self.arc = d3.arc()
            .innerRadius(self.config.radius/3)
            .outerRadius(self.config.radius);
      
        self.svg.append("text")
            .attr("x", 110 )
            .attr("y", 50)
            .style("font-size", '16px')
            .style("font-weight", 'bold')
            .text("Average sleep time for Japanese");
    }

    update() {
        let self = this;

        self.render();
    }

    render() {
        let self = this;

        // Draw pie
        self.chart.selectAll('pie')
            .data( self.pie(self.data) )
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('fill', 'gray')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');
        self.chart.selectAll('text')
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .attr("fill", "black")
            .attr("transform", d => "translate(" + self.arc.centroid(d) + ")")
            .attr("dy", "5px")
            .attr("font", "10px")
            .attr("text-anchor", "middle")
            .text(d => d.data.label);
    }
}
