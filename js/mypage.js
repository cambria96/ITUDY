$(document).ready(function(){
    initial_mypage();
    sectionControl();
    modifyData();
    groupList();
    cancelParticipant();
});
var loginUser;
var userClass;
var userStudy;
function initial_mypage(){
    
    $(".contentWrap").first().addClass("active");
    $.ajax({

        url:'/requestContent',
        type:'POST',
        success:function(data){
            loginUser = data.loginUser;
            userClass = data.userClass;
            userStudy = data.userStudy;
            var initialClass='<p>Class</p>'
            var initialStudy='<p>Study</p>'
            $(".classList").html(initialClass);
            if(userClass){
                for(var m=0; m<userClass.length;m++){
                    var dynamicList = '<div class="specificTitle">'+
                                        '<h3>'+userClass[m].title+'</h3>'
                                    +'</div>'
                                    +'<div class="specificContent">'
                                    +'작성자id : ' +userClass[m].author_id
                                    +'<p>모집현황</p>'
                                    +'역할 : '+userClass[m].role
                                    +' <ul><li class="groupMember"><p class="memberName">이름</p></li><li class="groupMember"><p class="memberName">이름</p></li></ul></div>';
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
function cancelParticipant(){
    $(".cancelBtn").click(function(){
        var content=$(this).parents(".partyContent");
        var result = confirm('취소 하시겠습니까?'); 
        var cancelInfo={};

        if(result){
            
            cancelInfo["content_id"] = $(this).val();
            console.log($(this).siblings(".partyNumber"));
            cancelInfo["position_id"] = $(this).siblings(".posNum").val();
            cancelInfo["participant_id"] = loginUser.id;
            if($(this).hasClass("classCancelBtn")){
                cancelInfo["type"]=1;      

            }   
            else{
                cancelInfo["type"]=0;
            }
            console.log(cancelInfo);
            $.ajax({
                url: "/delete_participant_both",
                type:"POST",
                data: cancelInfo,
                success:function(){
                    content.remove();
                },
                error: function(request,error,status){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    return false;
                }
                
            })
        }
        
        
    })
}

