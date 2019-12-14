import items = require("calendar-item")

export class Calendar {

    readonly months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    readonly days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // events
    readonly onChange: any;
    readonly onClick: any;

    disabledDays: Array<number>;
    element: HTMLElement
    today: any;

    // months
    selected: any;
    previous: any;
    next: Date;

    model: Array<items.CalendarItem>;

    constructor(element: HTMLElement, options?: any) {
        this.element = element;
        this.today = new Date();
        this.today.Month = this.today.getMonth();
        this.today.Year = this.today.getFullYear();

        this.onChange = options.onChange;
        this.onClick = options.onClick;
    }

    public render(selected?: Date, today?: Date) {
        this.element.innerHTML = "";

        if (today) {
            this.today = today;
            this.today.Month = this.today.getMonth();
            this.today.Year = this.today.getFullYear();
        }

        this.selected = selected ? selected : this.today;
        this.selected.Month = this.selected.getMonth();
        this.selected.Year = this.selected.getFullYear();
        this.selected.Days = new Date(this.selected.Year, (this.selected.Month + 1), 0).getDate();
        this.selected.FirstDay = new Date(this.selected.Year, (this.selected.Month), 1).getDay();
        this.selected.LastDay = new Date(this.selected.Year, (this.selected.Month + 1), 0).getDay();

        this.previous = new Date(this.selected.Year, (this.selected.Month - 1), 1);
        if (this.selected.Month == 0) { this.previous = new Date(this.selected.Year - 1, 11, 1); }
        this.previous.Days = new Date(this.previous.getFullYear(), (this.previous.getMonth() + 1), 0).getDate();

        this.next = new Date(this.selected.Year, (this.selected.Month + 1), 1);
        if (this.selected.Month == 11) { this.next = new Date(this.selected.Year + 1, 0, 1); }

        let mainSection = document.createElement("div");
        mainSection.classList.add("calendar-main");
        this.element.appendChild(mainSection);

        this._addDateTimeHeader(mainSection);
        this._addDaysOfWeek(mainSection);
        this._addDays(mainSection);
    }


    private _addDateTimeHeader(parent: HTMLElement) {
        let that = this;
        let dateheader = document.createElement("div");
        dateheader.classList.add("calendar-dateheader");
        let previous = document.createElement("div");
        previous.classList.add("calendar-previous")
        previous.classList.add("calendar-nav")

        previous.addEventListener("click", function () { that.render(that.previous); });

        if (this.onChange) {
            previous.addEventListener("click", function () { that.onChange(that.selected); });
        }
        previous.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,50 75,0 75,100"></polyline></svg>';
        dateheader.appendChild(previous);

        let today = document.createElement("div");
        today.classList.add("calendar-today");
        today.innerHTML = this.months[this.selected.Month] + ", " + this.selected.Year;
        dateheader.appendChild(today);

        let next = document.createElement("div");
        next.classList.add("calendar-next");
        next.classList.add("calendar-nav");
        next.addEventListener("click", function () { that.render(that.next); });
        if (this.onChange) {
            next.addEventListener("click", function () { that.onChange(that.selected); });
        }
        next.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,0 75,50 0,100"></polyline></svg>';
        dateheader.appendChild(next);
        parent.appendChild(dateheader);
    }


    private _addDaysOfWeek(parent: HTMLElement) {
        let daysOfWeek = document.createElement("ul");
        daysOfWeek.classList.add("calendar-daysofweek");
        for (let i = 0; i < this.days.length; i++) {
            let dow = document.createElement("li");
            dow.classList.add("calendar-dayofweek");
            dow.innerHTML = this.days[i];
            daysOfWeek.appendChild(dow);
        }
        parent.appendChild(daysOfWeek);
    }


    private _addDays(parent: HTMLElement) {
        let that = this;

        // Create Number Element
        function DayNumber(n: number) {
            let number = document.createElement("p");
            number.classList.add("calendar-number");
            number.innerHTML += n;
            return number;
        }

        let days = document.createElement("ul");
        days.classList.add("calendar-days");

        // Previous Month
        for (let i = 0; i < (this.selected.FirstDay); i++) {
            let day = document.createElement("li");
            day.classList.add("calendar-day");
            day.classList.add("calendar-previous-month");

            let number = DayNumber((this.previous.Days - this.selected.FirstDay) + (i + 1));
            day.appendChild(number);
            days.appendChild(day);
        }

        // count events per day
        let eventDayCounts: any = {};
        if (this.model) {
            for (let n = 0; n < this.model.length; n++) {

                let evDate = this.model[n].getCalendarDate();
                if (eventDayCounts[evDate] == null) {
                    eventDayCounts[evDate] = 1;
                } else {
                    eventDayCounts[evDate]++;
                }
            }
        }


        // Current Month
        for (let i = 0; i < this.selected.Days; i++) {
            let disabled = false;
            let day = document.createElement("li");
            day.classList.add("calendar-day");
            day.classList.add("currMonth");

            // Disabled Days
            let d = (i + this.selected.FirstDay) % 7;
            if (this.disabledDays) {
                for (let q = 0; q < this.disabledDays.length; q++) {
                    if (d == this.disabledDays[q]) {
                        disabled = true;
                        day.classList.add("disabled-day");
                    }
                }
            }

            if (!disabled) {
                day.classList.add("clickable");
                let thisDate = new Date(this.selected.Year, this.selected.Month, i + 1);
                day.addEventListener("click", function () { that.onClick(thisDate, that.model.filter((item) => { return item.compare(thisDate) })) });
            }

            let number = DayNumber(i + 1);

            let checkDate = (new Date(this.selected.Year, this.selected.Month, (i + 1))).getTime();
            if (eventDayCounts[checkDate] != null) {
                var counter = document.createElement("span");
                counter.innerText = eventDayCounts[checkDate];

                if ((i + 1) == this.today.getDate() && this.selected.Month == this.today.Month && this.selected.Year == this.today.Year) {
                    // today
                    counter.classList.add("calendar-event-count-inverted");
                } else {
                    // not today
                    counter.classList.add("calendar-event-count");
                }

                number.appendChild(counter);
            }

            day.appendChild(number);

            // Today
            if ((i + 1) == this.today.getDate() && this.selected.Month == this.today.Month && this.selected.Year == this.today.Year) {
                day.classList.add("calendar-today");
            }
            days.appendChild(day);
        }

        // Next Month
        // There are always same # of day cells displayed
        let extraDays = 13;
        if (days.children.length > 35) { extraDays = 6; }
        else if (days.children.length < 29) { extraDays = 20; }

        for (let i = 0; i < (extraDays - this.selected.LastDay); i++) {
            let day = document.createElement("li");
            day.classList.add("calendar-day");
            day.classList.add("calendar-next-month");
            let number = DayNumber(i + 1);
            day.appendChild(number);
            days.appendChild(day);
        }

        parent.appendChild(days);
    }
}




