$(document).ready(function(){

    initial()
    signupBtn()
    checkBox();
    submitAll();
    changeDection();
    
})

var stepCount=0;
function initial(){
    $(".signupWrap").children().eq(stepCount).addClass("active");
    
    $(function(){
        var timeSet=0;
        $(".signupBox").first().children(".signupTitle").addClass("active");
        $(".signupBox").first().find("li").each(function(index,value){
            var item= $(this);
            setTimeout(function(){
                item.addClass("active");
                item.children().addClass("active");
            },timeSet);
            timeSet+=50;
        });
    })
}
function changeDection(){
    $("#name").on("keyup paste", function() {
        $("#name").parent().next().removeClass("wrong");
    });
    $("#id").on("keyup paste", function() {
        $("#id").parent().next().removeClass("wrong");
    });
    $("#password").on("keyup paste", function() {
        $("#password").parent().next().removeClass("wrong");
    });
    $("#repeatPassword").on("keyup paste", function() {
        if($("#password").val()==$("#repeatPassword").val()){
            $("#repeatPassword").parent().next().addClass("right").text("비밀번호가 일치합니다.");
        }
        else{
            $("#repeatPassword").parent().next().removeClass("right")
            $("#repeatPassword").parent().next().addClass("wrong").text("비밀번호가 일치하지 않습니다.");
        }
    });
    $("#phone").on("keyup paste", function() {
        $("#phone").parent().next().removeClass("wrong");
    });
     
}
function signupBtn(){

    $(".nextBtn").click(function(){
        var validation =1;
        if(!$("#name").val()){
            $("#name").parent().next().addClass("wrong");
            validation =0;
        }
        if(!$("#id").val()){
            $("#id").parent().next().addClass("wrong");
            validation =0;
        }
        if(!$("#password").val()){
            $("#password").parent().next().addClass("wrong");
            validation =0;
        }

        if($("#password").val()!=$("#repeatPassword").val()){
            $("#repeatPassword").parent().next().addClass("wrong");
            validation =0;
        }
        if(!$("#phone").val()){
            $("#phone").parent().next().addClass("wrong");
            validation =0;
        }
        if(!$("#phone").val()){
            $("#email").parent().next().addClass("wrong");
            validation =0;
        }
        // 다 입력시 다음
        if(validation){
            $(".signupWrap").children().eq(stepCount).fadeOut("fast",function(){
                stepCount++;
                if(stepCount==1){
                    $(".signupWrap").children().eq(stepCount).fadeIn("fast",function(){
                    
                        $(this).addClass("wide");
                        $(this).next().addClass("wide");
                        $(this).children(".signupTitle").addClass("active");
                        var timeSet=0;
                        var timeliSet=0;
                        $(this).find("ul").each(function(index){
                            var item=$(this);
                            setTimeout(function(){
                                item.addClass("active");
                                
                            },timeSet);
                            timeSet+=100;
                        });
                    });
                }
                $(".signupWrap").children().eq(stepCount).fadeIn("fast",function(){
                    
                    $(this).addClass("wide");
                    $(this).next().addClass("wide");
                    $(this).children(".signupTitle").addClass("active");
                });
            });
        }
    });
    $(".prevBtn").click(function(){
        $(".signupWrap").children().eq(stepCount).fadeOut("fast",function(){
            stepCount--;
            $(this).removeClass("wide");
            $(".signupWrap").children().eq(stepCount).fadeIn("fast");
        });
    });
}

var checkAry =[];
var checkIndex;
var currentTitle;
var currentContent;

function checkBox(){
    $(".checkSubmit").click(function(){
        var i=1;
        var checkTitle;
        totalCount=0;
        checkIndex=-1;
        checkAry=[];
        $(".categoryList").find("input[type='checkbox']:checked").each(function(){
            currentTitle=$(this).parent().siblings(".colTitle").text();
            currentContent=$(this).siblings().first().text();      
            // console.log("current content"+currentContent); 
            if(checkTitle != currentTitle ){
                i=0;
                checkIndex++;
                checkAry[checkIndex] = new Array();
                checkTitle = currentTitle;
                checkAry[checkIndex][i] = checkTitle;
                i++;
            }
            checkAry[checkIndex][i] = currentContent;
            i++;
        });
        console.log(stepCount);
        nextPage();
    })
}
function prevPage(aryLength){
    $(this).removeClass("wide");
    $(".signupWrap").children().eq(stepCount).fadeIn("fast");
}
var totalCount=0;
function nextPage(){
    $(".signupWrap").children().eq(stepCount).fadeOut("fast",function(){
        stepCount++;
        $(".signupWrap").children().eq(stepCount).fadeIn("fast",function(){      
            $(this).addClass("wide");
            $(this).next().addClass("wide");
        });
    });
}

// 클릭한거 전부 디비로 보내기
function submitAll(){
    $(".submitBtn").click(function(){
        var userData={};
        var userPoint=[];
        var i=0;
        $(".colContent").find("input[type='checkbox']:checked").each(function(){
            userPoint.push($(this).siblings('label').text());
        });
        userData['name']= $("#name").val();
        userData['password']= $("#password").val();
        userData['id']= $("#id").val();
        userData['phone']= $("#phone").val();
        userData['email']= $("#email").val();
        for(m=0;m<userPoint.length;m++){
            userData[userPoint[m]] = '1';
        }
        console.log(userData);
        $.ajax({
            url: '/done',
            type: 'POST',
            data: userData,
            success: function(response) {
                location.href='/'
            },

            error: function(request,error,status){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                return false;
            }
        });
    })
}