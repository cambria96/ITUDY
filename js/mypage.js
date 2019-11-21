$(document).ready(function(){
    initial_mypage();
    sectionControl();
    modifyData();
    groupList();
});
var loginUser;
var userClass;
var userStudy;
var partyClass;
function initial_mypage(){
    $.ajax({
        url:'/requestParty',
        type:"POST",
        success:function(data){
            partyClass = data.contentList;
        },
        error: function(request,error,status){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            return false;
        }
    })
    $(".contentWrap").first().addClass("active");
    $.ajax({

        url:'/requestContent',
        type:'POST',
        success:function(data){
            console.log(data.userClass);
            loginUser = data.loginUser;
            userClass = data.userClass;
            userStudy = data.userStudy;
            var initialClass='<p>Class</p>'
            var initialStudy='<p>Study</p>'
            $(".classList").html(initialClass);
            if(userClass){
                for(var m=0; m<userClass.length;m++){
                    var dynamicList = '<div class="specificTitle">'+userClass[m].title+'</div><div class="specificContent"><p>상세정보</p>'+userClass[m].body+'<p>모집현황</p><ul><li class="groupMember"><p class="memberName">이름</p></li><li class="groupMember"><p class="memberName">이름</p></li></ul></div>'
                    $(".classList").append(dynamicList);
                }
                    
            }
            $(".studyList").html(initialStudy);
            if(userStudy){
                for(var n=0; n<userStudy.length;n++){
                    var dynamicList = '<div class="specificTitle">'+userStudy[n].title+'</div><div class="specificContent"><p>상세정보</p>'+userStudy[n].body+'<p>모집현황</p><ul><li class="groupMember"><p class="memberName">이름</p></li><li class="groupMember"><p class="memberName">이름</p></li></ul></div>'
                    $(".studyList").append(dynamicList);
                }
            }

            $(".checkbox-container").each(function(){
                var currentTitle= $(this).children().first().text();
                if(loginUser[currentTitle]=='1'){
                    $(this).children("input[type='checkbox']").attr("checked",true);
                }
            })
        },
        error: function(request,error,status){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            return false;
        }
    })
    
}

function modifyData(){
    $(".modifyBtn").click(function(){
        var userName = $("#userName").val();
        var userPhone = $("#userPhone").val();
        var userData={};
        userData['name'] = userName;
        userData['phone']= userPhone;
        console.log(userData);
        $.ajax({

            url:'/modify',
            type:'POST',
            data: userData,
            success:function(){
                alert("수정 되었습니다.");
                location.href='/mypage';
            },
            error: function(request,error,status){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                return false;
            }
        })
    })
    $(".modifyCheckedBtn").click(function(){
        var userData={};
        var userPoint=[];
        var userDefualt=[];
        $("input[type='checkbox']").each(function(){
            userDefualt.push($(this).siblings('label').text());
        });
        $("input[type='checkbox']:checked").each(function(){
            userPoint.push($(this).siblings('label').text());
        });
        for(m=0;m<userDefualt.length;m++){
            userData[userDefualt[m]] = '0';
        }
        for(m=0;m<userPoint.length;m++){
            userData[userPoint[m]] = '1';
        }
        $.ajax({
            url:'/modify',
            type:'POST',
            data: userData,
            success:function(){
                alert("수정 되었습니다.");
                location.href='/mypage';
            },
            error: function(request,error,status){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                return false;
            }
        })

    })
}
function sectionControl(){
    $(".sideContent span").click(function(){
        var menuPos = $(this).parent().index();
        $(".contentWrap").removeClass("active");
        $(".contentWrap").eq(menuPos).addClass("active");
    })
}

function groupList(){

    $(document).on("click",".specificTitle",function(){
        $(this).next().slideToggle();
    })

}

