(function ($) {
  "use strict";
  $(function(){
    var timeSet=0;
    $(".intro-info").find("h2").each(function(index,value){
        var item= $(this);
        setTimeout(function(){
            item.addClass("active");
        },timeSet);
        timeSet+=500;
    });
})

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('fast');
    } else {
      $('.back-to-top').fadeOut('fast');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},500, 'easeInOutExpo');
    return false;
  });
  $(".signupBtn").click(function(){
    location.href="/signup"
  })

  $(".mobile-nav-toggle").click(function(){
    if($(".topBar").hasClass("active")){  
      $(".topBar").removeClass("active2"); 
      $(".middleBar").removeClass("active2");
      $(".bottomBar").removeClass("active2");
      setTimeout(function(){
        $(".topBar").removeClass("active");
        $(".bottomBar").removeClass("active");
      },250)
    }
    else{
      $(".topBar").addClass("active");
   
      $(".bottomBar").addClass("active");
      setTimeout(function(){
        $(".topBar").addClass("active2"); 
        $(".middleBar").addClass("active2");
        $(".bottomBar").addClass("active2");
      },250)
    }
    
    
  })

  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
      $('.main-nav a').addClass("active");
      $(".moblie-bar").addClass("active3");
    } else {
      $('#header').removeClass('header-scrolled');
      $(".moblie-bar").removeClass("active3");
      $('.main-nav a').removeClass("active");
    }
  });


  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $('.main-nav a, .mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (! $('#header').hasClass('header-scrolled')) {
            top_space = top_space - 40;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.main-nav, .mobile-nav').length) {
          $('.main-nav .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.main-nav, .mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();
  
    nav_sections.each(function() {
      var top = $(this).offset().top - main_nav_height,
          bottom = top + $(this).outerHeight();
  
      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('active');
        main_nav.find('a[href="#'+$(this).attr('id')+'"]').parent('li').addClass('active');
      }
    });
  });



})(jQuery);

