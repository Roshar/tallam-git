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
const excel = require('exceljs');
const path = require('path'); 
const http = require('http');
const { Document, Packer, Paragraph, TextRun } = require("docx");






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

                    for(let i = 0; i < card.length; i++) {
                        card[i].sum = card[i].k_1_1 + card[i].k_1_2 + card[i].k_1_3 +
                        card[i].k_2_1 + card[i].k_2_2 + card[i].k_3_1 + card[i].k_4_1 + card[i].k_5_1 + card[i].k_5_2;
                        card[i].interest = card[i].sum * 100 / 20;
     
                         if(card[i].interest > 84) {
                             card[i].level = "Оптимальный уровень";
                             card[i].levelStyle = 'success';
                         }else if(card[i].interest < 85 && card[i].interest > 59) {
                             card[i].level = "Допустимый уровень";
                             card[i].levelStyle = 'good';
                         }else if(card[i].interest < 60 && card[i].interest > 49) {
                             card[i].level = 'критический уровень';
                             card[i].levelStyle = 'danger';
                         } else if(card[i].interest < 50) {
                             card[i].level = 'недопустимый уровень';
                             card[i].levelStyle = 'trash';
                         }
                     }

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
             
                let card = await SchoolCard.getCardByTeacherId(req.params);

                for(let i = 0; i < card.length; i++) {
                   card[i].sum = card[i].k_1_1 + card[i].k_1_2 + card[i].k_1_3 +
                   card[i].k_2_1 + card[i].k_2_2 + card[i].k_3_1 + card[i].k_4_1 + card[i].k_5_1 + card[i].k_5_2;
                   card[i].interest = card[i].sum * 100 / 20;

                    if(card[i].interest > 84) {
                        card[i].level = "Оптимальный уровень";
                        card[i].levelStyle = 'success';
                    }else if(card[i].interest < 85 && card[i].interest > 59) {
                        card[i].level = "Допустимый уровень";
                        card[i].levelStyle = 'good';
                    }else if(card[i].interest < 60 && card[i].interest > 49) {
                        card[i].level = 'критический уровень';
                        card[i].levelStyle = 'danger';
                    } else if(card[i].interest < 50) {
                        card[i].level = 'недопустимый уровень';
                        card[i].levelStyle = 'trash';
                    }
                }

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



/** GET ALL CARDS  BY TEACHER ID */

