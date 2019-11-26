$(document).ready(function(){
    initial_mypage();
    sectionControl();
    modifyData();
    groupList();
    user2group();
    group2user();
    cancelParticipant();
    makeGroup();
});
var loginUser;
var userClass;
var userStudy;
var partyClass;
var participants;
var positions;
var typeAry = ["C","C++","C#","Java","Ruby","Python","R","Go","HTML/CSS","Javascript","Spring","Nodejs","Angularjs","Vuejs","Reactjs","PHP","Android","IOS","Swift","Kotlin","Objective-C","MYSQL","MongoDB","SpringBoot","OracleDB"];
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
                    var gatherNum = parseInt(userClass[m].total_participant)-1;
                    for (var dl=0; dl<datearr.length; dl++){
                        
                        datetime[dl] =  datearr[dl] + ' : ' +  timearr[dl];
                        
        
                    }
                    var datetimearr = datetime.join(' | ');
                    
                    var dynamicList = '<div class="specificTitle">'
                                    + '<span>'+userClass[m].title+'  '
                                    +'<sapn class ="alarm"> </span>'
                                    +'</sapn>'
                                    +'<p id = "date"> 등록일자 : '+userClass[m].datetime+'</p>'
                                    +'</div>'
                                    +'<div class="specificContent">'
                                    +'<div class = "leftbox">'
                                    +'<p class = "detailContent">상세정보</p>'
                                    +'<p class = "halfBox">작성자id :' +userClass[m].author_id+'</p>'
                                    +'<p class = "halfBox">내 역할 :' +userClass[m].role+'</p>'
                                    
                                    
                                    + '<p class = "halfBox">크레딧 : ' + userClass[m].credit+'</p><p class = "halfBox totalNum"> 모집 인원 : <span>'+gatherNum+'</span> 명</p>'
                                    +'<p>시간 : '+datetimearr+'</p>'
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
                                    +'<div class="makeBox"><button class="makeGroupBtn">그룹 만들기</button></div>'
                                    +'</div>';
                                    
                    $(".classList").append(dynamicList);
                    
                }
            }
            $(".studyList").html(initialStudy);
            if(userStudy){
                for(var m=0; m<userStudy.length;m++){
                    var datearr = userStudy[m].date.split(',');
                    var timearr = userStudy[m].time.split(',');
                    var datetime = [];
                    var gatherNum = parseInt(userStudy[m].total_participant)-1;
                    for (var dl=0; dl<datearr.length; dl++){
                        
                        datetime[dl] =  datearr[dl] + ' : ' +  timearr[dl];
                        
                    }
                    var datetimearr = datetime.join(' | ');
                    
                    var dynamicList = '<div class="specificTitle">'
                                    + '<span>'+userStudy[m].title+'  '
                                    +'<sapn class ="alarm"> </span>'
                                    +'<p id = "date"> 등록일자 : '+userClass[m].datetime+'</p>'
                                    +'</div>'
                                    +'<div class="specificContent">'
                                    +'<div class = "leftbox">'
                                    +'<p class = "detailContent">상세정보</p>'
                                    +'<p class = "halfBox">작성자id :' +userStudy[m].author_id+'</p>'
                                    +'<p class = "halfBox">내 역할 :' +userStudy[m].role+'</p>'
                                    
                                    
                                    + '<p class = "halfBox totalNum"> 모집 인원 : <span>'+gatherNum+'</span> 명</p>'
                                    +'<p>시간 : '+datetimearr+'</p>'
                                    +'<div class = "participantBox">'
                                    +'<p class = "partyList"> 모집 현황 </p>'
                                    +'<div class="groupMember">'
                                    +'<ul class = "memberuserClass" id ='+'"'+'member'+userStudy[m].id+'_s"'+'>'
                                    +'</ul>'
                                    +'</div>'
                                    +'</div>'
                                    +'</div>'
                                    
                                    
                                    +'<div class = "rightbox">'
                                    +'<p class = "detailContent">신청자 목록</p>'
                                    +'<div class = "partibox" id = '+'"'+userStudy[m].id+'_s"'+'>'
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
                                    +'<div class="makeBox"><button class="makeGroupBtn">그룹 만들기</button></div>'
                                    +'</div>';
                                    
                    $(".studyList").append(dynamicList);
                    
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
                            var currentnum = 0;
                            //삭제한 부분
                            // $("#"+userClass[y].id).children().append('<tr> <td>'+templist[x]+'</td> </tr>');
                            $("#member"+userClass[y].id).append("<li class='conditionLine'><span class ='marginleft'>"+number+"</span><span class='conditionList marginleft'>"+templist[x]+"</span>"+"(<span class='currentnum colortext'>"+currentnum+"</span><span class ='colortext'>/</span><span class='totalnum colortext'>"+positions[x].number+"</span>)"+"</li> <li><span >▶</span></li>");
                            temparr=[];
                            
                        }
                    }
                    for(var y=0; y<userStudy.length; y++){
                        
                        if(positions[x].content_id == userStudy[y].id){
                            var i = 0
                            for (var t=0; t<typeAry.length; t++){
                                
                                if(positions[x][typeAry[t]]==1){
                                    temparr[i] =typeAry[t];
                                    i++;
                                    
                                }
                            
                            }
                            

                            templist[x]=temparr.toString();
                            var number = positions[x].position_id + 1
                            var currentnum = 0;
                            //삭제한 부분
                            // $("#"+userClass[y].id).children().append('<tr> <td>'+templist[x]+'</td> </tr>');
                            $("#member"+userStudy[y].id+"_s").append("<li class='conditionLine'><span class ='marginleft'>"+number+"</span><span class='conditionList marginleft'>"+templist[x]+"</span>"+"(<span class='currentnum colortext'>"+currentnum+"</span><span class ='colortext'>/</span><span class='totalnum colortext'>"+positions[x].number+"</span>)"+"</li> <li><span >▶</span></li>");
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

                            //추가한 부분
                            var condition = $("#"+userClass[q].id).parent(".rightbox").siblings(".leftbox").find(".conditionList").eq(participants[p].position_id).text();
                           
                            // 수정한 부분
                            $("#"+userClass[q].id).children().children('tbody').append('<tr class='+participants[p].position_id+'><td>'+condition+'</td><td>'+ partiList +'</td>'+'<td> <button class = "acceptBtn">수락 하기</button></td></tr>');                            
                        }
                    }
                    
                    // for (var hi=0; hi<userClass.length; hi++){
                    //     $("#"+hi).children().children('tbody').chidren('tr').each(function(){
                    //         var trnum = 0;
                    //         //console.log($(this).length);
                    //         trnum ++;
                    //         console.log(trnum);
                    //     });
                    // }
                    
                    for (var q=0; q<userStudy.length; q++){
                        if(participants[p].type == 0 && participants[p].content_id == userStudy[q].id){
                            position_s = "position_s" + participants[p].position_id;

                            //추가한 부분
                            var condition = $("#"+userStudy[q].id+"_s").parent(".rightbox").siblings(".leftbox").find(".conditionList").eq(participants[p].position_id).text();
                           
                            // 수정한 부분
                            $("#"+userStudy[q].id+"_s").children().children('tbody').append('<tr class='+participants[p].position_id+'><td>'+condition+'</td><td>'+ partiList +'</td>'+'<td> <button class = "acceptBtn">수락 하기</button></td></tr>');                            
                            
                        }
                    }
                      
                }
            }
            //신청자 수만큼 알람기능(클래스)
            for (var hi=0; hi<userClass.length;hi++){
                var trnum = $("#"+userClass[hi].id).children().children('tbody').children('tr').length;
                
                if(trnum!=0){
                    $("#"+userClass[hi].id).parent().parent().prev().children().children('.alarm').append(trnum);
                    $("#"+userClass[hi].id).parent().parent().prev().children().children('.alarm').attr("class","alarm_on");

                }
            }
            //신청자 수만큼 알람기능(스터디)
            for (var hi=0; hi<userStudy.length;hi++){
                var trnum = $("#"+userStudy[hi].id+"_s").children().children('tbody').children('tr').length;
                if(trnum!=0){
                    $("#"+userStudy[hi].id+"_s").parent().parent().prev().children().children('.alarm').append(trnum);
                    $("#"+userStudy[hi].id+"_s").parent().parent().prev().children().children('.alarm').attr("class","alarm_on");

                }
            }
            var trnumSum = 0;
            $(".alarm_on").each(function(){
                for(var find = 0; find<$(this).length; find++){
                    trnumSum = trnumSum + parseInt($(this).text());
                }

                
            })
            $(".trnum_sum").append(trnumSum);

            


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
           
            cancelInfo["position_id"] = $(this).siblings(".posNum").val();
            cancelInfo["participant_id"] = loginUser.id;
            if($(this).hasClass("classCancelBtn")){
                cancelInfo["type"]=1;      

            }   
            else{
                cancelInfo["type"]=0;
            }
      
            $.ajax({
                url: "/delete_participant_both",
                type:"POST",
                data: cancelInfo,
                success:function(){
                    content.remove();
                    location.reload();
                },
                error: function(request,error,status){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    return false;
                }
                
            })
        }
        
        
    })
}

