
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
    database: 'userinfo',
    dateStrings: 'date'
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
            partyList=rows;
            var contentList =[];
            var classList=[];
            var studyList=[];
            var position_id_class=[];
            var position_id_study=[];
            if(partyList.length==0){
                res.render("mypage.ejs",{
                    "loginInfo":loginUser,
                    "contentList":contentList,
                    "classList":classList,
                    "studyList":studyList,
                    "position_id_class":""
                });
            }
            for(var m=0;m<partyList.length;m++){
                var n=0;
                connection.query("SELECT * from classes WHERE (`id` = '"+partyList[m].content_id+"');",function(err,rows,result){
                    if(!err){
                        if(partyList[n].type==1){
                            contentList.push(rows[0]);
                            classList.push(rows[0]);
                            position_id_class.push(partyList[n].position_id);
                            
                        }
                        else{
                            var a=0;
                            connection.query("SELECT * from study WHERE (`id` = '"+partyList[n].content_id+"');",function(err,rows,result){
                                if(!err){
                                    contentList.push(rows[0]);
                                    studyList.push(rows[0]);
                                    position_id_study.push(partyList[a].position_id);
                                    if(contentList.length==partyList.length){
                                        res.render("mypage.ejs",{
                                            "loginInfo":loginUser,
                                            "contentList":contentList,
                                            "classList":classList,
                                            "studyList":studyList,
                                            "position_id_class":position_id_class,
                                            "position_id_study":position_id_study
                                        });
                                    }
                                }
                                else{
                                    console.log('Error while performing Query.',err);
                                }
                                a++;
                            });
                        }
                    }
                    else{
                        console.log('Error while performing Query.',err);
                    }
                    if(contentList.length==partyList.length){
                        res.render("mypage.ejs",{
                            "loginInfo":loginUser,
                            "contentList":contentList,
                            "classList":classList,
                            "studyList":studyList,
                            "position_id_class":position_id_class,
                            "position_id_study":position_id_study
                        });
                    }
                    n++;
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
        res.render("main.html");
    }
})


app.get('/logout', function(req,res){
    delete req.session.name;

    connection.query('SELECT * from userinfo',function(err,rows,fields){
        if(!err){
            console.log('The solution is: ',rows);
            info = rows;
            req.session.save(()=>{
                res.render('main.html');
            })
        }
        else{
            console.log('Error while performing Query.',err);
        }
    });
    
});


