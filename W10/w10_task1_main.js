d3.csv("https://KentaroUchida.github.io/InfoVis2021/W10/data_task1.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:50, right:10, bottom:50, left:150}
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });


class BarChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 512,
            height: config.height || 512,
            margin: config.margin || {top:50, right:10, bottom:50, left:150}
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
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        // Initialize axis scales
        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.1);

        // Initialize axes
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        // Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)

        self.yaxis_group = self.chart.append('g')

        self.chart.append("text")
            .attr("x", self.inner_width / 3.5)
            .attr("y", self.inner_height + self.config.margin.bottom-10)
            .text("minimum wages (dollar)");

        self.chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - self.config.margin.left / 1.5)
            .attr("x", - self.inner_height / 1.85)
            .text("country");

        self.chart.append("text")
            .attr("x", -75 )
            .attr("y", 0 - self.config.margin.top / 2)
            .style("font-size", '16px')
            .style("font-weight", 'bold')
            .text("Minimum wages of countries in the world (dollar)");
    
        
    }

    update() {
        let self = this;

        self.xscale.domain( [0, 5000+parseInt(d3.max(self.data, d=> d.value))] );
        self.yscale.domain(self.data.map(d => d.country));

        self.chart.selectAll("rect").data(self.data)
                .join("rect")
                .transition().duration(1000)
                .attr("x", 0)
                .attr("y", d => self.yscale(d.country))
                .attr("width", d => self.xscale(d.value))
                .attr("height", self.yscale.bandwidth())
                .style("fill", d => d.color);

        self.render();
    }

    render() {
        
        let self = this;

        d3.select('#reverse')
            .on('click', d => {
                self.data.reverse();
                self.update();
            })
        
        d3.select('#descend')
            .on('click', d => {
                self.data.sort((a,b) => d3.descending(a.value,b.value));
                self.update();
            })
        
        d3.select('#ascend')
            .on('click', d => {
                self.data.sort((a,b) => d3.ascending(a.value,b.value));
                self.update();
            })
        
        d3.select('#reset')
            .on('click', d => {
                self.data.sort((a,b) => d3.ascending(a.id,b.id));
                self.update();
            })
        
        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
}
