import Telnet from "telnet-client";
//const fetch = require("node-fetch");
import fetch from 'node-fetch';
const serverURL = "http://127.0.0.1:30006";
const getAddress = serverURL + "/units/metadata";
const setAddress = serverURL + "/units/update";
let run = async ()=>{
    let response = await fetch(getAddress);
    if (response.ok) { // если HTTP-статус в диапазоне 200-299
    // получаем тело ответа (см. про этот метод ниже)
    let json = await response.json();
    let units = json.data;
    for(let unit of units){
        console.log(unit.name);
        let values = [];
        for(let item of unit.items){
            console.log( item.name + ' > ' + item.meta[0].param );
            // -- опрос по телнет и получение значения

            let value = {};
            value[item._id] = "test";
            values.push(value);
        }
        await fetch( setAddress, {
                method: 'POST',
                headers: {'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(values),
            });
        }
    } else {
    console.log("Error");
    }
}

run();