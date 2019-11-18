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
            $(this).removeClass("active");
            $(".timeList").children().eq(index).removeClass("active");
        }
        else{
            $(this).addClass("active");
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
      var dynamicList = '<li class="participantList"><span class ="roleList firstLine">자격 요건: </span><input class="roleListInput searchInput"><br><span class ="roleList">모집 인원: </span><input type="text" class="roleListInput howMany numberOnly" maxlength="3"><span> 명</span><br><span class ="roleList">요건 상세 설명: </span><input type="text" class="roleListInput detailInput"></li>'
      $(".participantBox").append(dynamicList);
    })

    $(".submitBtn").click(function(){
      var title = $("#title").val();
      var date =[];
      var time =[];
      var role = $("input[type=radio]:checked").val();
      var credit= $(".creditLine").val();
      var decription = $(".detailLine").val();
      var participants = [];
      var participant = [];
      $(".dynamicTime").each(function(){
        if($(this).hasClass("active")){
          date.push($(this).children(".dynamicDate").text());
          var startDate = $(this).find("#select-start").val();
          var endDate = $(this).find("#select-end").val();
          time.push(startDate+"~"+endDate);
        }
        
      })
      $(".participantList").each(function(){
        console.log($(this));
        
      })
      

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
    var searchSource = ["C","C++","C#","Java","Ruby","Python","R","Go","HTML/CSS","Javascript","Spring","Nodejs","Angularjs","Vuejs","Reactjs","PHP","Andriod","IOS","Swift","Kotlin","Objective-c","MYSQL","MongoDB","SpringBoot","OracleDB"]; 
    $(".searchInput").autocomplete({  //오토 컴플릿트 시작
      source : searchSource,	// source 는 자동 완성 대상
      select : function(event, ui) {	//아이템 선택시
        var dynamicRole = '<div class="roleItemBox"><span class="roleItem">'+ui.item.value +' </span><button class="deleteRoleBtn"></button></div>'
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

    $(".numberOnly").on("keyup", function() {
      $(this).val($(this).val().replace(/[^0-9]/g,""));
    });


}