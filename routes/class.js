var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
var ejs = require('ejs')
var bodyParser = require('body-parser');
var user = require("../server.js");
var content_id = 0;
var loginUser;


router.use(bodyParser.urlencoded({ extended: false }))
router.use('../js',express.static('js'));
router.use('../lib',express.static('lib'));
router.use('../img',express.static('img'));
router.use('../css',express.static('css'));

//게시판 페이징
router.get("/classes/:cur", function (req, res) {
    loginUser = require('../server').loginUser
//페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 5;
//페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
//limit 변수
    var no = "";
// 게시물의 숫자
    var totalPageCount = 0;

    var queryString = 'select count(*) as cnt from classes'
    getConnection().query(queryString, function (error2, data) {
        if (error2) {
            console.log(error2 + "메인 화면 mysql 조회 실패");
            return
        }
//전체 게시물의 숫자
        totalPageCount = data[0].cnt

//현제 페이지
        var curPage = req.params.cur;



//전체 페이지 갯수
        if (totalPageCount < 0) {
            totalPageCount = 0
        }

        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


//현재페이지가 0 보다 작으면
        if (curPage < 0) {
            no = 0
        } else {
//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 5
        }


        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };


        fs.readFile('views/class.ejs', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }


            var queryString = 'select * from classes order by datetime desc limit ?,?';
            getConnection().query(queryString, [no, page_size], function (error, rows1) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                var params = []
                var can = new Array(rows1.length)
                var queryString = 'select * from positions where '
                for(var i=0; i<rows1.length; i++){
                    queryString = queryString+"content_id=? AND type=1"
                    if(i+1!=rows1.length){
                        queryString = queryString +" OR "
                    }
                    can[i]=0;
                    params.push(rows1[i].id)
                }


                getConnection().query(queryString,params,function(error,rows2) {

                    var index = ["C","C++","C#","Java","Ruby","Python","R","Go","HTML/CSS","Javascript","Spring","Nodejs","Angularjs","Vuejs","Reactjs","PHP","Andriod","IOS","Swift","Kotlin","Objective-c","MYSQL","MongoDB","SpringBoot","OracleDB"];

                    for(var i=0;i<rows2.length;i++){

                        for(var m=0;m<rows1.length;m++){
                            if(params[m]==rows2[i].content_id&&rows2[i].none=='1') {
                                can[m]=1;
                                break;
                            }
                            if( params[m]==rows2[i].content_id&&can[m]==1){
                                break;
                            }
                        }

                        if(m!==rows1.length) {
                            continue;
                        }



                        for(var j=0;j<index.length;j++) {
                            var column = index[j]
                            if (rows2[i][column] === '1') {
                                if (loginUser[column] == '1') {
                                    for (var l = 0; l < rows1.length; l++) {
                                        if (rows2[i].content_id === params[l]) {
                                            can[l] = 1;
                                            break;
                                        }
                                    }
                                }
                                else {
                                    for (var k = 0; k < rows1.length; k++) {
                                        if (rows2[i].content_id === params[k]) {
                                            can[k] = 0;
                                            break;
                                        }

                                    }
                                    break
                                }
                            }
                        }
                    }
                    var queryString3 = "select level, id from userinfo where"
                    var authorIds = []
                    for(var i = 0; i<rows1.length;i++){
                        queryString3 = queryString3 + ' id=?';
                        authorIds.push(rows1[i].author_id)
                        if(i+1!=rows1.length){
                         queryString3 = queryString3 + ' OR'
                        }
                    }

                    getConnection().query(queryString3, authorIds,function(error, authorsLevel){

                        res.send(ejs.render(data, {
                            can: can,
                            data: rows1,
                            authorsLevel: authorsLevel,
                            classes: result2,
                            name:req.session.name,
                            credit:req.session.credit
                        }));
                    })
                })
            });
        });
    })

})


//메인화면
router.get("/class", function (req, res) {
    console.log("메인화면")

//class 으로 들어오면 바로 페이징 처리
    res.redirect('/classes/' + 1)

});


//삽입 페이지
router.get("/insert_class", function (req, res) {

    res.render('insert_class.ejs',{loginInfo:user.loginUser});

})
//클래스 삽입
router.post("/insert_class", function (req, res) {


    var now = new Date();
    var positionList = req.body.positionList;
    var body = req.body.classInfo;
    var content_id;
    var bodyClone={};
    body["author"] = user.loginUser.name;
    body["author_id"] = user.loginUser.id;
    body["datetime"] = now;
    bodyClone=body;
    // content_id++; //
    var queryString = 'insert into classes set ?'

    getConnection().query(queryString,body, function (error,result) {
        //응답
        if (error) {
            console.log("페이징 에러" + error);
            return
        }
        content_id =result.insertId;
        for(var m=0;m<positionList.length;m++){
            var condition = positionList[m].condition;
            var number = positionList[m].number;
            var description = positionList[m].description;
            var position = {};
            for(var n=0;n<condition.length;n++){
                position[condition[n]] = 1;
            }
            position["type"] = 1;
            position["content_id"] =content_id;
            position["position_id"] = m;
            position["number"] = number;
            position["description"] = description;

            var queryString2 = 'insert into positions set ?'
            getConnection().query(queryString2,position, function (error,result) {
                //응답
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }

            })
            bodyClone["id"]= content_id;
            getConnection().query('insert into classeshistory set ?',bodyClone,function(error,result){
                if(error){
                    console.log(error);
                }
                else{

                }
            })
        }
    })



    res.send();
})


