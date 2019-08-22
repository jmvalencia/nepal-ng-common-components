/*
 *
 */
export const BASE_CONFIG: any = {
    chart: {
        type: 'solidgauge',
        height: '75%',
        styledMode: true
    },
    title: {
        text: '',
    },

    pane: {
        startAngle: 360,
        endAngle: 0,
        background: [{
            outerRadius: '112%',
            innerRadius: '95%',
            backgroundColor: '',
            borderWidth: 0
        }]
    },

    credits: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
    },

    plotOptions: {
        solidgauge: {
            linecap: 'round',
            stickyTracking: false,
            rounded: true,
            dataLabels: {
                enabled: true,
                y: -40,
                borderWidth: 0,
                backgroundColor: 'none',
                useHTML: true,
                shadow: false,
                formatter: null
            },
        }
    },

    series: [{
        name: 'Move',
        data: [{
            className: '',
            radius: '112%',
            innerRadius: '95%',
            y: 80
        }]
    }]
};
