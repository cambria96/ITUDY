$(document).ready(function(){

    initial()
    signupBtn()
    scrollControl()
    checkBox();
})

var stepCount=0;
function initial(){
    $(".signupWrap").children().eq(stepCount).addClass("active");
    console.log( $(".signupWrap").children())
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

function scrollControl(){
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
          $('#header').css("position","fixed");
        } else {
          $('#header').css("position","unset");
        }
      });
}

function checkBox(){
    $("input[type='checkbox'][name='check1']").click(function(){
        if($(this).prop('checked')){
            $("input[type='checkbox'][name='check1']").prop('checked',false);
            $(this).prop('checked',true);
        }
    })
}