//글상세보기
router.get("/detail_class/:id", function (req, res) {
    fs.readFile('views/class_detail.ejs', 'utf-8', function (error, data) {

        getConnection().query('select * from classes where id = ?', [req.params.id], function (error, class_info) {
            if(error){
                console.log(error);
            }
            getConnection().query('select * from positions where content_id = ? and type=1', [req.params.id], function (error, positions) {
                if(error){
                    console.log(error);
                }
                getConnection().query('select * from participants where content_id = ? and type=1', [req.params.id], function (error, participants) {
                    if(error){
                        console.log(error);
                    }
                    getConnection().query('select * from userinfo where id = ?', [class_info[0].author_id], function (error, author_info) {
                        if(error){
                            console.log(error);
                        }
                        res.send(ejs.render(data, {
                            "class_info": class_info[0],
                            "author_info":author_info[0],
                            "positions": positions,
                            "loginUser" : user.loginUser,
                            "participants":participants
                        }))
                    })
                })

            })

        })
    });

})


router.get("/detail_class_history/:id", function (req, res) {
    fs.readFile('views/class_history.ejs', 'utf-8', function (error, data) {

        getConnection().query('select * from classeshistory where id = ?', [req.params.id], function (error, class_info) {
            if(error){
                console.log(error);
            }
            getConnection().query('select * from positions where content_id = ? and type=1', [req.params.id], function (error, positions) {
                if(error){
                    console.log(error);
                }
                getConnection().query('select * from participants where content_id = ? and type=1', [req.params.id], function (error, participants) {
                    if(error){
                        console.log(error);
                    }
                    getConnection().query('select * from userinfo where id = ?', [class_info[0].author_id], function (error, author_info) {
                        if(error){
                            console.log(error);
                        }
                        res.send(ejs.render(data, {
                            "class_info": class_info[0],
                            "author_info":author_info[0],
                            "positions": positions,
                            "loginUser" : user.loginUser,
                            "participants":participants
                        }))
                    })
                })

            })

        })
    });

})
// 게시글 삭제
router.post("/delete_class", function (req, res) {
    var classInfo = req.body;
    console.log(classInfo);
    getConnection().query('delete from classes where id=?', classInfo.id, function (error) {
        if (error) {
            console.log("에러");
            return
        }
        else{
            getConnection().query('delete from positions where content_id=? and type=1', classInfo.id, function (error) {
                if (error) {
                    console.log("에러");
                    return
                }
                else{

                    getConnection().query('delete from participants where content_id=? and type=1', classInfo.id, function (error) {
                        if (error) {
                            console.log("에러");
                            return
                        }
                        else{
                            res.send();
                        }
                    })
                }
            })

        }
    })
})

// 클래스 참
router.post("/participate_class", function (req, res) {
    var participant = req.body;
    console.log("참가신청완료");
    getConnection().query('insert into participants set ?', participant, function (error) {
        if (error) {
            console.log("페이징 에러" + error);
            return
        }
        else{
            res.send();
        }
    })
})

router.post("/delete_participant", function (req, res) {
    var cancelInfo = req.body;

    getConnection().query('delete from participants where type = ? and content_id = ? and position_id = ? and participant_id =?' , [cancelInfo.type,cancelInfo.content_id,cancelInfo.position_id,cancelInfo.participant_id], function (error) {
        if (error) {
            console.log("페이징 에러" + error);

            return
        }
        else{
            console.log("취소완료");
            res.send();
        }
    })
})

