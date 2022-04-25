const {createTemplate, getTemplate, getTemplates} = require("./templateUnitController.js");

function test(){

   
    let testTemplate = {
        "name": "Test template",
        "code": "1",
        "items": [
            {"name": "Eb/N0", "type": "float", "dim": "dB", "code":"ebno", "meta":[{"param":"ebno", "oid":"1.3.6.1.1102.1.5.2.1.1.0.1"}]},
            {"name": "BER", "type": "float", "dim": "", "code":"ber", "meta":[{"param":"ebno", "oid":"1.3.6.1.1102.1.5.2.1.1.0.2"}]},
        ],
        "triggers": [
            {"name":"Eb/N0 ниже нормы", "condition":"i.ebno < 8", "status": 3, "code": "ebno_alarm", "targetItem": "ebno"}
        ],
    };
 
    const tmpCreated = createTemplate({body: testTemplate});
    
    //for

}

/*
let example = {
    "name": "Comtech cdm qx",
    "code": "1001",
    "items": [
        {"name": "Eb/N0", type: "float", dim: "dB", code:"ebno", meta:[{param:"ebno", oid:"1.3.6.1.1102.1.5.2.1.1.0.1"}]},
        {"name": "BER", type: "float", dim: "", code:"ber", meta:[{param:"ebno", oid:"1.3.6.1.1102.1.5.2.1.1.0.2"}]},
    ],
    "triggers": [
        {"name":"Eb/N0 ниже нормы", "condition":"i.ebno < 8", "status": 3, "code": "ebno_alarm", "targetItem": "ebno"}
    ],
};
*/
