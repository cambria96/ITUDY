$(document).ready(function () {
    tagBtn();
    findBtn();
    closeFindBtn();
    $(".item-container").click(function(){
        loadImage();
    })
})
var skills=[];

function tagBtn(){
    $(document).on("click",".tag",function(){
        if($(this).hasClass('is-active')){
        }
        else {
            skills.push($(this).attr("id"))
        }

        var url ='/studies/skills/'+skills;
        console.log(url)
        location.href=url;
    })
}

function findBtn(){
    $(document).on("click",".finder",function(){
        console.log("눌림");
        $(".initial_tags").slideDown();
        $(".initial_tags").addClass("actives");
        $(this).children(".rotateBar").addClass("active");
        $(this).children(".circleBar").addClass("active");
        $(this).removeClass("finder");
        $(this).addClass("finder_close");
    })
}

function closeFindBtn(){
    $(document).on("click",".finder_close",function(){
        console.log("닫힘버튼눌림");
        $(".initial_tags").slideUp(function(){
            $(".initial_tags").removeClass("actives");
        });
        $(this).children(".rotateBar").removeClass("active");
        $(this).children(".circleBar").removeClass("active");
        $(this).removeClass("finder_close");
        $(this).addClass("finder");

    })
}

function loadImage(){

    var iHTML = '<div style="width:100%;height:100%;display:table;position:fixed;left:0;top:0;background:rgba(0,0,0,0); z-index:9999">';

	iHTML += '<div style="width:100%;height:100%;display:table-cell;text-align:center;vertical-align:middle;background-color:rgba(0,0,0,0.0);">';

	iHTML += '<div class="book"><div class="book__page"></div><div class="book__page"></div><div class="book__page"></div>';

	iHTML += '</div>';

	iHTML += '</div>';

	var loadingObj = $(iHTML).appendTo(document.body);

    var tFrame = $("#content-detail");
    console.log(tFrame);

	$(tFrame).load(function(){

		loadingObj.hide();

	});

	tFrame.src = './test.html';
}