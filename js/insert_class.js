$(document).ready(function(){
    clickEvnet();
    selectBox();
    autoComplete();
    numberInput();

   
})

function clickEvnet(){

    $(".dateBtn").click(function(){
        var index=$(this).index()-7;
        if($(this).hasClass("active")){  
            $(this).removeClass("active2");
            $(this).removeClass("active");
            $(".timeList").children().eq(index).removeClass("active");
        }
        else{
            $(this).addClass("active");
            console.log($(this));
            $(".timeList").children().eq(index).find(".dynamicDate").text($(this).text());
            $(".timeList").children().eq(index).addClass("active");
            
        }
        
    })
    $(document).on("click",".deleteRoleBtn",function(){
      $(this).parent().hide("fast",function(){
        $(this).remove();
      })
    })
    $(".roleAddBtn").click(function(){
      var dynamicList = '<li class="participantList"><span class ="roleList firstLine">자격 요건: </span><input class="roleListInput searchInput"><br><span class ="roleList">모집 인원: </span><input type="text" class="roleListInput howMany numberOnly" value="1" maxlength="3"><span> 명</span><br><span class ="roleList">요건 상세 설명: </span><input type="text" class="roleListInput detailInput"></li>'
      $(".participantBox").append(dynamicList);
    })

    $(".submitBtn").click(function(){
        var classInfo={};
        var title = $("#title").val();
        var date =[];
        var time =[];
        var icon = $(".myIcon").attr("src");
        var role = $("input[type=radio]:checked").val();
        var credit= $(".creditLine").val();
        var description = $(".detailLine").val();
        var total_participant =1;
        var current_participant=1;
        console.log(icon);
        if(icon == "../img/icons/add.png"){
          alert("아이콘을 설정해주세요\n(아이콘은 게시글 목록에 표시됩니다.)");
          return;
        }
        if($(".dynamicTime.active").length ==0){
            alert("시간을 설정해주세요");
            return;
        }
        if(role==undefined){
          alert("역할을 설정해주세요");
          return;
        }
        
        $(".dynamicTime").each(function(){
            if($(this).hasClass("active")){
                date.push($(this).children(".dynamicDate").text());     
                var startTime = $(this).find("#select-start").val();
                var endTime = $(this).find("#select-end").val();
                if(startTime=="미설정" || endTime=="미설정"){
                    time.push("미설정");
                }
                else{
                    time.push(startTime+" ~ "+endTime);
                }
                
            }
            
        })
        date = date.toString();
        time = time.toString();
        if($(".participantList").length ==0){
            alert("참가 인원은 1명 이상이어야 합니다.")
            return;
        };
        $(".participantList").each(function(){
            total_participant += Number($(this).find(".howMany").val());
            
        })
        classInfo["title"] = title;
        classInfo["date"] = date;
        classInfo["time"] = time;
        classInfo["role"] = role;
        classInfo["icon"] = icon;
        classInfo["credit"] = credit;
        classInfo["total_participant"] = total_participant;
        classInfo["current_participant"] = current_participant;
        classInfo["description"] = description;

        //position table 값 형성
        
        var positionList=[];
        var onePerson={};
        var i=0;
        var checkBit =1;
        $(".participantList").each(function(){
            var conditionDetail;
            var condition = [];
            var number=$(this).find(".howMany").val();
            if($(this).find(".roleItem").length ==0){
                alert("참가인원의 자격요건을 설정해주세요\n없다면 '없음'으로 설정해주세요 ...^^*");
                checkBit =0;
                return;
            }
            $(this).find(".roleItem").each(function(){
                if($(this).text() =="없음"){
                  condition = ["none"];
                  return false;
                }
                else{
                  condition.push($(this).text());
                }
                
            });
            console.log(condition);
            conditionDetail = $(this).find(".detailInput").val();
            onePerson = {"condition":condition,"number":number,"description": conditionDetail}; 
            positionList.push(onePerson);
        })
        if(checkBit ==0){
          return;
        }
          $.ajax({
              url: '/insert_class',
              type: 'POST',
              data: 
              {
                  "classInfo" :classInfo,
                  "positionList":positionList
              },
              success: function(response) {
                  alert("클래스 등록이 완료되었습니다.");
                  location.href="/classes/1"
              },

              error: function(request,error,status){
                  alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                  return false;
              }
          })
      
    })

    $(".iconWrap").click(function(){
    
      $(".iconBox").toggleClass("active");
      var imageHeight = $(".image").outerWidth();
      $(".image").css("height",imageHeight);
      $(".iconBox").toggleClass("active2");
    
      
    })
    $(".image").click(function(){
      var imageSource = $(this).children("img").attr("src");
      $(this).siblings().children(".coverWrap").css("background","#fff");
      $(this).children(".coverWrap").css("background","none");
      $(".previewIcon").children("img").attr("src",imageSource);
    })
}

