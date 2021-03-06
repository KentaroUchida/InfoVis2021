d3.csv("https://KentaroUchida.github.io/InfoVis2021/W10/data_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            padding: 10,
            margin: {top:100, right:100, bottom:100, left:100}
        };

        const line_chart = new LineChart( config, data );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class LineChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 512,
            height: config.height || 512,
            padding: config.padding || 10,
            margin: config.margin || {top:100, right:100, bottom:100, left:100}
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

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        
        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);

        self.line = d3.line()
            .x( d => self.xscale(d.x) )
            .y( d => self.yscale(d.y) );

        self.area = d3.area()
            .x( d => self.xscale( d.x ) )
            .y1( d => self.yscale( d.y ) )
            .y0( self.yscale(0) );

        self.chart.append("text")
            .attr("x", 175)
            .attr("y", -20)
            .attr("dy", "-18px")
            .text("Test data")
            .attr("font-size", "30px")
            .attr('text-anchor', "middle");

            self.chart.append("text")
            .attr("x", 175)
            .attr("y", 390)
            .attr("dy", "-18px")
            .text("X-label")
            .attr("font-size", "15px")
            .attr('text-anchor', "middle");

            self.chart.append("text")
            .attr("x", -150)
            .attr("y", -40)
            .attr("dy", "-18px")
            .attr("transform", "rotate(-90)")
            .text("Y-label")
            .attr("font-size", "15px")
            .attr('text-anchor', "middle");

    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        
        self.xscale.domain( [0, Math.max(xmax,ymax)+10] );
        self.yscale.domain( [0, Math.max(xmax,ymax)+10] );

        self.chart.append('path')
            .attr('d', self.area(self.data))
            .attr('stroke', 'gray')
            .attr('fill', 'lightgray');
        
        self.circles = self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle");
        
        self.circles
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.label}</div>(${d.x}, ${d.y})`);
                self.render(d.label);
            })
            .on('mousemove', (e) => {
                d3.select('#tooltip')
                    .style('left', (e.pageX + self.config.padding) + 'px')
                    .style('top', (e.pageY + self.config.padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
                self.render("");
            });

        self.render("");
    }

    render(colorlabel) {
        let self = this;

        self.circles
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .style("fill", d => {
                if (d.label == colorlabel ){ return "red"; }
                return d.color;
            });

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
}
