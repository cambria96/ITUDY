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
    $("#email").on("keyup paste", function() {
        $("#email").parent().next().removeClass("wrong");
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
        if(!$("#email").val()){
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

// 클릭한 분야에 따라 동적 생성 ...개힘듬;
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

    })
    $(".checkBackBtn").click(function(){
        $(".signupWrap").children().eq(stepCount).fadeOut("fast",function(){
            var currentStep = stepCount;
            while(1){
                if(stepCount >10){
                    stepCount = currentStep;
                    break;
                }
                stepCount--;   
                for(m=0;m<checkAry.length;m++){
                    if(checkAry[m][0] == $(".signupWrap").children().eq(stepCount).children(".tempTitle").text()){            
                        prevPage(m);
                        return;
                    }
                    if($(".signupWrap").children().eq(stepCount).children(".tempTitle").text()=="처음"){
                        prevPage(m);
                        return;
                    }
                }
            }      
        });
    })
    
    $(".checkBtn").click(function(){
        $(".signupWrap").children().eq(stepCount).fadeOut("fast",function(){
            var currentStep = stepCount;
            while(1){            
                stepCount++;   
                if(stepCount >10){
                    stepCount = currentStep;
                    break;
                }
                if(checkAry.length==0){
                    if($(".signupWrap").children().eq(stepCount).children(".tempTitle").text()=="마지막"){
                        $(".signupWrap").children().eq(stepCount).fadeIn("fast");
                    }      
                    continue;
                }  
                
                for(m=0;m<checkAry.length;m++){
                    if(checkAry[m][0] == $(".signupWrap").children().eq(stepCount).children(".tempTitle").text()){            
                        nextPage(m);
                        return;
                    } 
                    if($(".signupWrap").children().eq(stepCount).children(".tempTitle").text()=="마지막"){
                        $(".signupWrap").children().eq(stepCount).fadeIn("fast");
                        return;
                    }
                }
                      
            }      
        });
    })

    $(document).on("click","tr input[type='checkbox'][name='check1']",function(){
        if($(this).prop('checked')){
            console.log();
            $(this).parents('tr').find("input[type='checkbox'][name='check1']").prop('checked',false);
            $(this).prop('checked',true);
        }

    })
    $("input[type='checkbox'][name='check1']").click(function(){
        console.log("asdf");
        if($(this).prop('checked')){
            $("input[type='checkbox'][name='check1']").prop('checked',false);
            $(this).prop('checked',true);
        }
    })

}
function prevPage(aryLength){
    $(this).removeClass("wide");
    $(".signupWrap").children().eq(stepCount).fadeIn("fast");
}
var totalCount=0;
function nextPage(aryLength){
    //동적할당 체크된것만 보여주기 
    var initialRow = '<th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>';
    $(".signupWrap").children().eq(stepCount).find("tbody").html(initialRow);
    for(m=0;m<checkAry[aryLength].length-1;m++){
        var dynamicRow = '<tr><td>'+checkAry[aryLength][m+1]+'</td><td><input type="checkbox" id="box-'+totalCount+0+'" name="check1" value="1"><label for="box-'+totalCount+0+'"></label></td><td><input type="checkbox" id="box-'+totalCount+1+'" name="check1" value="2"><label for="box-'+totalCount+1+'"></label></td><td><input type="checkbox" id="box-'+totalCount+2+'" name="check1"  value="3"><label for="box-'+totalCount+2+'"></label></td><td><input type="checkbox" id="box-'+totalCount+3+'" name="check1"  value="4"><label for="box-'+totalCount+3+'"></label></td><td><input type="checkbox" id="box-'+totalCount+4+'" name="check1" value="5"><label for="box-'+totalCount+4+'"></label></td></tr>'
        $(".signupWrap").children().eq(stepCount).find("tbody").append(dynamicRow)
        totalCount++;
    }
    $(".signupWrap").children().eq(stepCount).fadeIn("fast",function(){
        $(this).addClass("wide");
        $(this).next().addClass("wide");
    });
}

// 클릭한거 전부 디비로 보내기
function submitAll(){
    $(".submitBtn").click(function(){
        var userData={};
        var userPoint=[];
        var i=0;
        $("tbody").find("input[type='checkbox'][name='check1']:checked").each(function(){
            userPoint.push($(this).val());
        });
        userData['name']= $("#name").val();
        userData['password']= $("#password").val();
        userData['id']= $("#id").val();
        userData['email']= $("#email").val();
        for(m=0;m<checkAry.length;m++){
            for(n=1;n<checkAry[m].length;n++){
                userData[checkAry[m][n]] = userPoint[i];
                i++;
            }
        }
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