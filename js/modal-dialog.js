$(function() {

    $(document).ready(function() {

        $(".addItem").hover(function(){
            $(this).find(".addPlusBtn").addClass("active");
        },function(){
            $(this).find(".addPlusBtn").removeClass("active");
        })
        $(document).on("click",".detailLink",function(){
            var src = $(this).attr('value')
            $("#content-detail").prop('src',src)
            $("#myModal").css({
                "display": "block"
            });
        })
        $(".item-container,.partyTitle").click(function() {
            
            if($(this).hasClass("addItem")){

            }else{
                var src = $(this).attr('value')
                $("#content-detail").prop('src',src)
                $("#myModal").css({
                    "display": "block"
                });
            }
            
        });
        


        $("html").click(function(event) {
            if (event.target.id === "myModal") {
                $("#content-detail").prop('src',"")
                $(".modal").css({
                    "display":"none"
                });
            }
        });


        $(".close").click(function() {
            $(".modal").css({
                "display":"none"
            });
        });


    });
})