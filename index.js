const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const mysql = require('mysql')
const MySQLStore = require('express-mysql-session')(session)
const csrf = require('csurf');
const {check, validateResult} = require('express-validator');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const flash = require('connect-flash');
const cabinetRoutes = require('./routes/school_admin/school_cabinet');
const projectsRoutes = require('./routes/school_admin/school_project');
const schoolList = require('./routes/school_admin/school_list');
const schoolCardRoutes = require('./routes/school_admin/school_card')


const addRoutes = require('./routes/school_admin/add');
const authRoutes = require('./routes/auth');
const globalListRoutes = require('./routes/school_admin/global_list');
const globalProfileRoutes = require('./routes/school_admin/global_profile');


const libraryListRoutes = require('./routes/school_admin/library_list');
const addNewCabinetFormGeneration = require('./routes/admin/add_new_cabinet_form_gener');
const addNewCabinetFormHandler = require('./routes/admin/add_new_cabinet_form_handler');
const listCabinetRoutes = require('./routes/admin/list_cabinet');
const addNewSchoolRoutes = require('./routes/admin/add_new_school');
const listSchoolsRoutes = require('./routes/admin/main_school_list');
const school_profileRoutes = require('./routes/admin/school_profile');
const teacherEditAndDelete = require('./routes/admin/teacher');
const adminProjectsRoutes = require('./routes/admin/projects');
const adddeletemembersRoutes = require('./routes/admin/add_delete_members')
const cardsRoutes = require('./routes/admin/card')
const varMiddle = require('./middleware/variables');
// const ST = require('./models/admin/Auth')
const isAuth = require('./middleware/auth')
const isAdmin = require('./middleware/admin')


dotenv.config() 

const app = express()

const hbs = exphbs.create({
    defaultLayout:'main',
    extname: 'hbs',

    helpers: {
        // add number for list
        increment: (index) => {
            return parseInt(index) + 1;
        },
        // for html selected 
        selected: (value, value2) => {
            if(value == value2) {
                return ' selected '
            }else {
                return ''
            }
        },
        addClass: (value, value2) => {
            if(value == value2) {
                return 'delete'
            } else {
                return 'add'
            }
        },
        addLink: (value, value2) => {
            if(value == value2) {
                return 'delete_from_current_project'
            } else {
                return 'add_in_current_project'
            }
        },

        getMonthFromArray: (val) => {
            if(val == 1) {
                return 'Января'
            }else if(val == 2) {
                return 'Февраля'
            }else if(val == 3) {
                return 'Марта'
            }else if(val == 4) {
                return 'Апреля'
            }else if(val == 5) {
                return 'Мая'
            }else if(val == 6) {
                return 'Июня'
            }else if(val == 7) {
                return 'Июля'
            }else if(val == 8) {
                return 'Августа'
            }else if(val == 9) {
                return 'Сентября'
            }else if(val == 10) {
                return 'Октября'
            }else if(val == 11) {
                return 'Ноября'
            }else if(val == 2) {
                return 'Декабря'
            }
        },
        getSource: (n) => {
            if(n == 1) {
                return 'Внешняя'
            }else if(n == 2) {
                return 'Внтуришкольная'
            }
        }
      
    }
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(jsonParser = bodyParser.json())

// const sessionStore = ST.sessionStore()

/**
 * -------------
 * 
 */


const dbh =  mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
 })

 const options = {
    // checkExpirationInterval: 1000 * 60 * 15,
    // expiration: 86400000,
    clearExpired: true,
    createDatabaseTable: true,
  };

  const sessionStore = new MySQLStore(options,dbh)


 /**
 * -------------
 * 
 */


app.use(session({
    key: 'ninja1',
    secret: 'secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}))

app.use(csrf())
app.use(varMiddle)
app.use(flash())


//app.use(varmiddleware)

//роутеры
app.use('/',  cabinetRoutes)
app.use('/auth', authRoutes)
app.use('/school/cabinet', isAuth, cabinetRoutes)
app.use('/school/project', isAuth,projectsRoutes)
app.use('/school/list', isAuth, schoolList)
app.use('/school/card', isAuth, schoolCardRoutes)



app.use('/school_admin/global_add', isAuth, addRoutes)
app.use('/school_admin/global_list', isAuth, globalListRoutes)
app.use('/school_admin/global_profile', isAuth, globalProfileRoutes)


app.use('/school_admin/library_list', isAuth, libraryListRoutes)
app.use('/admin/add_new_cabinet', isAdmin, addNewCabinetFormGeneration)
app.use('/admin/add_new_cabinet/handler', isAdmin, addNewCabinetFormHandler)
app.use('/admin/list_cabinet', isAdmin, listCabinetRoutes)
app.use('/admin/add_new_school', isAdmin, addNewSchoolRoutes)
app.use('/admin/school_list',isAdmin, listSchoolsRoutes)
app.use('/admin/school_profile',isAdmin, school_profileRoutes)
app.use('/admin/projects/',isAdmin, adminProjectsRoutes)
app.use('/admin/teacher/',isAdmin, teacherEditAndDelete)
app.use('/admin/library/',isAdmin, adddeletemembersRoutes)
app.use('/admin/cards/', isAdmin, cardsRoutes)
app.use(function(req, res, next){
    res.status(404).render('404_error_template', {
        layout:'404',
        title: "Страница не найдена!"});
});

const PORT = process.env.DATABASE_PORT || 9000

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
}) 