app.post("/done",function(req,res){
    var user = req.body;
    
    connection.query('insert into userinfo set ?',user,function(err,result){
        if(!err){
 
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

        connection.query('SELECT * from userinfo',function(err,rows,fields){
            if(!err){
                info = rows;
                info.sort(function(a,b){
                    return a.credit > b.credit ? -1 : a.credit < b.credit? 1:0;
                });
        
                for (var k=0; k<info.length; k++){
                    if(info[k].id == loginUser.id){
                        break;
                    }
                }
        
                res.render('ranking.ejs',{name:req.session.name,credit:req.session.credit, 
                    id:loginUser.id, ranking : k+1, 
                    id1:info[0].id, id2:info[1].id, id3: info[2].id, id4: info[3].id, id5: info[4].id,
                    credit1:info[0].credit, credit2 : info[1].credit, credit3: info[2].credit, credit4 : info[3].credit,credit5 : info[4].credit});
                }
            else{
                console.log('Error while performing Query.',err);
            }
        });

        
        
        
});

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
var participants=[];

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
                    //console.log("유저 클래스: "+ userClass);
                    userStudy=rows;
                    connection.query("SELECT * from participants",function(err,rows,result){
                        if(!err){

                            console.log("신청자 로드 완료");
                            
                            participants =rows;
                            console.log('신청자길이' + participants.length);

                            connection.query("SELECT * from positions", function(err,rows,result){
                                if(!err){
                                    positions = rows;
                                    console.log("포지션 길이 : "+positions.length);
                                    res.send({loginUser: loginUser,userClass: userClass, userStudy:userStudy, participants:participants, positions:positions});

                                }
                                else{
                                    console.log("포지션 로드 실패",err);
                                }

                            })
                        }
                        else{
                            console.log("신청자로드실패", err);
                        }
                        
                    })
                    
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

//신청중인 그룹 삭제
app.post("/delete_participant_both", function (req, res) {
    var cancelInfo = req.body;
    console.log(req);
    connection.query('delete from participants where type = ? and content_id = ? and position_id = ? and participant_id =?' , [cancelInfo.type,cancelInfo.content_id,cancelInfo.position_id,cancelInfo.participant_id], function (error) {
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


// 신청목록 로드
var partyList;
app.post("/request_confirm",function(req,res){
    
    connection.query('select * from confirm where users like "%'+loginUser.id+'%"',function(err,rows,result){
        if(!err){
            console.log(rows);  
            res.send({"confirmList":rows});
        }
        else{
            console.log('Error while performing Query.',err);
        }
    })

})
app.post("/insert_confirm",function(req,res){
    var users = req.body;
    
    var userList = users.users.split(",");
    var userName= [];
    var userEmail=[];
    var userPhone=[];
    var n=0;
    var confirmData={};
    var addCredit = users.credit * (userList.length-1);
    var subCredit = users.credit;
    var userCredit = loginUser.credit;
    var userRole = users.role;
    var petabyte = "../img/petabyte.png";
    var terabyte = "../img/terabyte.png";
    var gigabyte = "../img/gigabyte.png";
    var megabyte = "../img/megabyte.png";
    var byte = "../img/byte.png";
    var n =0;
    console.log(userRole);
    if(userRole == '멘토'){
        var firstQuery = 'update userinfo set credit = credit + ? where id = ?';
        var normalQuery = 'update userinfo set credit = credit - ? where id = ?';
    }
    else if(userRole == '멘티'){
        var firstQuery = 'update userinfo set credit = credit - ? where id = ?' ;
        var normalQuery = 'update userinfo set credit = credit + ? where id = ?';
    }
    
    for(var m=0;m<userList.length;m++){
        if(m==0){
            userCredit = userCredit+ addCredit;
            connection.query(firstQuery,[addCredit,userList[m]],function(err){
                if(err){
                    console.log(err);
                }
                else{
                    connection.query('select * from userinfo where id = ?',[userList[n]],function(err,rows){
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(rows[0].credit >= 10000){
                                connection.query('update userinfo set level = ? where id = ?',[petabyte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })

                            }
                            else if(rows[0].credit <10000&& rows[0].credit >=6000){
                                connection.query('update userinfo set level = ? where id = ?',[terabyte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })

                            }else if(rows[0].credit <6000&& rows[0].credit >=3500){
                                connection.query('update userinfo set level = ? where id = ?',[gigabyte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })
                                
                            }else if(rows[0].credit <3500&& rows[0].credit >=1500){
                                connection.query('update userinfo set level = ? where id = ?',[megabyte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })
                                
                            }else{
                                connection.query('update userinfo set level = ? where id = ?',[byte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })
                            }
                            n++;
                        }
                    })
                }
            })
        }
        else{
            userCredit = userCredit -subCredit;
            connection.query(normalQuery,[subCredit,userList[m]],function(err){
                if(err){
                    console.log(err);
                }
                else{
                    connection.query('select * from userinfo where id = ?',[userList[n]],function(err,rows){
                        if(err){
                            console.log(err);
                            
                        }
                        else{
                            if(rows[0].credit >= 10000){
                                connection.query('update userinfo set level = ? where id = ?',[petabyte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })

                            }
                            else if(rows[0].credit <10000&& rows[0].credit >=6000){
                                connection.query('update userinfo set level = ? where id = ?',[terabyte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })

                            }else if(rows[0].credit <6000&& rows[0].credit >=3500){
                                connection.query('update userinfo set level = ? where id = ?',[gigabyte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })
                                
                            }else if(rows[0].credit <3500&& rows[0].credit >=1500){
                                connection.query('update userinfo set level = ? where id = ?',[megabyte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })
                                
                            }else{
                                connection.query('update userinfo set level = ? where id = ?',[byte,rows[0].id],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                })
                            }
                            n++;
                        }
                    })
                }
            })
        }


        connection.query("SELECT * from userinfo WHERE (`id` = '"+userList[m]+"');",function(err,rows,result){
            if(!err){
                userName.push(rows[0].name);
                userEmail.push(rows[0].email);
                userPhone.push(rows[0].phone);

                if(n==userList.length-1){
                    userName = userName.toString();
                    userEmail = userEmail.toString();
                    userPhone = userPhone.toString();
                    confirmData["title"] = req.body.title;
                    confirmData["content_id"] = users.content_id;
                    confirmData["users"] = req.body.users;
                    confirmData["username"] = userName;
                    confirmData["email"] = userEmail;
                    confirmData["phonenum"] = userPhone;
                    confirmData["number"] = req.body.number;
                    confirmData["type"] = req.body.type;


                    connection.query("insert into confirm set ?",confirmData,function(err,result){
                        if(!err){
                            if(req.body.type == 1){
                                connection.query('delete from classes where id = ?',users.content_id,function(err,result){
                                    if(!err){
                                        connection.query('delete from positions where content_id = ?',users.content_id,function(err,result){
                                            if(!err){
                                                connection.query('delete from participants where content_id = ?',users.content_id,function(err,result){
                                                    if(!err){
                                                        connection.query('select * from userinfo where id = ? ',loginUser.id,function(err,rows){

                                                            if(!err){
                                                                console.log("그룹 생성 완료");
                                                                loginUser = rows[0];
                                                                exports.loginUser = loginUser;
                                                                res.send();
                                                            }
                                                            else{
                                                                console.log(err);
                                                            }
                                                        })
                                                        
                                                    }
                                                    else{
                                                        console.log('Error while performing Query.',err);
                                                    }
                                                })
                                                
                                            }
                                            else{
                                                console.log('Error while performing Query.',err);
                                            }
                                        })
                                        
                                    }
                                    else{
                                        console.log('Error while performing Query.',err);
                                    }
                                })
                            }else{
                                connection.query('delete from study where id = ?',users.content_id,function(err,result){
                                    if(!err){
                                        connection.query('delete from positions where content_id = ?',users.content_id,function(err,result){
                                            if(!err){
                                                connection.query('delete from participants where content_id = ?',users.content_id,function(err,result){
                                                    if(!err){
                                                        connection.query('select * from userinfo where id = ? ',loginUser.id,function(err,rows){

                                                            if(!err){
                                                                console.log("그룹 생성 완료");
                                                                loginUser = rows[0];
                                                                exports.loginUser = loginUser;
                                                                res.send();
                                                            }
                                                            else{
                                                                console.log(err);
                                                            }
                                                        })
                                                    }
                                                    else{
                                                        console.log('Error while performing Query.',err);
                                                    }
                                                })
                                                
                                            }
                                            else{
                                                console.log('Error while performing Query.',err);
                                            }
                                        })
                                        
                                    }
                                    else{
                                        console.log('Error while performing Query.',err);
                                    }
                                })

                            }
                            
                        }
                        else{
                            console.log('Error while performing Query.',err);
                        }
                    })
                    console.log(confirmData)
                    
                }
                n++;
            }
            else{
                console.log('Error while performing Query.',err);
            }
        });
    }
})

app.post("/add_stack",function(req,res){
    var content_id = req.body.content_id;
    var agreeName = req.body.agree;
    console.log(agreeName);
    connection.query('update confirm set stack = stack + 1 ,agree = concat(ifnull(agree,""),?) where content_id = ?',[agreeName,content_id],function(err,result){
        if(!err){
            
            connection.query('select * from confirm where content_id = ?',[content_id],function(err,rows,result){
                if(!err){
                    console.log("삭제 스택 추가");
                    console.log(rows[0].stack)
                    console.log(rows[0].number)
                    if(rows[0].stack == rows[0].number){

                        connection.query('delete from confirm where content_id = ?',[content_id],function(err){

                            if(!err){
                                res.send({"check":1});
                            }
                            else{
                                console.log(err);
                            }
                        })
                    }
                    else{

                        res.send({"check":0});
                    }
                    
                    
                }
                else{
                    console.log('Error while performing Query.',err);
                }
            })

        }
        else{
            console.log('Error while performing Query.',err);
        }
    })
})

app.post("/delete_stack",function(req,res){
    var content_id = req.body.content_id;
    var agreeName = req.body.agree;
    console.log(agreeName);
    connection.query('update confirm set stack = stack - 1 ,agree = ? where content_id = ?',[agreeName,content_id],function(err,result){
        if(!err){
            
            console.log("삭제 스택 감소");
            res.send();
        }
        else{
            console.log('Error while performing Query.',err);
        }
    })
})
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

