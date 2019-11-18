$(document).ready(function(){
    clickEvnet();
    selectBox();
    autoComplete();
})

function clickEvnet(){

    $(".dateBtn").click(function(){
        var index=$(this).index()-7;
        console.log(index);
        if($(this).hasClass("active")){  
            $(this).removeClass("active");
            $(".timeList").children().eq(index).removeClass("active");
        }
        else{
            $(this).addClass("active");
            $(".timeList").children().eq(index).find(".dynamicDate").text($(this).text());
            console.log($(".timeList").children().eq(index));
            $(".timeList").children().eq(index).addClass("active");
        }
        
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
  var searchSource = ["C","C++","C#","Java","Ruby","Python","R","Go","html/css","Javascript","Spring","Nodejs","Angular","Vue","React","PHP","Andriod","IOS","Swift","Kotlin","Objective-c","MYSQL","MongoDB","SpringBoot","Oracle"]; 
  $("#searchInput").autocomplete({  //오토 컴플릿트 시작
    source : searchSource,	// source 는 자동 완성 대상
    select : function(event, ui) {	//아이템 선택시
      console.log(ui.item);
    },
    focus : function(event, ui) {	//포커스 가면
      return false;//한글 에러 잡기용도로 사용됨
    },
    minLength: 1,// 최소 글자수
    autoFocus: true, //첫번째 항목 자동 포커스 기본값 false
    classes: {	//잘 모르겠음
        "ui-autocomplete": "highlight"
    },
    delay: 500,	//검색창에 글자 써지고 나서 autocomplete 창 뜰 때 까지 딜레이 시간(ms)
//			disabled: true, //자동완성 기능 끄기
    position: { my : "right top", at: "right bottom" },	//잘 모르겠음
    close : function(event){	//자동완성창 닫아질때 호출
      console.log(event);
    }
  });


}
