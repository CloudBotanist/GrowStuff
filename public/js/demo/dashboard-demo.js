

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
        barColor: "rgba(255,255,255,.5)",
        trackColor: "rgba(255,255,255,.5)",
        scaleColor: "rgba(255,255,255,.5)",
        lineWidth: 20,
        animate: 1500,
        size: 175,
        onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });

    //Morris Area Chart
    console.log(plantStatus);
    var sales_data = new Array();
    for(i=0; i < plantStatus.length; i++){
        sales_data[i] = {
            date: plantStatus[i].created.split(".")[0].replace("T"," "),
            hum: plantStatus[i].hum};
    }
    
    Morris.Area({
        element: 'morris-chart-dashboard',
        data: sales_data,
        xkey: 'date',
        xLabelFormat: function(date) {
            return (d.getHours() + ":"+ d.getMinutes() + ":" +d.getSeconds());
        },
        xLabels: 'day',
        ykeys: ['hum',],
        yLabelFormat: function(y) {
            return y;
        },
        labels: ['Humidity'],
        lineColors: ['#fff'],
        hideHover: 'auto',
        resize: true,
        gridTextFamily: ['Open Sans'],
        gridTextColor: ['rgba(255,255,255,0.7)'],
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
});