export class CalendarItem {

    readonly id: string;
    date?: Date;
    duration: number;
    title: string;
    description: string;

    constructor(id: string, date?: Date) {
        this.id = id;
        this.date = date;
    }

    compare(target: Date): boolean {
        if (this.date instanceof Date) {
            let current = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
            let isMatch = new Date(target.getFullYear(), target.getMonth(), target.getDate());
            return (current.getTime() === isMatch.getTime());
        } else {
            return false;
        }
    }

    getCalendarDate(): number {
        if (this.date) {
            let current = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
            return current.getTime();
        }

        return -1;
    }
}