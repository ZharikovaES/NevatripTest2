
function main() {
    const routeSelect = document.getElementById("route");
    const timeSelect1 = document.getElementById("time1");
    const timeSelect2 = document.getElementById("time2");
    const numInput = document.getElementById("num");
    const btnResult = document.getElementById("btn-result");
    const output = document.getElementById("result");

    const ROUTES_VALUE = ["Выбрать направление", "из A в B", "из B в A", "из A в B и обратно в А"]
    const TIMES = [
        ["18:00", "18:30", "18:45", "19:00", "19:15", "21:00"],
        ["18:30", "18:45", "19:00", "19:15", "19:35", "21:50", "21:55"]
    ];
    const PRICE = [700, 1200];
    const TRAVEL_TIME_MINUTES = 50;
    const SELECTED_INDEX_DEFAULT = 0;

    let currentRoute = 1;
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
            time2 = null;

            // удаление option "Выбрать направление" при выборе маршрута
            if (routeSelect.options.length === 4) {
                ROUTES_VALUE.shift();
                routeSelect.options?.[0].remove();
                currentRoute = index - 1;
            } else currentRoute = index;

            [timeSelect1, timeSelect2].forEach(element => {
                element.innerHTML = "";
            });
            timeSelect1.parentNode.style.display = "block";

            // отображение временных select-ов взависимости от выбор маршрута
            if (currentRoute === 2) {
                setTimeToSelect(0, timeSelect1);
                time1 = stringToDate(timeSelect1.value);
                setTimeToSelect(1, timeSelect2, element => {
                    let timeOfTimeSelect2 = stringToDate(element);
                    return time1 + TRAVEL_TIME_MINUTES * 60 * 1000 <= timeOfTimeSelect2;
                });
                time2 = stringToDate(timeSelect2.value);
                timeSelect2.parentNode.style.display = "block";
            } else {
                setTimeToSelect(currentRoute, timeSelect1);
                time1 = stringToDate(timeSelect1.value);
                timeSelect2.parentNode.style.display = "none";
            }
            btnResult.disabled = false;
        });

        // событие change: выбор времени в 1-ом select-е
        timeSelect1.addEventListener("change", function(e) {
            time2 = null;
            timeSelect2.innerHTML = "";
            time1 = stringToDate(this.value);
            if (currentRoute === 2)
                setTimeToSelect(1, timeSelect2, element => {
                    let timeOfTimeSelect2 = stringToDate(element);
                    return time1 + TRAVEL_TIME_MINUTES * 60 * 1000 <= timeOfTimeSelect2;
                });
        });

        // событие change: выбор времени в 2-ом select-е
        timeSelect2.addEventListener("change", function(e) {
            time2 = stringToDate(this.value);
        });

        
        btnResult.addEventListener("click", e => {
            const difference = (currentRoute === 2 ? (new Date(time2).getHours() - new Date(time1).getHours()) * 60 + new Date(time2).getMinutes() - new Date(time1).getMinutes() : 0) + TRAVEL_TIME_MINUTES;
            const arrivalTime = currentRoute === 2 ? new Date(time2).setMinutes(new Date(time2).getMinutes() + TRAVEL_TIME_MINUTES) : new Date(time1).setMinutes(new Date(time1).getMinutes() + TRAVEL_TIME_MINUTES);

            const num = Number(numInput.value);
            if (((time1 && time2 && currentRoute === 2) || (time1 && currentRoute !== 2)) && num) {
                let result = `Вы выбрали ${num} билета по маршруту ${ROUTES_VALUE[currentRoute]} стоимостью ${num * PRICE[currentRoute === 2 ? 1 : 0]}р.
Это путешествие займет у вас ${difference} минут. 
Теплоход отправляется в ${dateToString(new Date(time1))}, а прибудет в ${dateToString(new Date(arrivalTime))}.`;
                output.innerText = result;
            }
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
        const minutes = date.getMinutes();
        return `${date.getHours()}-${minutes ? minutes < 10 ? '0' + minutes : minutes : minutes + '0'}`
    }
}


main();