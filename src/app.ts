import model = require("calendar")
import events = require("calendar-item");

// target element
const element = document.getElementById("calendar") || document.body;

const calendar = new model.Calendar(element, {
    onChange: function (date: Date) {

        // month changed
        console.log(date.toString());
    },
    onClick: function (date: Date, items: events.CalendarItem[]) {

        // day clicked
        console.log("you clicked " + date.toString() + " which has " + items?.length + " item(s)");
        for (let i = 0; i < items?.length; i++) {
            console.log("item " + items[i].id + " with description '" + items[i].description + "' and a duration of " + items[i].duration + " minute(s)");
        }
    }
});

// disable weekends
calendar.disabledDays = [0, 6];

function daysInMonth(year: number, month: number): number {
    if (month == 11) {
        return new Date(year + 1, 0, 0).getDate();
    }

    return new Date(year, month + 1, 0).getDate();
}

// add some events (use current month)
const items = [];
const calendarDate = new Date();
const year = calendarDate.getFullYear();
const month = calendarDate.getMonth();
const maxDays = daysInMonth(year, month);

for (let i = 0; i < 10; i++) {
    let item = new events.CalendarItem("id_" + i, new Date(year, month, Math.floor(Math.random() * maxDays + 1)));
    item.description = item.id + " description";
    item.duration = Math.floor(Math.random() * 60 + 1);
    items.push(item);
}
calendar.model = items;

// render December 2019 and make the 25th Today
calendar.render(new Date(2019, 11, 1), new Date(2019, 11, 25));
