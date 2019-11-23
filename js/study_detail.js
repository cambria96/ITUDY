$(document).ready(function () {

    initial()
    participate();
    cancelBtn();
    footerBtn();
    profileBtn();
    
})
var loginUser;
function initial(){

    $.ajax({
        url: '/requestUserInfo',
        type: 'POST',
        success: function(data) {
            loginUser= data.loginUser;
        },
        error: function(request,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            return false;
        }
    });
}

function participate(){
    $(document).on("click",".partyBtn",function(){
        var targetBtn = $(this);
        var result = confirm('신청 하시겠습니까?'); 
        if(result) { 
            var participant ={};
            participant["type"] =0;
            participant["content_id"] =$(".content_id").text();
            participant["position_id"] =$(this).parents("tr").index();
            participant["participant_id"] =loginUser.id;
            console.log(participant);
            $.ajax({
                url: '/participate_class',
                type: 'POST',
                data: participant,
                success: function(data) {
                    alert("신청이 완료되었습니다. \n신청 목록은 [마이페이지] > [신청중인 그룹]에서 확인 가능합니다.");
                    targetBtn.text("신청 완료").removeClass("partyBtn").addClass("completeBtn");
                    targetBtn.siblings(".fakeBtn").removeClass("fakeBtn").addClass("cancelBtn")

                },
                error: function(request,error,status){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    return false;
                }
            })
        } 
    })

}

function cancelBtn(){
    $(document).on("click",".cancelBtn",function(){
        var result = confirm('취소 하시겠습니까?'); 
        var targetBtn = $(this);
        if(result){
            var cancelInfo ={};
            cancelInfo["type"] =0;
            cancelInfo["content_id"] =$(".content_id").text();
            cancelInfo["position_id"] = $(this).parents("tr").index();
            cancelInfo["participant_id"] = loginUser.id;
    
            $.ajax({
                url:"/delete_participant",
                type:"POST",
                data:cancelInfo,
                success:function(){
                    alert("신청이 취소 되었습니다.");
                    targetBtn.removeClass("cancelBtn").addClass("fakeBtn");
                    targetBtn.siblings(".completeBtn").text("신청 하기").removeClass("completeBtn").addClass("partyBtn");
                },
                error: function(request,error){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    return false;
                }
    
            })
        }
    });

}

function footerBtn(){

    $(".deleteBtn").click(function(){
        var result = confirm("모집글을 삭제하시겠습니까?");
        if(result){
            var deleteInfo={};
            deleteInfo["id"] = $(".content_id").text();
            
            $.ajax({
                url: "/delete_study",
                type: "POST",
                data: deleteInfo,
                success: function(){
                    alert("삭제되었습니다.");
                    parent.document.location.reload();
                },
                error: function(request,error){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    return false;
                }
            })
        }
    })
}

function profileBtn(){
    $(".profileBtn").on("click",function(){
        if($(".profileContent").hasClass("is-active")){
            $(".profileContent").removeClass("is-active");
            $(this).css("background", "#b8b8b8");
            $(this).html("프로필 보기");

        }
        else{
            $(".profileContent").addClass("is-active");
            $(this).css("background", "#dfaa32");
            $(this).html("프로필 보기 X");
        }
    })
}