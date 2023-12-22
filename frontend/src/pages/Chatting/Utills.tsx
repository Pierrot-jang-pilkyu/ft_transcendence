

// time
let today: any = new Date();

export function timeStamp(flag: any) {
    let res: string = " ";

    if (flag === 1) {
        res += today.getFullYear() + ".";
        if (today.getMonth() + 1 < 10) res += "0" + (today.getMonth() + 1) + ".";
        else res += today.getMonth() + 1 + ".";

        if (today.getDate() < 10) res += "0" + today.getDate() + " ";
        else res += today.getDate() + " ";

        const day: string[] = [
            "",
            "Mon.",
            "Tue.",
            "Wed.",
            "Thu.",
            "Fri.",
            "Sat.",
            "Sun.",
        ];

        res += day[today.getDay()] + " ";

        return res;
    }

    if (today.getHours() < 10) res += "0" + today.getHours() + ":";
    else res += today.getHours() + ":";

    if (today.getMinutes() < 10) res += "0" + today.getMinutes();
    else res += today.getMinutes();

    return res;
};

export function timeStamp_this(flag: any, date: string) {
    let res: string = " ";
    let thisDay: any = new Date(
        parseInt(date.substring(0, 4)), // year
        parseInt(date.substring(5, 7)) - 1, // month
        parseInt(date.substring(8, 10)), // day
        parseInt(date.substring(11, 13)), // hours
        parseInt(date.substring(14, 16)), // minute
        parseInt(date.substring(17, 19)), // seconds
        parseInt(date.substring(20, 23)) // milliseconds
    );

    if (flag === 1) {
        res += thisDay.getFullYear() + ".";
        if (thisDay.getMonth() + 1 < 10)
            res += "0" + (thisDay.getMonth() + 1) + ".";
        else res += thisDay.getMonth() + 1 + ".";

        if (thisDay.getDate() + 1 < 10) res += "0" + thisDay.getDate() + " ";
        else res += thisDay.getDate() + " ";

        const day: string[] = [
            "",
            "Mon.",
            "Tue.",
            "Wed.",
            "Thu.",
            "Fri.",
            "Sat.",
            "Sun.",
        ];

        res += day[thisDay.getDay()] + " ";

        return res;
    }

    if (thisDay.getHours() < 10) res += "0" + thisDay.getHours() + ":";
    else res += thisDay.getHours() + ":";

    if (thisDay.getMinutes() < 10) res += "0" + thisDay.getMinutes();
    else res += thisDay.getMinutes();

    return res;
};