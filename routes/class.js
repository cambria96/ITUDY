var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var fs = require('fs')
var ejs = require('ejs')
var bodyParser = require('body-parser');
var user = require("../server.js");
var content_id = 0;


router.use(bodyParser.urlencoded({ extended: false }))

//게시판 페이징
router.get("/classes/:cur", function (req, res) {

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

        console.log("현재 페이지 : " + curPage, "전체 게시물 : " + totalPageCount);


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
            getConnection().query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    data: result,
                    classes: result2,
                    name:req.session.name,
                    credit:req.session.credit
                }));
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
    console.log("삽입 페이지 나와라")
    res.render('insert_class.ejs',{loginInfo:user.loginUser});
})
//삽입 포스터 데이터
router.post("/insert_class", function (req, res) {
    console.log("삽입 포스트 데이터 진행")
    var now = new Date();
    var body = req.body;
    content_id++;

    getConnection().query('insert into classes(id,author,author_id,title,period,role,credit,description,datetime,icon,total_participant) values (?,?,?,?,?,?,?,?,?,?,?)', [content_id,  user.loginUser.name, user.loginUser.id, body.title,body.period,body.role,body.credit,body.description,now,body.icon,body.total_participant], function (error) {
//응답
        if (error) {
            console.log("페이징 에러" + error);
            return
        }
        res.redirect('class');
    })

})


//글상세보기
router.get("/detail_class/:id", function (req, res) {
    console.log("수정 진행")

    fs.readFile('views/class_detail.ejs', 'utf-8', function (error, data) {
        getConnection().query('select * from classes where id = ?', [req.params.id], function (error, result) {
            res.send(ejs.render(data, {
                data: result[0]
            }))
        })
    });


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


