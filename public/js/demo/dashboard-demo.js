

//Chat Widget SlimScroll Box
$(function() {
    $('.chat-widget').slimScroll({
        start: 'bottom',
        height: '300px',
        alwaysVisible: true,
        disableFadeOut: true,
        touchScrollStep: 50
    });
});


//Custom jQuery - Changes background on time tile based on the time of day.
$(document).ready(function() {
    datetoday = new Date(); // create new Date()
    timenow = datetoday.getTime(); // grabbing the time it is now
    datetoday.setTime(timenow); // setting the time now to datetoday variable
    hournow = datetoday.getHours(); //the hour it is

    if (hournow >= 18) // if it is after 6pm
        $('div.tile-img').addClass('evening');
    else if (hournow >= 12) // if it is after 12pm
        $('div.tile-img').addClass('afternoon');
    else if (hournow >= 6) // if it is after 6am
        $('div.tile-img').addClass('morning');
    else if (hournow >= 0) // if it is after midnight
        $('div.tile-img').addClass('midnight');
});


//Easy Pie Charts
$(document).ready(function() {
    $('#easy-pie-1').easyPieChart({
        barColor: "rgba(40,159,139,.5)",
        trackColor: "rgba(40,159,139,.5)",
        scaleColor: "rgba(40,159,139,.5)",
        lineWidth: 20,
        animate: 1500,
        size: 175,
        onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });

    //Morris Area Chart
    var hum_data = new Array();
    var temp_data = new Array();
    var light_data = new Array();
    console.log(plantStatus);
    for(i=0; i < plantStatus.length; i++){
        hum_data[i] = {
            date: plantStatus[i].created.split(".")[0].replace("T"," "),
            val: plantStatus[i].hum
        };
        temp_data[i] = {
            date: plantStatus[i].created.split(".")[0].replace("T"," "),
            val: plantStatus[i].tmp
        };
        light_data[i] = {
            date: plantStatus[i].created.split(".")[0].replace("T"," "),
            val: plantStatus[i].light
        };
    }
    console.log(hum_data);
    console.log(temp_data);
    console.log(light_data);

    temp_chart = Morris.Area({
        element: 'morris-chart-temperature',
        data: temp_data,
        xkey: 'date',
        xLabelFormat: function(date) {
            return (d.getHours() + ":"+ d.getMinutes() + ":" +d.getSeconds());
        },
        xLabels: 'day',
        ykeys: ['val'],
        yLabelFormat: function(y) {
            return y;
        },
        labels: ['Temperature'],
        lineColors: ['#289F8B'],
        hideHover: 'auto',
        resize: true,
        gridTextFamily: ['Open Sans'],
        gridTextColor: ['#289F8B'],
        fillOpacity: 0.1,
        pointSize: 0,
        smooth: true,
        lineWidth: 2,
        grid: true,
        dateFormat: function(date) {
            d = new Date(date);
            return (d.getHours() + ":"+ d.getMinutes() + ":" +d.getSeconds());
        }
    });

    hum_chart = Morris.Area({
        element: 'morris-chart-humidity',
        data: hum_data,
        xkey: 'date',
        xLabelFormat: function(date) {
            return (d.getHours() + ":"+ d.getMinutes() + ":" +d.getSeconds());
        },
        xLabels: 'day',
        ykeys: ['val'],
        yLabelFormat: function(y) {
            return y;
        },
        labels: ['Humidity'],
        lineColors: ['#289F8B'],
        hideHover: 'auto',
        resize: true,
        gridTextFamily: ['Open Sans'],
        gridTextColor: ['#289F8B'],
        fillOpacity: 0.1,
        pointSize: 0,
        smooth: true,
        lineWidth: 2,
        grid: true,
        dateFormat: function(date) {
            d = new Date(date);
            return (d.getHours() + ":"+ d.getMinutes() + ":" +d.getSeconds());
        }
    });
    light_chart = Morris.Area({
        element: 'morris-chart-brightness',
        data: light_data,
        xkey: 'date',
        xLabelFormat: function(date) {
            return (d.getHours() + ":"+ d.getMinutes() + ":" +d.getSeconds());
        },
        xLabels: 'day',
        ykeys: ['val'],
        yLabelFormat: function(y) {
            return y;
        },
        labels: ['Brightness'],
        lineColors: ['#289F8B'],
        hideHover: 'auto',
        resize: true,
        gridTextFamily: ['Open Sans'],
        gridTextColor: ['#289F8B'],
        fillOpacity: 0.1,
        pointSize: 0,
        smooth: true,
        lineWidth: 2,
        grid: true,
        dateFormat: function(date) {
            d = new Date(date);
            return (d.getHours() + ":"+ d.getMinutes() + ":" +d.getSeconds());
        }
    });
    $('ul.nav a').on('shown.bs.tab', function (e) {
        var types = "light_chart, hum_chart,temp_chart";
        var typesArray = types.split(",");
        $.each(typesArray, function (key, value) {
            eval(value + ".redraw()");
        })
    });
});