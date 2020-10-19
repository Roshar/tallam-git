const SchoolProject = require('../../models/school_admin/SchoolProject')
const SchoolCabinet = require('../../models/school_admin/SchoolCabinet')
const SchoolTeacher = require('../../models/school_admin/SchoolTeacher')
const SchoolCard = require('../../models/school_admin/SchoolCard')
const {validationResult} = require('express-validator')
const error_base = require('../../helpers/error_msg');
const notice_base = require('../../helpers/notice_msg')
const { v4: uuidv4 } = require('uuid');
const FileSaver = require('file-saver');
const xlsx = require('xlsx')
const Blob = require('blob');
const fs = require("fs");



/** GET CARD PAGE BY TEACHER ID */

exports.getCardPageByTeacherId = async (req, res) => {
    try{
        
        if(req.session.user) {

            const school = await SchoolCabinet.getSchoolData(req.session.user)

            const school_name = await school[0].school_name;

            const project = await SchoolProject.getInfoFromProjectById(req.params)

            if(!project.length) {
                return res.status(422).redirect('/school/cabinet');
            }

            const projectsIssetSchool = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)
            
            let resultA = []

            for(let i = 0; i < projectsIssetSchool.length; i++) {
                if(project[0].id_project == projectsIssetSchool[i].project_id) {
                    resultA.push(project[0].id_project)
                }
            }

            if(!resultA.length || resultA == 1) {
                return res.status(422).redirect('/school/cabinet');
            } 

            const teacher = await SchoolTeacher.getProfileByTeacherId(req.params)
            if(!teacher.length) {
                return res.status(422).redirect('/school/cabinet');
            }

            const disciplineListByTeacherId = await SchoolTeacher.disciplineListByTeacherId(req.params)
            const teacher_id = await teacher[0].id_teacher;

            if(req.params.project_id == 2) {

                if(req.body.id_teacher && req.body._csrf) {

                    let card = await SchoolCard.getCardByTeacherIdWhithFilter(req.body);
                    const currentSourceId = await card.source;
                    const currentDisc = await card.disc;

                    return res.render('school_teacher_card', {
                        layout: 'maincard',
                        title: 'Личная карта учителя',
                        school_name,
                        teacher,
                        card,
                        teacher_id,
                        school_id: school[0].id_school,
                        disciplineListByTeacherId,
                        project_name: project[0].name_project,
                        project_id: project[0].id_project,

                        currentSourceId,
                        currentDisc,
                        error: req.flash('error'),
                        notice: req.flash('notice')
                    })
                }
       
                let card = await SchoolCard.getCardByTeacherId(req.params)
               
                

                return res.render('school_teacher_card', {
                    layout: 'maincard',
                    title: 'Личная карта учителя',
                    school_name,
                    teacher,
                    card,
                    teacher_id,
                    school_id: school[0].id_school,
                    disciplineListByTeacherId,
                    project_name: project[0].name_project,
                    project_id: project[0].id_project,
                    error: req.flash('error'),
                    notice: req.flash('notice')
                })
            }else if(req.params.id_project == 3) {
                console.log('Данный раздел находится в разработке')
                return res.render('admin_page_not_ready', {
                    layout: 'main',
                    title: 'Ошибка',
                    title: 'Предупрехждение',
                    error: req.flash('error'),
                    notice: req.flash('notice')
                })   
            }else {
                console.log('Ошибка в выборе проекта')
                console.log(req.params)
                return res.status(404).render('404_error_template', {
                    layout:'404',
                    title: "Страница не найдена!"});
            }
          }else {
            req.session.isAuthenticated = false
            req.session.destroy( err => {
                if (err) {
                    throw err
                }else {
                    res.redirect('/auth')
                } 
            })
          }
        
    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */



/** GET CARD PAGE BY TEACHER ID */

exports.addMarkForTeacher = async (req, res) => {
    try{
    
        
            if(req.session.user) {
                const project = await SchoolProject.getInfoFromProjectById(req.params)

                if(!project.length) {
                    return res.status(422).redirect('/school/cabinet');
                }
                
                const projectsIssetSchool = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)
            
                let resultA = []
    
                for(let i = 0; i < projectsIssetSchool.length; i++) {
                    if(project[0].id_project == projectsIssetSchool[i].project_id) {
                        resultA.push(project[0].id_project)
                    }
                }
    
                if(!resultA.length || resultA == 1) {
                    return res.status(422).redirect('/school/cabinet');
                } 

                const teacher = await SchoolTeacher.getProfileByTeacherId(req.params)
                if(!teacher.length) {
                    return res.status(422).redirect('/school/cabinet');
                }

                const teacher_id = await teacher[0].id_teacher

                const school = await SchoolCabinet.getSchoolData(req.session.user)
                const school_id = await school[0].id_school;
                const school_name = await school[0].school_name;
                const title_area = await school[0].title_area;
                const disciplineListByTeacherId = await SchoolTeacher.disciplineListByTeacherId(req.params)
                const project_id = await project[0].id_project;
                

                if(req.body.id_teacher && req.body._csrf) {
                    const errors = validationResult(req);
                    if(!errors.isEmpty()) {
                        req.flash('error', error_base.empty_input)
                        return res.status(422).redirect('/school/card/add/project/' + project_id + '/teacher/' + teacher_id)
                        
                    }
                    
                    let lastId = await SchoolCard.createNewMarkInCard(req.body); 
                    
                    // const some = []
                    // console.log(some.length)
                    
                        if(lastId) {
                            req.flash('notice', notice_base.success_insert_sql );
                            return res.status(200).redirect('/school/card/project/' + project_id + '/teacher/' + teacher_id);
                        }else {
                            req.flash('error', error_base.wrong_sql_insert)
                            return res.status(422).redirect('/school/card/add/project/' + project_id + '/teacher/' + teacher_id)
                        }
                   
                        
                    
                }
                return res.render('school_teacher_card_add_mark', {
                    layout: 'maincard',
                    title: 'Оценить урок',
                    teacher,
                    teacher_id,
                    school_id,
                    project_id,
                    school_name,
                    disciplineListByTeacherId,
                    title_area,
                    error: req.flash('error'),
                    notice: req.flash('notice'),
                })
              }else {
                req.session.isAuthenticated = false
                req.session.destroy( err => {
                    if (err) {
                        throw err
                    }else {
                        res.redirect('/auth')
                    } 
                })
              }

    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */



/** GET SINGLE CARD  BY ID */

exports.getSingleCardById = async (req, res) => {
    try{
        
        if(req.session.user) {

            const school = await SchoolCabinet.getSchoolData(req.session.user)

            const school_name = await school[0].school_name;

            const project = await SchoolProject.getInfoFromProjectById(req.params)

            if(!project.length) {
                return res.status(422).redirect('/school/cabinet');
            }

            const projectsIssetSchool = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)
            
            let resultA = []

            for(let i = 0; i < projectsIssetSchool.length; i++) {
                if(project[0].id_project == projectsIssetSchool[i].project_id) {
                    resultA.push(project[0].id_project)
                }
            }

            if(!resultA.length || resultA == 1) {
                return res.status(422).redirect('/school/cabinet');
            } 
           
           

            if(req.params.project_id == 2) {

                const singleCard = await SchoolCard.getSingleCard(req.params)
                if(!singleCard.length) {
                    return res.status(422).redirect('/school/cabinet');
                }
             
                const teacher_id = await singleCard[0].teacher_id;


                const teacher = await SchoolTeacher.getProfileByTeacherId({
                    teacher_id
                })

                
                
               let commonValue = singleCard[0].k_1_1 + singleCard[0].k_1_2 + singleCard[0].k_1_3 + singleCard[0].k_2_1 
               + singleCard[0].k_2_2 + singleCard[0].k_3_1 + singleCard[0].k_4_1 + singleCard[0].k_5_1 + singleCard[0].k_5_2 
               + singleCard[0].k_6_1

               let interest = (commonValue * 100) / 20;

              
                

                const d =  singleCard[0].create_mark_date.getDate();
                const m =  singleCard[0].create_mark_date.getMonth();
                const month = ['января', 'февраля','марта', 'апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
                const y =  singleCard[0].create_mark_date.getFullYear();
                const  create_mark_date = `${d}  ${month[m]} ${y}`;
                let sourceData;
                if(singleCard[0].source_id == 2) {
                    sourceData = 'Внтуришкольная'
                }else {
                    sourceData = singleCard[0].source_fio + ', ' + singleCard[0].position_name + ' ( '+ singleCard[0].source_workplace +')'
                }
                let level;
                let levelStyle;

                if(interest > 84) {
                    level = "Оптимальный уровень";
                    levelStyle = 'success';
                }else if(interest < 85 && interest > 59) {
                    level = "Допустимый уровень";
                    levelStyle = 'good';
                }else if(interest < 60 && interest > 49) {
                    level = 'критический уровень';
                    levelStyle = 'danger';
                } else if(interest < 50) {
                    level = 'недопустимый уровень';
                    levelStyle = 'trash';
                }

                if(req.body.excel_tbl) {
                    
                    const jsonsingleCard = JSON.parse(JSON.stringify(singleCard));

                    let workbook = new excel.Workbook(); 
                    let worksheet = workbook.addWorksheet('Singlecard');

                    worksheet.columns = [
                        { header: 'Id', key: 'id_card', width: 10 },
                        { header: 'Teacher_id', key: 'teacher_id', width: 30 },
                        { header: 'discipline_id', key: 'discipline_id', width: 30},
                        { header: 'source_id', key: 'source_id', width: 30},
                        { header: 'title_discipline:', key: 'title_discipline:', width: 30},
                        { header: 'source_fio:', key: 'source_fio:', width: 30},
                        { header: 'school_id:', key: 'school_id:', width: 10, outlineLevel: 1}
                    ];

                    worksheet.addRows(jsonsingleCard);

                    let excelFileName = teacher[0].surname + '-' + Date.now();

                    await workbook.xlsx.writeFile(`files/excels/schools/tmp/${excelFileName}.xlsx`);

                     return res.download(path.join(__dirname,'..','..','files','excels','schools','tmp',`${excelFileName}.xlsx`), (err) => {
                       if(err) {
                        console.log('Ошибка при скачивании' + err)
                       }
                    })
                }
               


                return res.render('school_teacher_card_single', {
                    layout: 'maincard',
                    title: 'Личная карта учителя',
                    school_name,
                    teacher,
                    singleCard,
                    teacher_id,
                    commonValue,
                    interest,
                    level,
                    levelStyle,
                    create_mark_date,
                    sourceData,
                    school_id: school[0].id_school,
                    project_name: project[0].name_project,
                    project_id: project[0].id_project,
                    error: req.flash('error'),
                    notice: req.flash('notice')
                })
            }else if(req.params.id_project == 3) {
                console.log('Данный раздел находится в разработке')
                return res.render('admin_page_not_ready', {
                    layout: 'main',
                    title: 'Ошибка',
                    title: 'Предупрехждение',
                    error: req.flash('error'),
                    notice: req.flash('notice')
                })   
            }else {
                console.log('Ошибка в выборе проекта')
                console.log(req.params)
                return res.status(404).render('404_error_template', {
                    layout:'404',
                    title: "Страница не найдена!"});
            }
          }else {
            req.session.isAuthenticated = false
            req.session.destroy( err => {
                if (err) {
                    throw err
                }else {
                    res.redirect('/auth')
                } 
            })
          }
        
    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */




/** GET EXCEL */

exports.getExcel = async (req, res) => {
    try{
        
        if(req.session.user) {

            const school = await SchoolCabinet.getSchoolData(req.session.user)

            const school_name = await school[0].school_name;

            const project = await SchoolProject.getInfoFromProjectById(req.params)

            if(!project.length) {
                return res.status(422).redirect('/school/cabinet');
            }

            const projectsIssetSchool = await SchoolProject.getAllProjectsWithThisSchool(req.session.user)
            
            let resultA = []

            for(let i = 0; i < projectsIssetSchool.length; i++) {
                if(project[0].id_project == projectsIssetSchool[i].project_id) {
                    resultA.push(project[0].id_project)
                }
            }

            if(!resultA.length || resultA == 1) {
                return res.status(422).redirect('/school/cabinet');
            }

            if(req.params.project_id == 2) {

                const singleCard = await SchoolCard.getSingleCard(req.params)
                if(!singleCard.length) {
                    return res.status(422).redirect('/school/cabinet');
                }
             
                const teacher_id = await singleCard[0].teacher_id;

                const teacher = await SchoolTeacher.getProfileByTeacherId({
                    teacher_id
                })

               let commonValue = singleCard[0].k_1_1 + singleCard[0].k_1_2 + singleCard[0].k_1_3 + singleCard[0].k_2_1 
               + singleCard[0].k_2_2 + singleCard[0].k_3_1 + singleCard[0].k_4_1 + singleCard[0].k_5_1 + singleCard[0].k_5_2 
               + singleCard[0].k_6_1

               let interest = (commonValue * 100) / 20;

                const d =  singleCard[0].create_mark_date.getDate();
                const m =  singleCard[0].create_mark_date.getMonth();
                const month = ['января', 'февраля','марта', 'апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
                const y =  singleCard[0].create_mark_date.getFullYear();
                const  create_mark_date = `${d}  ${month[m]} ${y}`;
                let sourceData;
                if(singleCard[0].source_id == 2) {
                    sourceData = 'Внтуришкольная'
                }else {
                    sourceData = singleCard[0].source_fio + ', ' + singleCard[0].position_name + ' ( '+ singleCard[0].source_workplace +')'
                }
                let level;
                let levelStyle;

                if(interest > 84) {
                    level = "Оптимальный уровень";
                    levelStyle = 'success';
                }else if(interest < 85 && interest > 59) {
                    level = "Допустимый уровень";
                    levelStyle = 'good';
                }else if(interest < 60 && interest > 49) {
                    level = 'критический уровень';
                    levelStyle = 'danger';
                } else if(interest < 50) {
                    level = 'недопустимый уровень';
                    levelStyle = 'trash';
                }

                var wb = xlsx.utils.book_new();
        wb.Props = {
                Title: "SheetJS Tutorial",
                Subject: "Test",
                Author: "Red Stapler",
                CreatedDate: new Date(2017,12,19)
        };
        
        wb.SheetNames.push("Test Sheet");
        var ws_data = [['hello' , 'world']];
        var ws = xlsx.utils.aoa_to_sheet(ws_data);
        wb.Sheets["Test Sheet"] = ws;
        var wbout = xlsx.write(wb, {bookType:'xlsx',  type: 'binary'});
        function s2ab(s) {
  
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
        }
        

            FileSaver.saveAs(fs.writeFile("hello.xlsx", s2ab(wbout),(error) => {
                if(error) throw error; // если возникла ошибка
                console.log("Асинхронная запись файла завершена. Содержимое файла:");
                let data = fs.readFile("Hello.xlsx", "utf8");
                console.log(data);  // выводим считанные данные

            }), 'test.xlsx');

            // FileSaver.saveAs('sdsd', 'test.xlsx');
            // FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');



            }else if(req.params.id_project == 3) {
                console.log('Данный раздел находится в разработке')
                return res.render('admin_page_not_ready', {
                    layout: 'main',
                    title: 'Ошибка',
                    title: 'Предупрехждение',
                    error: req.flash('error'),
                    notice: req.flash('notice')
                })   
            }else {
                console.log('Ошибка в выборе проекта')
                console.log(req.params)
                return res.status(404).render('404_error_template', {
                    layout:'404',
                    title: "Страница не найдена!"});
            }
          }else {
            req.session.isAuthenticated = false
            req.session.destroy( err => {
                if (err) {
                    throw err
                }else {
                    res.redirect('/auth')
                } 
            })
          }
        
    }catch (e) {
        console.log(e)
    }
}

/** END BLOCK */


