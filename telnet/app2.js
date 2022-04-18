import Telnet from "telnet-client";
//const fetch = require("node-fetch");
import fetch from 'node-fetch';
const serverURL = "http://127.0.0.1:3000";
const getAddress = serverURL + "/units/metadata";
const setAddress = serverURL + "/items/update";
let run = ()=>{
    fetch(getAddress)
    .then( response => response.json())
    .then( (content) =>{
        let units = content.data;
        for(let unit of units){
            console.log(unit.name);
            let values = [];
            for(let item of unit.items){
                console.log( item.name + ' > ' + item.meta[0].param );
                // -- опрос по телнет и получение значения
    
                let value = {};
                value[item._id] = "test3";
                values.push(value);
            }
            fetch( setAddress, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json;charset=utf-8' },
                    body: JSON.stringify(values),
                })
            .catch( err => console.log("ошибка отправки") );
        }
    }, (err) => console.log("ошибка парсинга") )
    .catch( err => {
        console.log("ошибка загрузки");
    } );
}
setInterval( ()=> { 
    console.log("Опрос");
    return run();
}, 3000);