function selectBox(){

    $('.sel').each(function() {
        $(this).children('select').css('display', 'none');
        
        var $current = $(this);
        
        $(this).find('option').each(function(i) {
          if (i == 0) {
            $current.prepend($('<div>', {
              class: $current.attr('class').replace(/sel/g, 'sel__box')
            }));
            
            var placeholder = $(this).text();
            $current.prepend($('<span>', {
              class: $current.attr('class').replace(/sel/g, 'sel__placeholder'),
              text: placeholder,
              'data-placeholder': placeholder
            }));
            
            return;
          }
          
          $current.children('div').append($('<span>', {
            class: $current.attr('class').replace(/sel/g, 'sel__box__options'),
            text: $(this).text()
          }));
        });
      });
      
      // Toggling the `.active` state on the `.sel`.
      $('.sel').click(function() {

        $(this).toggleClass('active');
      });
      
      // Toggling the `.selected` state on the options.
      $('.sel__box__options').click(function() {
        var txt = $(this).text();
        var index = $(this).index();
        
        $(this).siblings('.sel__box__options').removeClass('selected');
        $(this).addClass('selected');
        
        var $currentSel = $(this).closest('.sel');
        $currentSel.children('.sel__placeholder').text(txt);
        $currentSel.children('select').prop('selectedIndex', index + 1);
      });
      
}

function autoComplete(){

  $(document).on('keydown.autocomplete', ".searchInput", function() {
    var searchSource = ["C","C++","C#","Java","Ruby","Python","R","Go","HTML/CSS","Javascript","Spring","Nodejs","Angularjs","Vuejs","Reactjs","PHP","Android","IOS","Swift","Kotlin","Objective-C","MYSQL","MongoDB","SpringBoot","OracleDB","없음"]; 
    $(".searchInput").autocomplete({  //오토 컴플릿트 시작
      source : searchSource,	// source 는 자동 완성 대상
      select : function(event, ui) {	//아이템 선택시
        var dynamicRole = '<div class="roleItemBox"><span class="roleItem">'+ui.item.value+'</span><button class="deleteRoleBtn"></button></div>'
        $(this).siblings(".firstLine").append(dynamicRole);
        ui.item.value="";
      },
      focus : function(event, ui) {	//포커스 가면
        return false;//한글 에러 잡기용도로 사용됨
      },
      minLength: 1,// 최소 글자수
      autoFocus: true, //첫번째 항목 자동 포커스 기본값 false
      classes: {	//잘 모르겠음
          "ui-autocomplete": "highlight"
      },
      delay: 100,	//검색창에 글자 써지고 나서 autocomplete 창 뜰 때 까지 딜레이 시간(ms)
      position: { my : "right top", at: "right bottom" },	//잘 모르겠음
      close : function(event){	//자동완성창 닫아질때 호출
      }
    });
  });
}

function numberInput(){

    $(document).on("keyup",".numberOnly",function(){
        $(this).val($(this).val().replace(/[^0-9]/g,""));
      })

}