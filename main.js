
function main() {
    const routeSelect = document.getElementById("route");
    const timeSelect1 = document.getElementById("time1");
    const timeSelect2 = document.getElementById("time2");
    const numInput = document.getElementById("num");
    const btnResult = document.getElementById("btn-result");
    const output = document.getElementById("result");

    const ROUTES_VALUE = ["из A в B", "из B в A", "из A в B и обратно в А"]
    const TIMES = [
        ["18:00", "18:30", "18:45", "19:00", "19:15", "21:00"],
        ["18:30", "18:45", "19:00", "19:15", "19:35", "21:50", "21:55"]
    ];
    const PRICE = [700, 1200];
    const TRAVEL_TIME_MINUTES = 50;
    const SELECTED_INDEX_DEFAULT = 0;

    let currentRoute = 0;
    let time1 = null;
    let time2 = null;


    if (routeSelect && timeSelect1 && timeSelect2 && numInput && btnResult && output) {
        
        // заполнение select-а с выбором маршрута
        ROUTES_VALUE.forEach((el, index) => {
            const option = document.createElement("option");
            option.setAttribute("value", el);
            option.setAttribute("label", el);
            if (index === SELECTED_INDEX_DEFAULT) option.selected = true;

            routeSelect.appendChild(option);

        });

        // событие change: выбор маршрута
        routeSelect.addEventListener("change", function(e) {
            const index = ROUTES_VALUE.indexOf(this.value);
            currentRoute = index;
            time1 = stringToDate(timeSelect1.value);
            time2 = null;

            [timeSelect1, timeSelect2].forEach(element => {
                element.innerHTML = "";
            });
            timeSelect1.parentNode.style.display = "block";
            if (index === 2) {
                setTimeToSelect(0, timeSelect1);
                btnResult.disabled = true;
            } else {
                setTimeToSelect(index, timeSelect1);
                timeSelect2.parentNode.style.display = "none";
                btnResult.disabled = false;
            }
        });

        // событие change: выбор времени в 1-ом select-е
        timeSelect1.addEventListener("change", function(e) {
            time2 = null;
            btnResult.disabled = false;
            if (currentRoute === 2) {
                timeSelect2.innerHTML = "";
                time1 = stringToDate(this.value);
                setTimeToSelect(1, timeSelect2, element => {
                    let timeOfTimeSelect2 = stringToDate(element);
                    
                    return time1 + TRAVEL_TIME_MINUTES * 60 * 1000 <= timeOfTimeSelect2;
                });
                timeSelect2.parentNode.style.display = "block";
            }
        });

        // событие change: выбор времени в 2-ом select-е
        timeSelect2.addEventListener("change", function(e) {
            time2 = stringToDate(this.value);
        });
    }

    // заполнение select-ов со временем
    function setTimeToSelect(index, select, checkFunc) {
        TIMES[index].forEach(function(el, i) {
            if (checkFunc && checkFunc(el) || !checkFunc) {
                const text = `${el}(${ROUTES_VALUE[index]})`;
                const option = document.createElement("option");
                option.setAttribute("value", text);
                option.setAttribute("label", text);
                if (i === SELECTED_INDEX_DEFAULT) option.selected = true;
                select.appendChild(option);
            }
        });
    }

    function stringToDate(str){
        let arr = str.split("(")[0].split(":").map(el => Number(el));
        return new Date().setHours(...arr);
    }
    function dateToString(date){
        return `${date.getHours()}-${date.getMinutes()}`
    }
}


main();