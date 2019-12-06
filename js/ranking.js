$(document).ready(function(){
    $(".questionMark").hover(function(){
        $(".level_container").fadeIn("fast");
    },function(){
        $(".level_container").fadeOut("fast");
    })
})