// skill tag filtering
router.get("/classes/skills/:tags", function (req, res) {

    loginUser = require('../server').loginUser
    var skills = req.params.tags;
    skills = skills.split(',');

    for (var i = 0; i < skills.length; i++) {
        if (skills[i] == 'CSharp') {
            skills[i] = "C#"
        }
    }
    for (var i = 0; i < skills.length; i++) {
        if (skills[i] == 'CPlusPlus') {
            skills[i] = "C++"
        }
    }
    for (var i = 0; i < skills.length; i++) {
        if (skills[i] == 'HTMLANDCSS') {
            skills[i] = "HTML/CSS"
        }
    }
    var selectedContent = [];

    fs.readFile('views/class_tags.ejs', 'utf-8', function (error, data) {
        getConnection().query('select * from positions where type=1', function (error, positions) { //TODO type 바꿀것
                if (error) {
                    console.log(error + "mysql 조회 실패");
                    return;
                }

                var index = ["C", "C++", "C#", "Java", "Ruby", "Python", "R", "Go", "HTML/CSS", "Javascript", "Spring", "Nodejs", "Angularjs", "Vuejs", "Reactjs", "PHP", "Andriod", "IOS", "Swift", "Kotlin", "Objective-c", "MYSQL", "MongoDB", "SpringBoot", "OracleDB"];

                for (var i = 0; i < positions.length; i++) {
                    for (var j = 0; j < skills.length; j++) {
                        if (positions[i][skills[j]] == '1') {
                            selectedContent.push(positions[i].content_id);
                        }
                    }
                }
                if (selectedContent.length == 0) {
                    fs.readFile('views/no_class.ejs', 'utf-8', function (error, data) {
                        for (var i = 0; i < skills.length; i++) {
                            if (skills[i] == 'HTML/CSS') {
                                skills[i] = "HTMLANDCSS"
                            }
                        }
                        for (var i = 0; i < skills.length; i++) {
                            if (skills[i] == 'C#') {
                                skills[i] = "CSharp"
                            }
                        }
                        for (var i = 0; i < skills.length; i++) {
                            if (skills[i] == "C++") {
                                skills[i] = 'CPlusPlus'
                            }
                        }
                        res.send(ejs.render(data, {
                            name: req.session.name,
                            credit: req.session.credit,
                            tags: skills,
                        }));

                    })
                }
                else{
                    var queryString1 = 'select * from classes where';


                    for (var i = 0; i < selectedContent.length; i++) {
                        queryString1 = queryString1 + ' id=' + selectedContent[i];
                        if (i + 1 != selectedContent.length) {
                            queryString1 = queryString1 + ' OR'
                        }
                    }
                    getConnection().query(queryString1, function (error, rows) {
                        if (error) {
                            console.log(error + "mysql 조회 실패");
                            return;
                        }
                        var can = new Array(rows.length)
                        var queryString2 = 'select * from positions where '

                        for (var i = 0; i < rows.length; i++) {
                            queryString2 = queryString2 + "content_id=? AND type=1" //TODO type=0
                            if (i + 1 !== rows.length) {
                                queryString2 = queryString2 + " OR "
                            }
                            can[i] = 0;
                        }
                        getConnection().query(queryString2, selectedContent, function (error, rows2) {

                            var index = ["C", "C++", "C#", "Java", "Ruby", "Python", "R", "Go", "HTML/CSS", "Javascript", "Spring", "Nodejs", "Angularjs", "Vuejs", "Reactjs", "PHP", "Andriod", "IOS", "Swift", "Kotlin", "Objective-c", "MYSQL", "MongoDB", "SpringBoot", "OracleDB"];

                            for (var i = 0; i < rows2.length; i++) {

                                for (var m = 0; m < rows.length; m++) {
                                    if (selectedContent[m] == rows2[i].content_id && rows2[i].none == '1') {
                                        can[m] = 1;
                                        break;
                                    }
                                    if (selectedContent[m] == rows2[i].content_id && can[m] == 1) {
                                        break;
                                    }
                                }

                                if (m !== rows.length) {
                                    continue;
                                }


                                for (var j = 0; j < index.length; j++) {
                                    var column = index[j]
                                    if (rows2[i][column] === '1') {
                                        if (loginUser[column] == '1') {
                                            for (var l = 0; l < rows.length; l++) {
                                                if (rows2[i].content_id === selectedContent[l]) {
                                                    can[l] = 1;
                                                    break;
                                                }
                                            }
                                        } else {
                                            for (var k = 0; k < rows.length; k++) {
                                                if (rows2[i].content_id === selectedContent[k]) {
                                                    can[k] = 0;
                                                    break;
                                                }

                                            }
                                            break
                                        }
                                    }
                                }


                            }
                            for (var i = 0; i < skills.length; i++) {
                                if (skills[i] == 'HTML/CSS') {
                                    skills[i] = "HTMLANDCSS"
                                }
                            }
                            for (var i = 0; i < skills.length; i++) {
                                if (skills[i] == 'C#') {
                                    skills[i] = "CSharp"
                                }
                            }
                            for (var i = 0; i < skills.length; i++) {
                                if (skills[i] == "C++") {
                                    skills[i] = 'CPlusPlus'
                                }
                            }

                            var queryString3 = "select level, id from userinfo where"
                            var authorIds = []
                            for(var i = 0; i<rows.length;i++){
                                queryString3 = queryString3 + ' id=?';
                                authorIds.push(rows[i].author_id)
                                if(i+1!=rows.length){
                                    queryString3 = queryString3 + ' OR'
                                }
                            }

                            getConnection().query(queryString3, authorIds,function(error, authorsLevel){

                                res.send(ejs.render(data, {
                                    can: can,
                                    data: rows,
                                    authorsLevel:authorsLevel,
                                    name: req.session.name,
                                    credit: req.session.credit,
                                    tags: skills,
                                }));
                            })



                        })

                    });
                }


            }
        );

    })
})


//mysql db 연결 함수

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'userinfo',
    password: 'root'
})


//디비 연결 함수
function getConnection() {
    return pool
}


module.exports = router


