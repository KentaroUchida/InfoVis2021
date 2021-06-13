let input_data;
let scatter_plot;
let bar_chart;
let filter = [];

d3.csv("https://kentarouchida.github.io/InfoVis2021/FinalTask/final_task_data.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.rain = +d.rain;
            d.sun = +d.sun;
            d.cedar = +d.cedar;
            d.cypress = +d.cypress;
        });
        
        bar_chart_cedar = new BarChartCedar( {
            parent: '#drawing_region_barchart_cedar',
            width: 650,
            height: 270,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'date',
            ylabel: 'Amount of cedar pollen dispersed [/cm^2]',
        }, input_data );
        bar_chart_cedar.update();

        scatter_plot_cedar_rain = new ScatterPlotCedarRain( {
            parent: '#drawing_region_scatterplot_cedar_rain',
            width: 270,
            height: 270,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Precipitation [mm]',
        }, input_data );
        scatter_plot_cedar_rain.update("");

        scatter_plot_cedar_sun = new ScatterPlotCedarSun( {
            parent: '#drawing_region_scatterplot_cedar_sun',
            width: 270,
            height: 270,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Daylight hours',
        }, input_data );
        scatter_plot_cedar_sun.update("");

        bar_chart_cypress = new BarChartCypress( {
            parent: '#drawing_region_barchart_cypress',
            width: 650,
            height: 270,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'date',
            ylabel: 'Amount of cypress pollen dispersed [/cm^2]',
        }, input_data );
        bar_chart_cypress.update();

        scatter_plot_cypress_rain = new ScatterPlotCypressRain( {
            parent: '#drawing_region_scatterplot_cypress_rain',
            width: 270,
            height: 270,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Precipitation [mm]',
        }, input_data );
        scatter_plot_cypress_rain.update("");

        scatter_plot_cypress_sun = new ScatterPlotCypressSun( {
            parent: '#drawing_region_scatterplot_cypress_sun',
            width: 270,
            height: 270,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Daylight hours',
        }, input_data );
        scatter_plot_cypress_sun.update("");
        
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatter_plot.update();
}
