$(document).ready(function(){

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
          $('#header').css("position","fixed");
        } else {
          $('#header').css("position","unset");
        }
      });
})