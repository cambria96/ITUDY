$(document).ready(function(){
    initial_mypage();
    sectionControl();
    modifyData();
    groupList();
    send2group();
    cancelParticipant();
});
var loginUser;
var userClass;
var userStudy;
var partyClass;
var participants;
var positions;
var typeAry = ["C","C++","C#","Java","Ruby","Python","R","Go","HTML/CSS","Javascript","Spring","Nodejs","Angularjs","Vuejs","Reactjs","PHP","Android","IOS","Swift","Kotlin","Objective-C","MYSQL","MongoDB","SpringBoot","OracleDB"];
var pl = [[],[],[],[],[],[],[],[]];
function initial_mypage(){
    
    $(".contentWrap").first().addClass("active");
    $.ajax({

        url:'/requestContent',
        type:'POST',
        success:function(data){
            loginUser = data.loginUser;
            userClass = data.userClass;
            userStudy = data.userStudy;
            participants = data.participants;
            positions = data.positions;
            var initialClass='<p class="innertitle">Class</p>'
            var initialStudy='<p class="innertitle">Study</p>'
             $(".classList").html(initialClass);
            if(userClass){
                for(var m=0; m<userClass.length;m++){
                    var datearr = userClass[m].date.split(',');
                    var timearr = userClass[m].time.split(',');
                    var datetime = [];
                    for (var dl=0; dl<datearr.length; dl++){
                        
                        datetime[dl] =  datearr[dl] + ' : ' +  timearr[dl];
                        
                        console.log(datetime);
                    }
                    var datetimearr = datetime.join(' | ');
                    console.log(datearr, timearr);
                    var dynamicList = '<div class="specificTitle">'
                                    + '<p>'+userClass[m].title+'</p>'
                                    +'</div>'
                                    +'<div class="specificContent">'
                                    +'<div class = "leftbox">'
                                    +'<p class = "detailContent">상세정보</p>'
                                    +'<p class = "halfBox">작성자id :' +userClass[m].author_id+'</p>'
                                    +'<p class = "halfBox">내 역할 :' +userClass[m].role+'</p>'
                                    +'<p>시간 : '+datetimearr+'</p>'
                                    
                                    + '<p>크레딧 : ' + userClass[m].credit+'</p>'
                                    +'<div class = "participantBox">'
                                    +'<p class = "partyList"> 모집 현황 </p>'
                                    +'<div class="groupMember">'
                                    +'<ul class = "memberuserClass" id ='+'"'+'member'+userClass[m].id+'"'+'>'
                                

                                    +'</ul>'
                                    +'</div>'
                                    +'</div>'
                                    +'</div>'
                                    

                                    +'<div class = "rightbox">'
                                    +'<p class = "detailContent">신청자 목록</p>'
                                    +'<div class = "partibox" id = '+'"'+userClass[m].id+'"'+'>'
                                    +'<table id="partitable" class = "partyTable">'
                                    +'<thead>'
                                    +'<tr>'
                                    +'<td>모집 분야</td>'
                                    +'<td>신청자 ID</td>'
                                    +'<td>수락</td>'
                                    +'</tr>'
                                    +'</thead>'
                                    +'<tbody>'
                                    +'</tbody>'
                                    +'</table>'
                                    +'</div>'
                                    +'</div>'
                                    +'</div>';
                                    
                    $(".classList").append(dynamicList);
                    
                }
            }
            
       
            var temparr = []
            var templist=[]
            if(positions){
              
                for(var x = 0; x<positions.length; x++){
                    
                    for(var y=0; y<userClass.length; y++){
                        
                        if(positions[x].content_id == userClass[y].id){
                            var i = 0
                            for (var t=0; t<typeAry.length; t++){
                                
                                if(positions[x][typeAry[t]]==1){
                                    temparr[i] =typeAry[t];
                                    i++;
                                    
                                }
                            
                            }
                            

                            templist[x]=temparr.toString();
                            var number = positions[x].position_id + 1
                            $("#"+userClass[y].id).children().append('<tr> <td>'+templist[x]+'</td> </tr>');
                            console.log(templist.length);
                            $("#member"+userClass[y].id).append("<li><span>"+number+"</span><span>"+templist[x]+"</span></li> <li><span >▶</span></li>");
                            temparr=[];

                        }
                    }
                }
            }
            if(participants){
                
                for(var p=0; p<participants.length;p++){
                    var partiList = participants[p].participant_id;
                    for (var q=0; q<userClass.length; q++){
                        if(participants[p].type == 1 && participants[p].content_id == userClass[q].id){
                            position = "position" + participants[p].position_id;
                            console.log("포지션" + position);
                            $("#"+userClass[q].id).children().children('tbody').children().eq(participants[p].position_id).append('<td>'+ partiList +'</td>'+'<td> <button class = "acceptBtn">수락 하기</button></td>');
                            $("#"+userClass[q].id).children().children('tbody').children().eq(participants[p].position_id).attr("id",position);
                          
                        }
                    }   
                }
            }
          
            $(".studyList").html(initialStudy);
            if(userStudy){
                for(var m=0; m<userStudy.length;m++){
                    
                    var dynamicList_study = '<div class="specificTitle">'
                                    + '<div>'+userStudy[m].title+'</div>'
                                    +'</div>'
                                    +'<div class="specificContent">'
                                    +'<div class = "leftbox">'
                                    +'작성자id : ' +userStudy[m].author_id
                                    +'<br>'
                                    +'<br>'
                                    +'시간 : '+userStudy[m].date
                                    +'<br>'
                                    + '크레딧 : ' + userStudy[m].credit
                                    +'<p> 참여자 현황 </p>'
                                    +'<ul><li class="groupMember">'
                                    +'<p class="memberName">이름</p></li><li class="groupMember"><p class="memberName">이름</p></li></ul>'
                                    +'</div>'
                                    +'<div class = "rightbox">'
                                    +'신청자 목록.'
                                    +'<div class = "partibox" id = '+'"'+userStudy[m].id+'"'+'>'
                                    +'</div>'
                                    +'</div>'
                                    +'</div>';
                                    
                    $(".studyList").append(dynamicList_study);
                    
                }
                    
            }

            if(participants){
                for(var p=0; p<participants.length;p++){
                    var partiList = participants[p].participant_id;
                    for (var q=0; q<userStudy.length; q++){
                        if(participants[p].type == 0 && participants[p].content_id == userStudy[q].id){
                            
                            $("#"+userStudy[q].id).append(partiList);
                        }
                    }   
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

function send2group(){
    $(document).on("click",".acceptBtn",function(){
        var partiname = $(this).parent().prev().text();
        console.log($(this).parent().parent().attr('id'));
        var positionname = $(this).parent().parent().attr('id')[8];
        console.log("positionname : " +positionname);
        var classnum = $(this).parent().parent().parent().parent().parent().attr('id');
        console.log("파티넴" +partiname);
        console.log("쿨래스넘 :" +classnum);
        console.log("포지션넴"+positionname);
        console.log( $(this).parent().prev().text());
        var target = positionname*2 +1;
        console.log("target"+target);
        $("#member"+classnum).children('li').eq(target).append('<span class="confirmList">'+partiname+'</span>');
    });

}

