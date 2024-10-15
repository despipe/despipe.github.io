// EJEMPLO BASE line chart 

var RioAconcagua = {
    x: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,2011,2012,2013,2014,2015,2016,2017,2018],
    y: [40.1552381, 29.64009901, 53.443372093, 16.27638889, 30.27453704, 35.82314815, 32.72175926, 14.57972222, 34.09305556, 21.91944444, 19.45324074, 14.96805556, 23.97162791, 12.99581395, 15.55138889, 23.44929245, 29.2204878, 27.05725, 15.43654822],
    mode: 'lines',
    type: 'scatter',
    marker: {color: '#38b6ff'}
};

var RioMaipo = {
    x: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,2011,2012,2013,2014,2015,2016,2017,2018],
    y: [51.3137466, 38.3698925, 61.5202156, 23.1591398, 34.5599462, 50.4916667, 36.5070652, 17.8691257, 40.6983651, 28.7440443, 23.8528455, 17.3313514, 28.0718817, 18.3678474, 21.7005435, 27.326158, 30.5486154, 29.9462447, 17.9137594],
    mode: 'lines',
    type: 'scatter',
    marker: {color:  '#db92c6'}
};

var RioMaule = {
    x: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,2011,2012,2013,2014,2015,2016,2017,2018], 
    y: [104.7132251, 117.3062771, 145.5622642, 67.33158996, 89.56520833, 125.2256303, 113.3513684, 54.87337526, 100.1846639, 87.02903564, 60.51099366, 81.10762004, 71.16271186, 62.52127349, 87.27704403, 84.36246347, 54.92126685, 92.08190709, 48.63527638],
    mode: 'line',
    type: 'scatter',
    marker: {color: '#9b6336'}
};

var RioBioBio = {
    x: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,2011,2012,2013,2014,2015,2016,2017,2018], 
    y: [139.5982063, 145.7546559, 175.3664122, 108.7594697, 120.7572519, 147.9370229, 150.9394422, 87.23793103, 121.2526923, 142.0131274, 103.4940239, 115.0796813, 104.8744, 92.40040161, 137.5953061, 113.426556, 88.24575472, 121.4589623, 122.2029289],
    marker: {color:  '#0a8449'},
    mode: 'line',
    type: 'scatter'
};

var data = [RioAconcagua, RioMaipo, RioMaule, RioBioBio];

var layout = {
    title: 'Promedio de precipitaciones mensuales por año',
    xaxis: { title: 'Año' },
    yaxis: { title: 'mm' },
    showlegend: false,
    autosize: true,
    
};

var config = {responsive: true};

Plotly.newPlot('linechart 1', data, layout, config);