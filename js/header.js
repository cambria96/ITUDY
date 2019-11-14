$(document).ready(function(){

    

    $("#header").hover(function(){
        if($(window).scrollTop()<=1){
            $(".main-nav a").addClass("active");
        }       
    },function(){
        if($(window).scrollTop()<=1){
            $(".main-nav a").removeClass("active");
        }    
    })
    $(".logo").click(function(){
        location.href='/home';
    })
        
    
})
