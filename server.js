
var express = require('express');
var app = express();
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'userinfo'
};
var sessionStore = new MySQLStore(options);

var connection = mysql.createConnection(options);

connection.connect();
var info;

connection.query('SELECT * from userinfo',function(err,rows,fields){
        if(!err){
            console.log('The solution is: ',rows);
            info = rows;
        }
        else{
            console.log('Error while performing Query.',err);
        }
});


var http = require('http');

var server = http.createServer();



app.set('port',3000);
app.set('view engine','html');
app.engine('html',ejs.renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use('/js',express.static('js'));
app.use('/lib',express.static('lib'));
app.use('/img',express.static('img'));
app.use('/css',express.static('css'));
app.use('/contactform',express.static('contactform'));




http.createServer(app).listen(app.get('port'),function(){
    console.log("express start: %d",app.get('port'));
})


app.get('/',function(req,res){
    res.render("main.html");
})
app.get('/signup',function(req,res){
    res.render("signup.html");
})
app.get('/mypage',function(req,res){
    connection.query("SELECT * from participants WHERE (`participant_id` = '"+loginUser.id+"');",function(err,rows,result){
        if(!err){
            console.log("참가 목록 완료");
            partyList=rows;
            var contentList =[];
            if(partyList.length==0){
                res.render("mypage.ejs",{loginInfo:loginUser,"contentList":contentList});
            }
            for(var m=0;m<partyList.length;m++){
                var n=0;
                connection.query("SELECT * from classes WHERE (`id` = '"+partyList[n].content_id+"');",function(err,rows,result){
                    if(!err){
                        contentList.push(rows[0]);
                        if(n==partyList.length-1){
                            res.render("mypage.ejs",{loginInfo:loginUser,"contentList":contentList});
                        }
                        n++;
                    }
                    else{
                        console.log('Error while performing Query.',err);
                    }
                });
            }
        }
        else{
            console.log('Error while performing Query.',err);
            res.send();
        }
    });
})

app.use(session({
    key : 'sid',
    secret : 'secret',
    resave : false,
    saveUninitialized : false,
    store : new MySQLStore(options)
}));

var loginUser;

app.post('/success',function(req,res){
    
    var session = req.session;
    
    var nameAry = new Array();
    var check = 0;    
    for(var i=0;i<info.length;i++){
        nameAry.push(info[i].id);
        if(req.body.id == info[i].id){
             if(req.body.password == info[i].password){
                 check=1;
                 break;
             }
        }
    }
    if(check){
        loginUser=info[i];
        req.session.name = loginUser.name
        req.session.credit = loginUser.credit;
        req.session.id = loginUser.id;
        // alert(req.session.name + "님 환영합니다.");
        exports.loginUser = loginUser;
        req.session.save(()=>{
            res.render('after_login.ejs',{loginInfo:loginUser});    
        });
    
    }
    else{
        console.log('로그인 실패');
        res.render('main.html');
    }

});

app.get('/home',function(req,res){
    
    if(req.session.name){
        req.session.save(()=>{
            res.render('after_login.ejs',{loginInfo:loginUser});    
        });
        
    }
    else{
        console.log("af");
        res.render("main.html");
    }
})


app.get('/logout', function(req,res){
    delete req.session.name;
    req.session.save(()=>{
        res.render('main.html');
    })
});


app.post("/done",function(req,res){
    var user = req.body;
    
    connection.query('insert into userinfo set ?',user,function(err,result){
        if(!err){
            console.log("사용자 등록 성공");
            console.log("new user id : "+ req.body.id);
            console.log("new user password : "+req.body.password);
            console.log('The solution is: ',result);
            console.log('회원가입 완료');
            
        }
        else{
            console.log('Error while performing Query.',err);
        }
    });
    connection.query('SELECT * from userinfo',function(err,rows,fields){
            if(!err){
                console.log('The solution is: ',rows);
                info = rows;
            }
            else{
                console.log('Error while performing Query.',err);
            }
    });
    res.render("main.html");
})

app.get('/ranking', function(req,res){
        req.session.name = loginUser.name;
        req.session.credit = loginUser.credit;
        req.session.id = loginUser.id;
        req.session.ranking = loginUser.ranking;
        // alert(req.session.name + "님 환영합니다.");
        console.log("session name" + req.session.name);
        console.log("credit"+req.session.credit);
        // req.session.save(()=>{
        //     res.render('ranking.ejs',{name:req.session.name,credit:req.session.credit});
        // });

       

        info.sort(function(a,b){
            return a.credit > b.credit ? -1 : a.credit < b.credit? 1:0;
        });

        for (var k=0; k<info.length; k++){
            if(info[k].id == loginUser.id){
                break;
            }
        }
        // DB에 랭킹 저장
        // for(var k=0;k<info.length;k++){
            
        //     user_id = info[k].id;
            
        //     var template = `update userinfo set ranking = ${k+1} where id="${user_id}"`;
        //     connection.query(template,function(err,rows,fields){
        //         if(!err){
        //             console.log('The solution is: ',rows);
                    
                    
                    
        //         }
        //         else{
        //             console.log('Error while performing Query.',err);
        //         }
        // });
       
        
        //}

        res.render('ranking.ejs',{name:req.session.name,credit:req.session.credit, 
            id:loginUser.id, ranking : k+1, 
            id1:info[0].id, id2:info[1].id, id3: info[2].id, id4: info[3].id, id5: info[4].id,
            credit1:info[0].credit, credit2 : info[1].credit, credit3: info[2].credit, credit4 : info[3].credit,credit5 : info[4].credit});
        
        
});
// // 기본정보 수정
// app.post("/modify",function(req,res){
//     var userName = req.body.name;
//     var userPhone = req.body.phone;
//     connection.query("UPDATE `userinfo`.`userinfo` SET `name` = '"+userName+"',`phone` = '"+userPhone+"' WHERE (`id` = '"+loginUser.id+"');",function(err,result){
//         if(!err){
//             console.log("수정완료");    
//         }
//         else{
//             console.log('Error while performing Query.',err);
//         }
//     });
//     loginUser.name = userName;
//     loginUser.phone = userPhone;
//     res.send();
// })
// 분야 수정
app.post("/modify",function(req,res){
    var user = req.body
    console.log(user);
    connection.query("UPDATE `userinfo`.`userinfo` SET ? WHERE (`id` = '"+loginUser.id+"');",user,function(err,result){
        if(!err){
            console.log("수정완료");    
        }
        else{
            console.log('Error while performing Query.',err);
        }
    });
    connection.query("SELECT * from userinfo WHERE (`id` = '"+loginUser.id+"');",user,function(err,rows,result){
        if(!err){
            console.log("수정완료");   
            loginUser =  rows[0];
            exports.loginUser = loginUser;
        }
        else{
            console.log('Error while performing Query.',err);
        }
    });
    res.send();
});

var userClass =[];
var userStudy=[];

app.get("/introduction", function(req,res){
    res.render('introduction.ejs',{name:req.session.name,credit:req.session.credit});
})
app.post("/requestUserInfo",function(req,res){
    res.send({"loginUser":loginUser})
})
app.post("/requestContent",function(req,res){
    connection.query("SELECT * from classes WHERE (`author_id` = '"+loginUser.id+"');",function(err,rows,result){
        if(!err){
            console.log("클래스 로드 완료");
            userClass=rows;
            connection.query("SELECT * from study WHERE (`author_id` = '"+loginUser.id+"');",function(err,rows,result){
                if(!err){
                    console.log("스터디 로드 완료");
                    userStudy=rows;
                    res.send({loginUser: loginUser,userClass: userClass, userStudy:userStudy})
                }
                else{
                    console.log('Error while performing Query.',err);
                }
            });
        }
        else{
            console.log('Error while performing Query.',err);
        }
    });
 
})

// 신청목록 로드
var partyList;
app.post("/requestParty",function(req,res){
    
})
// app.get("/class",function(req,res){
//     res.render('class.ejs');
// })
//
// app.get("/study",function(req,res){
//     res.render('study.ejs');
// })
///////////////////////////// 게시판 구현 ////////////////////////

//클래스 게시판
var classRouter = require('./routes/class.js')
app.use(classRouter)

var studyRouter = require('./routes/study.js')
app.use(studyRouter)

///////////////////////////////////////////////////////////////////

