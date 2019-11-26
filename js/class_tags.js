$(document).ready(function () {
    selectedTags();
    tagBtn();
})
var skills=[];

function tagBtn(){
    $(document).on("click",".tag",function(){
        if($(this).hasClass('is-active')){
            var idx = skills.indexOf($(this).attr("id"))
            skills.splice(idx, 1)
        }
        else {
            skills.push($(this).attr("id"))
        }
        if(skills.length==0){
            location.href='/class'
        }
        else{
            var url ='/classes/skills/'+skills;
            location.href=url;
        }


    })
}

function selectedTags(){

    skills = $('.skill_buttons').attr("value").split(',');
    for(var i=0;i<skills.length;i++) {
        $('#'+skills[i]).addClass('is-active');
        $('#'+skills[i]).append('<span id="x">x</span>')

    }
    console.log(skills);
}