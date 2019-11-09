$(document).ready(function(){

    initial()
    signupBtn()
    checkBox();
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


function checkBox(){
    $(".checkSubmit").click(function(){
        $(".categoryList").find("input[type='checkbox']:checked").each(function(){
            console.log($(this).parent().siblings(".colTitle").text());
        });
    })

    $("input[type='checkbox'][name='check1']").click(function(){
        if($(this).prop('checked')){
            $("input[type='checkbox'][name='check1']").prop('checked',false);
            $(this).prop('checked',true);
        }
    })
}