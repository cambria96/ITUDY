
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
// app.post('/login',function(req,res){
//     res.render("default.html");
//     console.log("뭐가들었게"+ req.body.id);
// })

// app.post('/newuser',function(req,res){
//     user_id = req.body.id;
//     user_password = req.body.password;
//     user_name = req.body.name;
//     console.log('req.body : ' + req.body);

//     var user = {'id' : user_id,
//                 'password' : user_password,
//                 'name' : user_name};

//     console.log("new_id: ", user_id);
//     console.log("new_password: ", user_password);
//     console.log("new_name", user_name);
    
//     connection.query('insert into userinfo set ?',user,function(err,result){
//         if(!err){
//             console.log("사용자 등록 성공");
//             console.log('The solution is: ',result);
            
//         }
//         else{
//             console.log('Error while performing Query.',err);
//         }
//     });

// });

app.use(session({
    key : 'sid',
    secret : 'secret',
    resave : false,
    saveUninitialized : false,
    store : new MySQLStore(options)
}));


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
        req.session.name = info[i].name;
        req.session.credit = info[i].credit;
        // alert(req.session.name + "님 환영합니다.");
        console.log("session name" + req.session.name);
        console.log("credit"+req.session.credit);
        req.session.save(()=>{
            res.render('after_login.ejs',{name:req.session.name,credit:req.session.credit});    
        });
        
    }
    else{
        console.log('로그인 실패');
        res.render('main.html');
    }    
});

app.get('/home',function(req,res){
    
    if(req.session.name){
        console.log("asdddf");
        req.session.save(()=>{
            res.render('after_login.ejs',{name:req.session.name,credit:req.session.credit});    
        });
        
    }
    else{
        console.log("af");
        res.render("main.html");
    }
})


app.get('/logout', function(req,res){
    console.log(req.session.name)
    delete req.session.name;
    console.log(req.session.name)
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

app.get("/class",function(req,res){
    res.render('default.html');
})
