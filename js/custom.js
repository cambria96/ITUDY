$(document).ready(function(){

    initial()
    signupBtn()
    scrollControl()
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