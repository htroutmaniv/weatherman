    export function hourMin(time:string){
        return new Date(time).toLocaleTimeString(undefined, {hour:'numeric',minute:'2-digit'});
    }

        export function dayHourMin(time:string){
        return new Date(time).toLocaleTimeString(undefined, {
            weekday:'long',
            hour:'numeric',
            minute:'2-digit'
        });
    }

    export function dayLabel(time:string,type:string){
        switch(type){
            case "current":
                return "Current";
            case "daily":
                const day = new Date(`${time}T00:00:00`).toLocaleDateString(undefined, {weekday:'long'})
                return day;
            case "hourly":
                const hour = hourMin(time);
                return hour;
            default:
                return "Invalid Time Type";
        }        
    }  