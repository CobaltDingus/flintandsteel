const pg = require('pg')
const types = pg.types;
types.setTypeParser(1114, function(stringValue) {
return stringValue;
});
const connectionString = process.env.DATABASE_URL

const pool = new pg.Pool({
    connectionString : connectionString
})  

module.exports = pool