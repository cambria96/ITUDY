$(document).ready(function(){

    $(function(){
        var appearTime =0;
        $(".n1").find("p").each(function(){
            console.log($(this));
            var item= $(this);
            setTimeout(function(){
                item.addClass("active");
            },appearTime);
            appearTime+=800;
        })
    })
    var bannerHeight = $(".mainTitle ").offset().top;
    var imageHeigth = $(".mainTitle").height();
    console.log(bannerHeight);
    console.log(bannerHeight+250-$(window).height());
    $(window).scroll(function() {
        console.log($(this).scrollTop());   
        if ($(this).scrollTop() > bannerHeight-imageHeigth/2) {
            
            $(".mainTitle").addClass("active");
        } else {
            $(".mainTitle").removeClass("active");
        }
      });

    $('ul.tabs li').click(function(){
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#"+tab_id).addClass('current');
    })
})
