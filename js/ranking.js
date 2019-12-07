$(document).ready(function(){
    

    if($(window).innerWidth() <991){
        $(".questionMark").click(function(){
            $(".level_container").fadeToggle("fast",function(){
                if($(".level_container").css("display")=="block"){
                    $('html, body').animate({scrollTop :  $(".level_container").offset().top-100},400, 'easeInOutExpo');
                }
            });
            
            
            
        })
        
    }else{
        $(".questionMark").hover(function(){
            $(".level_container").fadeIn("fast");
        },function(){
            $(".level_container").fadeOut("fast");
        })
    }
    
})