$(document).ready(function(e) {
    $("#fixHeader").load("/header");
});

document.addEventListener('DOMContentLoaded', /*async*/ function() {
    let todayDate = new Date();
    let calendarEl = document.getElementById('calendar');

    let dbLen = document.getElementById('len').innerHTML;
    let result = [];
    let dbTitle = [];
    let dbDate = [];

    for(let i = 0; i < parseInt(dbLen); i++){
        dbTitle.push(document.getElementById(i+'title').innerHTML);
        dbDate.push(document.getElementById(i+'date').innerHTML);
        result.push({ "title" : dbTitle[i], "start" : dbDate[i] });
    }

    let calendar = new FullCalendar.Calendar(calendarEl, {
        
        plugins: [ 'interaction', 'dayGrid', 'timeGrid' ],
        header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth'
        },
        defaultDate: todayDate,
        navLinks: false, // can click day/week names to navigate views
        businessHours: true, // display business hours
        editable: false,
        events: result,
    });
    calendar.render();
});