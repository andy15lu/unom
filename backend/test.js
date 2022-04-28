process.env.NODE_ENV = 'test';

const unitCRUD = require("./components/unit/unitTest.js");
const templateCRUD = require("./components/template/templateTest.js");



describe('Template CRUD', ()=>templateCRUD());
describe('Unit CRUD', ()=>unitCRUD());
