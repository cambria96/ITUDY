$(document).ready(function () {
    tagBtn();
    findBtn();
    closeFindBtn();
})
var skills=[];

function tagBtn(){
    $(document).on("click",".tag",function(){
        if($(this).hasClass('is-active')){
        }
        else {
            skills.push($(this).attr("id"))
        }

        var url ='/classes/skills/'+skills;
        console.log(url)
        location.href=url;
    })
}

function findBtn(){
    $(document).on("click",".finder",function(){
        console.log("눌림");
        $(".initial_tags").slideDown();
        $(".initial_tags").addClass("actives");
        $(this).removeClass("finder");
        $(this).addClass("finder_close");
        $(".finderimg").attr('src', "../img/close.png");
        $(".finderimg").attr('class','closeimg');
    })
}

function closeFindBtn(){
    $(document).on("click",".finder_close",function(){
        console.log("닫힘버튼눌림");
        $(".initial_tags").slideUp(function(){
            $(".initial_tags").removeClass("actives");
        });
        
        $(this).removeClass("finder_close");
        $(this).addClass("finder");
        $(".closeimg").attr('src', "../img/finder.png");
        $(".closeimg").attr('class','finderimg');

    })
}