function user2group(){
    $(document).on("click",".acceptBtn",function(){
        var partiname = $(this).parent().prev().text();
        var positionname = $(this).parent().parent().attr('class');
        var classnum = $(this).parent().parent().parent().parent().parent().attr('id');
        var target = positionname*2 +1;
        var totalnumber = $("#member"+classnum).children('li').eq(target-1).find(".totalnum").text();
        var dup = false;
        var currentnumber = $("#member"+classnum).children('li').eq(target-1).find(".currentnum").text();
        if(totalnumber>currentnumber){
            var a = $(this);
            console.log(a);
            $(this).parents(".rightbox").siblings(".leftbox").find("#member"+classnum).find('.confirmList').each(function(){
                if($(this).text()==partiname){
                    alert("그룹 내 중복된 사용자가 존재합니다.");
                    dup = true;
                    return false;
                }
            });  

            if(dup){
                return false;
            }
            $("#member"+classnum).children('li').eq(target).append('<span class="confirmList">'+partiname+'</span>');
            var cr = $("#member"+classnum).find(".currentnum").eq(positionname).text();
            cr++;
            if(cr == totalnumber){
                $("#member"+classnum).children('li').eq(target-1).find(".colortext").css("color","blue");
            }
            $("#member"+classnum).find(".currentnum").eq(positionname).text(cr);
            console.log(a)
            a.attr('class',"cancelConfirmBtn");
            a.text('취소 하기');
            
           
            
        }
        else{
            $("#member"+classnum).children('li').eq(target-1).find(".colortext").css("color","red");
            alert("모집인원이 꽉 찬 분야입니다.");
            $("#member"+classnum).children('li').eq(target-1).find(".colortext").css("color","blue");
            
        }
    });

}

