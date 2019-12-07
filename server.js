
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







app.use(session({
    key : 'sid',
    secret : 'secret',
    resave : false,
    saveUninitialized : false,
    store : new MySQLStore(options)
}));
app.get('/',function(req,res){
    if(req.session.loginUser !=undefined){
        res.render('after_login.ejs',{loginInfo:req.session.loginUser});
    }
    else{
        res.render("main.html");
    }
    
})



var loginUser;
app.post("/modify",function(req,res){
    var user = req.body
    console.log(user);
    connection.query("UPDATE `userinfo`.`userinfo` SET ? WHERE (`id` = '"+req.session.loginUser.id+"');",user,function(err,result){
        if(!err){
            connection.query("SELECT * from userinfo WHERE (`id` = '"+req.session.loginUser.id+"');",user,function(err,rows,result){
                if(!err){
                    console.log("수정완료");   
                    req.session.loginUser =  rows[0];
                    res.send();
                    exports.loginUser = loginUser;
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
    
});

app.post('/success',function(req,res){    
    var check = 0;    
    for(var i=0;i<info.length;i++){
        if(req.body.id == info[i].id){
             if(req.body.password == info[i].password){
                 if(info[i].authority == 1){
                    check=1;
                    break;
                 }
                 else{
                     check = 2;
                     break;
                 }
             }
        }

    }
    console.log(check);
    if(check==1){
        console.log("로그인 성공");
        loginUser=info[i];
        // req.session.name = loginUser.name
        // req.session.credit = loginUser.credit;
        // req.session.id = loginUser.id;
        // req.session.credit = loginUser.credit;
        // alert(req.session.name + "님 환영합니다.");
        req.session.loginUser = loginUser;
        exports.loginUser = loginUser;
        req.session.save(()=>{
            
            res.render('after_login.ejs',{loginInfo:req.session.loginUser});    
        });

    }
    else if(check==2){
        res.write("<head><meta charset = 'utf-8'></head>");
        res.write("<script>");
        res.write("alert('이메일 인증이 완료되지 않았습니다.');");
        res.write("history.back();");
        res.write("</script>");
        console.log("인증실패")
        res.send();
        
    }
    else{
        res.write("<head><meta charset='utf-8'></head>");
        res.write('<script>');
        res.write("alert('아이디/비밀번호가 존재하지 않습니다.');");
        res.write("history.back();");
        res.write("</script>");
        console.log('로그인 실패');
        res.send();
    }

});

app.use(function(req, res, next) {
    if(req.session.loginUser){
        if(req.path != "/logout"){
            connection.query("select * from userinfo where id = ?",req.session.loginUser.id,function(err,rows){

                if(!err){
                    req.session.loginUser = rows[0];
                }
                else{
                    console.log(err);
                }
            })
        }
        
    }

    next();
    
 });

app.get('/home',function(req,res){
    
    if(req.session.loginUser){
        req.session.save(()=>{
            res.render('after_login.ejs',{loginInfo:req.session.loginUser});    
        });
        
    }
    else{
        res.render("main.html");
    }
})

app.get('/signup',function(req,res){
    res.render("signup.html");
})
app.get('/mypage',function(req,res){
    connection.query("SELECT * from participants WHERE (`participant_id` = '"+req.session.loginUser.id+"');",function(err,rows,result){
        if(!err){
            partyList=rows;
            var contentList =[];
            var classList=[];
            var studyList=[];
            var position_id_class=[];
            var position_id_study=[];
            if(partyList.length==0){
                console.log(req.session.loginUser);
                res.render("mypage.ejs",{
                    "loginInfo":req.session.loginUser,
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
                                        console.log(req.session.loginUser);
                                        res.render("mypage.ejs",{
                                            "loginInfo":req.session.loginUser,
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
                        console.log(req.session.loginUser);
                        res.render("mypage.ejs",{
                            "loginInfo":req.session.loginUser,
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
app.get('/logout', function(req,res){
    req.session.destroy(function(){
        req.session;
    });
        
        

    connection.query('SELECT * from userinfo',function(err,rows,fields){
        if(!err){
            console.log('The solution is: ',rows);
            info = rows;
            res.render('main.html');
            
        }
        else{
            console.log('Error while performing Query.',err);
        }
    });
    
});

const nodemailer = require('nodemailer');

app.post("/mail",function(req,res){
    var user = req.body;
    console.log("이메일:" + user.email);
  
    connection.query('insert into userinfo set ?',user,function(err,result){
        if(!err){
            console.log('디비 저장 완료');
            
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
    

    var transporter = nodemailer.createTransport({
        service : 'gmail',
        auth:{
            user : 'itudy2019@gmail.com',
            pass : 'qwertyqwerty11'
        }
    });

    var mailOptions={
        from : 'itudy2019@gmail.com',
        to: user.email,
        subject : 'ITUDY - 인증을 하든말든 맘대로하세요',
        html : '<img src = ../img/new_logo_hover>'+
                '<h1> 안녕하세요! ITUDY와 함께해주셔서 감사하지않습니다</h1>'+
                '<p style="color : red">아래의 링크를 클릭하면 되는데 하든말든 알바는 아닙니다.</p>'+
                '<a href = "http://34.97.93.49:3000/auth/?email='+user.email+'&token=abcdefg">인증하기</a>'
    }

    transporter.sendMail(mailOptions, function(error,info){
        if(error){
            console.log(error);
        }
        else{
            console.log("Email sent : "+info.response);
            res.send();
        }
    });
})

app.get("/auth", function(req,res,next){
    var email = req.query.email;
    var token = req.query.token;
    console.log("이멜 : "+email);
    console.log("쿼리:" + token );
    connection.query("UPDATE userinfo SET authority = 1 WHERE (`email` = '"+email+"');",function(err,rows,result){
        if(!err){
            console.log('권한 1로 수정!');
            connection.query('SELECT * from userinfo',function(err,rows,fields){
                if(!err){
                    info = rows;
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
    res.render("email_verify_complete.html")
});

app.get("/done",function(req,res){
    res.render('main.html');
})

app.get('/ranking', function(req,res){

        connection.query('SELECT * from userinfo',function(err,rows,fields){
            if(!err){
                info = rows;
                info.sort(function(a,b){
                    return a.credit > b.credit ? -1 : a.credit < b.credit? 1:0;
                });
        
                for (var k=0; k<info.length; k++){
                    if(info[k].id == req.session.loginUser.id){
                        break;
                    }
                }
        
                res.render('ranking.ejs',{name:req.session.loginUser.name,credit:req.session.loginUser.credit, 
                    id:req.session.loginUser.id,level:req.session.loginUser.level, ranking : k+1, 
                    id1:info[0].id, id2:info[1].id, id3: info[2].id, id4: info[3].id, id5: info[4].id,
                    credit1:info[0].credit, credit2 : info[1].credit, credit3: info[2].credit, credit4 : info[3].credit,credit5 : info[4].credit,
                    level1:info[0].level,level2:info[1].level,level3:info[2].level,level4:info[3].level,level5:info[4].level});
                }
            else{
                console.log('Error while performing Query.',err);
            }
        });

        
        
        
});



var userClass =[];
var userStudy=[];
var participants=[];

app.get("/introduction", function(req,res){
    res.render('introduction.ejs',{name:req.session.loginUser.name,credit:req.session.loginUser.credit});
})
app.post("/requestUserInfo",function(req,res){
    res.send({"loginUser":req.session.loginUser})
})
app.post("/requestContent",function(req,res){
    connection.query("SELECT * from classes WHERE (`author_id` = '"+req.session.loginUser.id+"');",function(err,rows,result){
        if(!err){
            console.log("클래스 로드 완료");
            userClass=rows;
            connection.query("SELECT * from study WHERE (`author_id` = '"+req.session.loginUser.id+"');",function(err,rows,result){
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
                                    res.send({loginUser: req.session.loginUser,userClass: userClass, userStudy:userStudy, participants:participants, positions:positions});

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
    
    connection.query('select * from confirm where users like "%'+req.session.loginUser.id+'%"',function(err,rows,result){
        if(!err){
            console.log(rows);  
            res.send({"confirmList":rows,"loginUser":req.session.loginUser});
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
            
            if(req.body.type ==1){
                if(userRole == '멘토'){
                    connection.query('update userinfo set mento = mento + 1 where id = ?',[userList[m]],function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }
                else if(userRole == '멘티'){
                    connection.query('update userinfo set mentee = mentee + 1 where id = ?',[userList[m]],function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }   
            }
            else{
                connection.query('update userinfo set study = study + 1 where id = ?',[userList[m]],function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
             
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

            if(req.body.type ==1){
                if(userRole == '멘토'){
                    connection.query('update userinfo set mentee = mentee + 1 where id = ?',[userList[m]],function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }
                else if(userRole == '멘티'){
                    connection.query('update userinfo set mento = mento + 1 where id = ?',[userList[m]],function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }   
            }
            else{
                connection.query('update userinfo set study = study + 1 where id = ?',[userList[m]],function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
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
                                                        connection.query('select * from userinfo where id = ? ',req.session.loginUser.id,function(err,rows){

                                                            if(!err){
                                                                console.log("그룹 생성 완료");
                                                                req.session.loginUser = rows[0];
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
                                                        connection.query('select * from userinfo where id = ? ',req.session.loginUser.id,function(err,rows){

                                                            if(!err){
                                                                console.log("그룹 생성 완료");
                                                                req.session.loginUser = rows[0];
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


app.post("/detail_profile", function (req, res) {
    var userID = req.body.userID;
    connection.query('select * from userinfo where id = ?',[userID],function(err,rows){
        if(!err){
            
            res.send({"userInfo":rows[0]});
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


app.post("/report", function(req, res) {
    var reportedUser = req.body.reportedUser;
    var reportUser = req.session.loginUser.id;
    var title = req.body.title;
    var detail = req.body.detail;

    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth:{
            user : 'itudy2019@gmail.com',
            pass : 'qwertyqwerty11'
        }
    });

    let mailOptions={
        from : 'itudy2019@gmail.com',
        to: 'itudy2019@gmail.com',
        subject : '사용자 Report',
        html :
            '<h1> 사용자의 Report가 접수되었습니다.</h1>'+
            '<h2>'+'report한 유저: '+reportUser+'</h2>'+
            '<h2>'+'report된 유저: '+reportedUser+'</h2>'+
            '<h2>'+'제목: '+title+'</h2>'+
            '<h2>'+'내용: '+detail+'</h2>'
    }

    transporter.sendMail(mailOptions, function(error,info){
        if(error){
            console.log(error);
        }
        else{
            console.log("Email sent : "+info.response);
            res.send();
        }
    });

    res.send();
})
///////////////////////////// 게시판 구현 ////////////////////////

//클래스 게시판
var classRouter = require('./routes/class.js')
app.use(classRouter)

var studyRouter = require('./routes/study.js')
app.use(studyRouter)

///////////////////////////////////////////////////////////////////

