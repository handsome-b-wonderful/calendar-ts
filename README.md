# TypeScript Calendar Control

A light-weight, simple calendar library used in the Marigold relationship management application.


## Using the Calendar

Define the target element where the calendar will be rendered

```TypeScript
const element = document.getElementById("calendar") || document.body;
```

Add the functions to be called on events

```TypeScript
const calendar = new model.Calendar(element, {
    onChange: function (date: Date) {
        
        // called after the month is changed.
        console.log(date.toString());
    },
    onClick: function (date: Date, items: events.CalendarItem[]) {

        // called when a non-disabled day is clicked - you get an array of this day's events
        console.log("you clicked " + date.toString() + " which has " + items?.length + " item(s)");
    }
});

```

Disable days (optional)

```TypeScript
// disable weekends (Sunday = 0, etc.)
calendar.disabledDays = [0, 6];
```

Add events

```TypeScript
// add some events for Decemeber
const items = [];
for (let i = 0; i < 10; i++) {
    let item = new events.CalendarItem("id_" + i, new Date(2019, 11, Math.floor(Math.random() * 31 + 1)));
    item.description = item.id + " description";
    item.duration = Math.floor(Math.random() * 60 + 1);
    items.push(item);
}
calendar.model = items;
```

Update any styles in `css/calendar.css`

Display the calendar, optionally setting the displayed month (default: current month) and today (default: current day)

```TypeScript
// render December 2019 and make the 25th Today
calendar.render(new Date(2019, 11, 1), new Date(2019, 11, 25));
```

![calendar example](doc/img/calendar-ts-screenshot.png)


## Notes

* Calendar events are instances of the `CalendarItem` class.
* You can define all of your events up front or load them on demand for each month in your `onChange` function.
* The calendar uses `require.js` for module support (add to the lib folder or update your deployment accordingly).


## TODO's

* Highlight the current (clicked) day
* Add a wait/loading indicator for use during data retrieval
* Add configuration options and events as required
* Refactor towards idiomatic TypeScript
