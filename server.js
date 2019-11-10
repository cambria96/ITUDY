var mysql = require('mysql');
var connection = mysql.createConnection({
    
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'userinfo',
    debug:false,
    insecureAuth:true
});

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


var express = require('express');
var app = express();
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');


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
app.get('/home',function(req,res){
    res.render("default.html");
})
app.get('/signup',function(req,res){
    res.render("signup.html");
})
// app.post('/login',function(req,res){
//     res.render("default.html");
//     console.log("뭐가들었게"+ req.body.id);
// })

app.post('/newuser',function(req,res){
    user_id = req.body.id;
    user_password = req.body.password;
    var user = {'id' : user_id,
                'password' : user_password};

    console.log("new_id: ", user_id);
    console.log("new_password: ", user_password);
    
    connection.query('insert into userinfo set ?',user,function(err,result){
        if(!err){
            console.log('The solution is: ',result);
            
        }
        else{
            console.log('Error while performing Query.',err);
        }
    });

})

app.post('/success',function(req,res){
    var nameAry = new Array();
    var check = 0;
    console.log("id: ", req.body.id);
    console.log("password: ", req.body.password);
    
    
    for(var i=0;i<info.length;i++){
        nameAry.push(info[i].id);
        if(req.body.id == info[i].id){
             if(req.body.password == info[i].password){
                 check=1;
             }
        }
    }
    if(check){
        console.log('로그인 성공');
        res.render('default.html',{name:nameAry});
    }
    else{
        console.log('로그인 실패');
        res.render('main.html');
    }
    
    
})



app.post("/done",function(req,res){
    

    var user = req.body;
    console.log(user);
    
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

