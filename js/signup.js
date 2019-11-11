$(document).ready(function(){

    initial()
    signupBtn()
    checkBox();
    submitAll();
})

var stepCount=0;
function initial(){
    $(".signupWrap").children().eq(stepCount).addClass("active");
}

function signupBtn(){
    $(".nextBtn").click(function(){
        $(".signupWrap").children().eq(stepCount).fadeOut("fast",function(){
            stepCount++;
            $(".signupWrap").children().eq(stepCount).fadeIn("fast",function(){
                $(this).addClass("wide");
                $(this).next().addClass("wide");
            });
        });
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
var checkTitle;
var currentTitle;
var currentContent;

// 클릭한 분야에 따라 동적 생성 ...개힘듬;
function checkBox(){
    $(".checkSubmit").click(function(){
        var i=1;
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

    $("input[type='checkbox'][name='check1']").click(function(){
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
        var dynamicRow = '<tr><td>'+checkAry[aryLength][m+1]+'</td><td><input type="checkbox" id="box-'+totalCount+0+'" name="check1"><label for="box-'+totalCount+0+'"></label></td><td><input type="checkbox" id="box-'+totalCount+1+'" name="check1"><label for="box-'+totalCount+1+'"></label></td><td><input type="checkbox" id="box-'+totalCount+2+'" name="check1"><label for="box-'+totalCount+2+'"></label></td><td><input type="checkbox" id="box-'+totalCount+3+'" name="check1"><label for="box-'+totalCount+3+'"></label></td><td><input type="checkbox" id="box-'+totalCount+4+'" name="check1"><label for="box-'+totalCount+4+'"></label></td></tr>'
        $(".signupWrap").children().eq(stepCount).find("tbody").append(dynamicRow)
        totalCount++;
    }
    $(".signupWrap").children().eq(stepCount).fadeIn("fast",function(){
        $(this).addClass("wide");
        $(this).next().addClass("wide");
    });
}

function submitAll(){
    $(".submitBtn").click(function(){
        console.log("asdf");

        $.ajax({
            url: '/done',
            type: 'POST',
            data: {
                name: $("#name").val(),
                password: $("#password").val(),
                id: $("#id").val(),
                email: $("#email").val(),
            },
            
            success: function(response) {
                location.href='/'
            },

            error: function(request,error,status){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                return false;
            }

          });    })
}