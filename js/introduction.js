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
    var bannerHeight = $(".subMainTitle").width();
    console.log(bannerHeight+250-$(window).height());
    $(window).scroll(function() {
        if ($(this).scrollTop() > bannerHeight+150-$(window).height()) {
            
            $(".mainTitle").addClass("active");
        } else {
            $(".mainTitle").removeClass("active");
        }
      });
})