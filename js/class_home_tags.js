$(document).ready(function () {
    tagBtn();
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