exports.getAllMarksByTeacherId = async (req, res) => {
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
                console.log(req.params)
                const allMarks = await SchoolCard.getAllMarksByTeacherId(req.params)
                console.log(allMarks)
                if(!allMarks.length) {
                    return res.status(422).redirect('/school/cabinet');
                }
             
                const teacher_id = await allMarks[0].teacher_id;

                const teacher = await SchoolTeacher.getProfileByTeacherId({
                    teacher_id
                })

                const month = ['января', 'февраля','марта', 'апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

                for(let v = 0; v <allMarks.length; v++ ) {
                    let commonValue = allMarks[v].k_1_1 + allMarks[v].k_1_2 + allMarks[v].k_1_3 + allMarks[v].k_2_1 
                    + allMarks[v].k_2_2 + allMarks[v].k_3_1 + allMarks[v].k_4_1 + allMarks[v].k_5_1 + allMarks[v].k_5_2 
                    + allMarks[v].k_6_1

                    let interest = (commonValue * 100) / 20;

                    allMarks[v].interest  = (commonValue * 100) / 20;
                    

                    let d =  allMarks[v].create_mark_date.getDate();
                    let m =  allMarks[v].create_mark_date.getMonth();

                    let y =  allMarks[v].create_mark_date.getFullYear();
                    allMarks[v].date = `${d}  ${month[m]} ${y}`;
                    allMarks[v].rrrrrrrr = "ccccccccc";
                    let sourceData;

                    if(allMarks[v].source_id == 2) {
                        sourceData = 'Внтуришкольная'
                    }else {
                        sourceData = allMarks[v].source_fio + ', ' + allMarks[v].position_name + ' ( '+ allMarks[v].source_workplace +')'
                    }

                    if(interest > 84) {
                        allMarks[v].level = "Оптимальный уровень";
                        allMarks[v].levelStyle = 'success';
                    }else if(interest < 85 && interest > 59) {
                        allMarks[v].level = "Допустимый уровень";
                        allMarks[v].levelStyle = 'good';
                    }else if(interest < 60 && interest > 49) {
                        allMarks[v].level = 'критический уровень';
                        allMarks[v].levelStyle = 'danger';
                    } else if(interest < 50) {
                        allMarks[v].level = 'недопустимый уровень';
                        allMarks[v].levelStyle = 'trash';
                    }

                    allMarks[v].fio = teacher[0].surname +' '+ teacher[0].firstname + ' ' + teacher[0].patronymic;
                    allMarks[v].position  = allMarks[v].title_position;
                    allMarks[v].school_name = school_name;
                    allMarks[v].commonValue = commonValue;

                }

                const jsonallMarks = JSON.parse(JSON.stringify(allMarks));

                let workbook = new excel.Workbook(); 
                let worksheet = workbook.addWorksheet('allMarks');

                worksheet.columns = [
                    { header: 'ФИО', key: 'fio', width: 10 },
                    { header: 'Должность', key: 'position', width: 30 },
                    { header: 'Предмет', key: 'title_discipline', width: 30},
                    { header: 'Требования Стандартов к предметному содержанию', key: 'k_1_1', width: 50},
                    { header: 'Развитие личностной сферы ученика средствами предмета', key: 'k_1_2', width: 50},
                    { header: 'Использование заданий, развивающих УУД на уроках предмета', key: 'k_1_3', width: 50},
                    { header: 'Учет и развитие мотивации и психофизиологической сферы учащихся', key: 'k_2_1', width: 50},
                    { header: 'Обеспечение целевой психолого-педагогической поддержки обучающихся', key: 'k_2_2', width: 50},
                    { header: 'Требования ЗСС в содержании, структуре урока, в работе с оборудованием и учете данных о детях с ОВЗ', key: 'k_3_1', width: 50},
                    { header: 'Стиль и формы педагогического взаимодействия на уроке', key: 'k_4_1', width: 50},
                    { header: 'Управление организацией учебной деятельности обучающихся через систему оценивания', key: 'k_5_1', width: 50},
                    { header: 'Управление собственной обучающей   деятельностью ', key: 'k_5_2', width: 50},
                    { header: 'Результативность урока', key: 'k_6_1', width: 50},
                    { header: 'Сумма баллов', key: 'commonValue', width: 50},
                    { header: 'Оценка', key: 'level', width: 50},
                    { header: 'Источник ФИО', key: 'source_fio', width: 50},
                    { header: 'Субьект оценивания:', key: 'name_source', width: 30},
                    { header: 'Наименование ОО', key: 'school_name', width: 30}
                ];

                worksheet.addRows(jsonallMarks);

                let excelFileName = teacher[0].surname + '-' + Date.now();

                await workbook.xlsx.writeFile(`files/excels/schools/tmp/${excelFileName}.xlsx`);

                return res.download(path.join(__dirname,'..','..','files','excels','schools','tmp',`${excelFileName}.xlsx`), (err) => {
                   if(err) {
                    console.log('Ошибка при скачивании' + err)
                   }
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

                singleCard[0].fio = teacher[0].surname +' '+ teacher[0].firstname + ' ' + teacher[0].patronymic;
                singleCard[0].position  = teacher[0].title_position;
                singleCard[0].school_name = school_name;
                singleCard[0].commonValue = commonValue;
                singleCard[0].level = level;
              
               
                if(req.body.excel_tbl) {
                    
                    const jsonsingleCard = JSON.parse(JSON.stringify(singleCard));
                    let workbook = new excel.Workbook(); 
                    let worksheet = workbook.addWorksheet('Singlecard');
                    
                    worksheet.columns = [
                        { header: 'ФИО', key: 'fio', width: 10 },
                        { header: 'Должность', key: 'position', width: 30 },
                        { header: 'Предмет', key: 'title_discipline', width: 30},
                        { header: 'Требования Стандартов к предметному содержанию', key: 'k_1_1', width: 50},
                        { header: 'Развитие личностной сферы ученика средствами предмета', key: 'k_1_2', width: 50},
                        { header: 'Использование заданий, развивающих УУД на уроках предмета', key: 'k_1_3', width: 50},
                        { header: 'Учет и развитие мотивации и психофизиологической сферы учащихся', key: 'k_2_1', width: 50},
                        { header: 'Обеспечение целевой психолого-педагогической поддержки обучающихся', key: 'k_2_2', width: 50},
                        { header: 'Требования ЗСС в содержании, структуре урока, в работе с оборудованием и учете данных о детях с ОВЗ', key: 'k_3_1', width: 50},
                        { header: 'Стиль и формы педагогического взаимодействия на уроке', key: 'k_4_1', width: 50},
                        { header: 'Управление организацией учебной деятельности обучающихся через систему оценивания', key: 'k_5_1', width: 50},
                        { header: 'Управление собственной обучающей   деятельностью ', key: 'k_5_2', width: 50},
                        { header: 'Результативность урока', key: 'k_6_1', width: 50},
                        { header: 'Сумма баллов', key: 'commonValue', width: 50},
                        { header: 'Оценка', key: 'level', width: 50},
                        { header: 'Источник ФИО', key: 'source_fio', width: 50},
                        { header: 'Субьект оценивания:', key: 'name_source', width: 30},
                        { header: 'Наименование ОО', key: 'school_name', width: 30}
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


                if(req.body.method_rec) {

                    const jsonsingleCard = JSON.parse(JSON.stringify(singleCard));

                    const k_1_1_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_1_1',
                        v_param: jsonsingleCard[0].k_1_1
                    });
                    
                    const k_1_2_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_1_2',
                        v_param: jsonsingleCard[0].k_1_2
                    });

                    const k_1_3_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_1_3',
                        v_param: jsonsingleCard[0].k_1_3
                    });

                    const k_2_1_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_2_1',
                        v_param: jsonsingleCard[0].k_2_1
                    });
                    const k_2_2_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_2_2',
                        v_param: jsonsingleCard[0].k_2_2
                    });
                    const k_3_1_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_3_1',
                        v_param: jsonsingleCard[0].k_3_1
                    });
                    const k_4_1_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_4_1',
                        v_param: jsonsingleCard[0].k_4_1
                    });
                    const k_5_1_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_5_1',
                        v_param: jsonsingleCard[0].k_5_1
                    });
                    const k_5_2_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_5_2',
                        v_param: jsonsingleCard[0].k_5_2
                    });
                    const k_6_1_rec = await SchoolCard.getRecommendation({
                        k_param: 'k_6_1',
                        v_param: jsonsingleCard[0].k_6_1
                    });

                    console.log(k_1_1_rec);

                    const doc = new Document();

                    doc.addSection({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `ФИО учителя: ${teacher[0].surname} ${teacher[0].firstname} ${teacher[0].patronymic}`,
                                        bold:true,
                                    }),
                                    new TextRun('  ')]
                                     }),
                            new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Школа: ${school[0].school_name}`,
                                    bold:true,
                                }),
                                new TextRun('  ')]
                                    }),

                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Район: ${school[0].title_area}`,
                                        bold:true,
                                    }),
                                    new TextRun('  ')]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('   '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: '                                                    ЗАКЛЮЧЕНИЕ ПО ИТОГУ АНАЛИЗА УРОКА',
                                        bold:true,
                                    }),
                                    new TextRun('  ')]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('   '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text:"Категория: ",
                                        bold:true
                                    }),
                                    new TextRun({
                                        text: k_1_1_rec[0].category,
                                        bold:true
                                    })]
                                     }),
                            new Paragraph({
                                children: [
                                            new TextRun('   '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun({
                                                text: 'Рекомендации по пункту №1 (Требования Стандартов к предметному содержанию)',
                                                bold:true
                                            })]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun(k_1_1_rec[0].content)]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                //////////////////////////////конец первого пункта

                            new Paragraph({
                            children: [
                                        new TextRun({
                                            text: 'Рекомендации по пункту №2 (Развитие личностной сферы ученика средствами предмета)',
                                            bold:true
                                        })]
                                    }),
                            new Paragraph({
                            children: [
                                        new TextRun('  '),
                                    ]
                                    }),
                            new Paragraph({
                            children: [
                                        new TextRun(k_1_2_rec[0].content)]
                                    }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),

                    //////////////////////////////конец второго пункта

                            new Paragraph({
                                children: [
                                            new TextRun({
                                                text: 'Рекомендации по пункту №3 (Использование заданий, развивающих УУД на уроках предмета)',
                                                bold:true
                                            })]
                                        }),
                            new Paragraph({
                            children: [
                                        new TextRun('  '),
                                    ]
                                    }),
                            new Paragraph({
                            children: [
                                        new TextRun(k_1_3_rec[0].content)]
                                    }),

                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),

                //////////////////////////////конец третьего пункта
                            new Paragraph({
                                children: [
                                            new TextRun('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'),
                                        ]
                                        }),

                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                            new Paragraph({
                                
                                children: [
                                    new TextRun({
                                        text:"Категория: ",
                                        bold:true
                                    }),
                                    new TextRun({
                                        text: k_2_1_rec[0].category,
                                        bold:true
                                    })]
                                    }),
                            new Paragraph({
                                children: [
                                            new TextRun('   '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun({
                                                text: 'Рекомендации по пункту №4 (Учет  и развитие мотивации и психофизиологической сферы учащихся)',
                                                bold:true
                                            })]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun(k_1_1_rec[0].content)]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
    //////////////////////////////конец 4-го пункта

                            new Paragraph({
                                children: [
                                            new TextRun({
                                                text: 'Рекомендации по пункту №5 (Обеспечение целевой психолого-педагогической поддержки обучающихся)',
                                                bold:true
                                            })]
                                        }),
                            new Paragraph({
                            children: [
                                        new TextRun('  '),
                                    ]
                                    }),
                            new Paragraph({
                            children: [
                                        new TextRun(k_2_2_rec[0].content)]
                                    }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
        //////////////////////////////конец 5-го пункта

                            new Paragraph({
                                children: [
                                            new TextRun('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'),
                                        ]
                                        }),

                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                            new Paragraph({
                                
                                children: [
                                    new TextRun({
                                        text:"Категория: ",
                                        bold:true
                                    }),
                                    new TextRun({
                                        text: k_3_1_rec[0].category,
                                        bold:true
                                    })]
                                    }),
                            new Paragraph({
                                children: [
                                            new TextRun('   '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun({
                                                text: 'Рекомендации по пункту №6 (Требования ЗСС в содержании, структуре урока, в работе с оборудованием и учете данных о детях с ОВЗ)',
                                                bold:true
                                            })]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun(k_3_1_rec[0].content)]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
//////////////////////////////конец 6-го пункта

                            new Paragraph({
                                children: [
                                            new TextRun('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'),
                                        ]
                                        }),

                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                            new Paragraph({
                                
                                children: [
                                    new TextRun({
                                        text:"Категория: ",
                                        bold:true
                                    }),
                                    new TextRun({
                                        text: k_4_1_rec[0].category,
                                        bold:true
                                    })]
                                    }),
                            new Paragraph({
                                children: [
                                            new TextRun('   '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun({
                                                text: 'Рекомендации по пункту №7 (Стиль и формы педагогического взаимодействия на уроке)',
                                                bold:true
                                            })]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun(k_4_1_rec[0].content)]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
//////////////////////////////конец 7-го пункта

                            new Paragraph({
                                children: [
                                            new TextRun('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'),
                                        ]
                                        }),

                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                            new Paragraph({
                                
                                children: [
                                    new TextRun({
                                        text:"Категория: ",
                                        bold:true
                                    }),
                                    new TextRun({
                                        text: k_5_1_rec[0].category,
                                        bold:true
                                    })]
                                    }),
                            new Paragraph({
                                children: [
                                            new TextRun('   '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun({
                                                text: 'Рекомендации по пункту №8 (Управление организацией учебной деятельности обучающихся через систему оценивания)',
                                                bold:true
                                            })]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun(k_5_1_rec[0].content)]
                                        }),
                            new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
        //////////////////////////////конец 8-го пункта

                            new Paragraph({
                                children: [
                                            new TextRun({
                                                text: 'Рекомендации по пункту №9 (Управление собственной обучающей деятельностью)',
                                                bold:true
                                            })]
                                        }),
                                new Paragraph({
                                children: [
                                            new TextRun('  '),
                                        ]
                                        }),
                                new Paragraph({
                                children: [
                                            new TextRun(k_5_2_rec[0].content)]
                                        }),
                                new Paragraph({
                                    children: [
                                                new TextRun('  '),
                                            ]
                                            }),

        //////////////////////////////конец 9-го пункта

                                new Paragraph({
                                    children: [
                                                new TextRun('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'),
                                            ]
                                            }),

                                new Paragraph({
                                    children: [
                                                new TextRun('  '),
                                            ]
                                            }),
                                new Paragraph({
                                    
                                    children: [
                                        new TextRun({
                                            text:"Категория: ",
                                            bold:true
                                        }),
                                        new TextRun({
                                            text: 'Результативность урока',
                                            bold:true
                                        })]
                                        }),
                                new Paragraph({
                                    children: [
                                                new TextRun('   '),
                                            ]
                                            }),
                                new Paragraph({
                                    children: [
                                                new TextRun({
                                                    text: 'Рекомендации по пункту №10 (Результативность урока)',
                                                    bold:true
                                                })]
                                            }),
                                new Paragraph({
                                    children: [
                                                new TextRun('  '),
                                            ]
                                            }),
                                new Paragraph({
                                    children: [
                                                new TextRun(k_6_1_rec[0].content)]
                                            }),
                                new Paragraph({
                                    children: [
                                                new TextRun('  '),
                                            ]
                                            }),
        //////////////////////////////конец 10-го пункта

                        ],
                });

                    let excelFileName = teacher[0].surname + '-' + Date.now();

                    await Packer.toBuffer(doc).then((buffer) => {
                         fs.writeFileSync(`files/excels/schools/tmp/${excelFileName}.docx`,buffer,(err) => {
                            if(err) throw err;
                        })
                    });

                    return res.download(path.join(__dirname,'..','..','files','excels','schools','tmp',`${excelFileName}.docx`), (err) => {
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