function group2user(){
    $(document).on("click",".cancelConfirmBtn",function(){
        
        var positionname = $(this).parent().parent().attr('class');
        var classnum = $(this).parent().parent().parent().parent().parent().attr('id');
        var cancelTarget  = $(this).parent().prev().text();
        var target = positionname*2 +1;
        $("#member"+classnum).children('li').eq(target-1).find(".colortext").css("color","black");
        $("#member"+classnum).children('li').eq(target).find(".confirmList").each(function (){      
            if($(this).text()==cancelTarget){
                $(this).remove();
                var cr = $("#member"+classnum).find(".currentnum").eq(positionname).text();
                cr--;
                $("#member"+classnum).find(".currentnum").eq(positionname).text(cr);
            }
        });
        $(this).attr("class","acceptBtn");
        $(this).text('수락 하기')
    });
}

function makeGroup(){
    
    $(document).on("click",".makeGroupBtn",function(){
        var totalNum=0;
        var result;
        var totalParticipant=$(this).parent().siblings(".leftbox").find(".totalNum").children("span").text();
        $(this).parent().siblings(".leftbox").find(".conditionLine").each(function(){
            

            var currentNum =$(this).find(".currentnum").text();
            totalNum += parseInt(currentNum);
        })

        if(parseInt(totalParticipant)!=totalNum){
            result= confirm("설정 인원보다 모집 인원이 적습니다.\n이대로 그룹을 만드시겠습니까?")
        }
        else{
            result= confirm("그룹을 생성하시겠습니까?\n그룹이 생성되면 모집 인원들의 이름과 전화번호가 공개됩니다.");
        }
        if(result){
            
            
        }
        // $(".conditionLine").find(".currentnum").each(function(){
        //     console.log($(this));
        // })
    })
 
}

