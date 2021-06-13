class BarChartCypress {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleBand()
            .range([0, self.inner_width])
            .paddingInner(0.2)
            .paddingOuter(0.1);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const xlabel_space = 50;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 50;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
        
        self.brush = d3.brushX()
            .extent([[0, 0], [self.inner_width,self.inner_height]])
            .on("brush", self.brushed);

    }


    update() {

        let self = this;

        self.xvalue = d => d.date;
        self.yvalue = d => d.cypress;

        const xmin = d3.min( self.data, self.xvalue );
        const xmax = d3.max( self.data, self.xvalue );
        self.xscale.domain( self.data.map(d => d.date) );

        const ymin = d3.min( self.data, self.yvalue );
        const ymax = d3.max( self.data, self.yvalue );
        self.yscale.domain( [ymin, ymax] );

        self.render();
    }

    render() {
        let self = this;
        
        self.chart.selectAll(".bar")
            .data(self.data)
            .join("rect")
            .attr("class", "bar")
            .transition().duration(1000)
            .attr("x", d => self.xscale( self.xvalue(d) ) )
            .attr("y", d => self.yscale( self.yvalue(d) ) )
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.inner_height - self.yscale( self.yvalue(d) ))
            .attr("fill", "orange" );

        self.xaxis_group
            .call(self.xaxis)
            .selectAll("text")
            .attr("x", "0")
            .attr("y", "1")
            .attr("text-anchor", "end")
            .attr("font-family", "Tazugane Info Std N")
            .attr("font-weight", 300)
            .attr("font-size", "8px")
            .attr("x", "-1")
            .attr("y", "1")
            .attr("transform", "rotate(-60)");

        
        self.yaxis_group
            .call(self.yaxis);

        const gb = self.chart.append("g") //brushグループを作成
            .attr("class", "x brush")
            .call(self.brush)
            .call(self.brush.clear);

        d3.select('#descend2')
            .on('click', d => {
                gb.call(self.brush.clear);
                self.data.sort((a,b) => d3.descending(a.cypress,b.cypress));
                self.update();
                scatter_plot_cypress.update(self.brush.selection);
                scatter_plot_cypress_sun.update(self.brush.selection);
            })

        d3.select('#reset2')
            .on('click', d => {
                gb.call(self.brush.clear);
                self.data.sort((a,b) => {return a.id-b.id; });
                self.update();
                scatter_plot_cypress.update(self.brush.selection);
                scatter_plot_cypress_sun.update(self.brush.selection);
            })

    }

    brushed({selection}) {
        let self = this;
        if(selection){
            scatter_plot_cypress.update(selection);
            scatter_plot_cypress_sun.update(selection);
        }
    }

}

