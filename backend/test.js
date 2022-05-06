process.env.NODE_ENV = 'test';

const {unitCRUD,unitSettingsCRUD} = require("./components/unit/unitTest.js");
const templateCRUD = require("./components/template/templateTest.js");



//describe('Template CRUD', ()=>templateCRUD());
//describe('Unit CRUD', ()=>unitCRUD());
describe('Unit settings CRUD', ()=>unitSettingsCRUD());
