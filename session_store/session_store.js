// const MySQLStore = require('express-mysql-session')(session);
// const app = express()

// module.exports = {
//     sessionStore: {
//         const dbh =  mysql.createConnection({
//             host: process.env.DATABASE_HOST,
//             port: process.env.DATABASE_PORT,
//             user: process.env.DATABASE_USER,
//             database: process.env.DATABASE,
//             password: process.env.DATABASE_PASSWORD,
//             socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
//     }
// }
// exports.sessionStore = async (req, res) => {
//        try {
//           const dbh = await mysql.createConnection({
//              host: process.env.DATABASE_HOST,
//              port: process.env.DATABASE_PORT,
//              user: process.env.DATABASE_USER,
//              database: process.env.DATABASE,
//              password: process.env.DATABASE_PASSWORD,
//              socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
                
//           })
//           const sessionStore = new MySQLStore(dbh);
    
//        }catch(e) {
//           console.log(e.message)
//        }
//     }