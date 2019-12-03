$(function() {
    var reportedUser;

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
        $(document).on("click","#reportLink",function(){
            $("#myModalReport").css({
                "display": "block"
            });
            reportedUser = $(this).parent().children(":first").attr("value")

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

        $("html").click(function(event) {
            if (event.target.id === "myModalReport") {
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

        $(".submitBtn").click(function() {
            var title = $("#title")[0].value
            var detail = $("#detail")[0].value

            console.log(title)
            console.log(detail)

            $.ajax({
                url: '/report',
                type: 'POST',
                data:
                    {
                        "reportedUser" : reportedUser,
                        "title" : title,
                        "detail" : detail
                    },
                success: function(response) {
                    alert("신고가 성공적으로 접수되었습니다.");
                    $(".modal").css({
                        "display":"none"
                    });
                    $("#title")[0].value = null
                    $("#detail")[0].value = null
                },

                error: function(request,error,status){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    return false;
                }
            })
        })


    });
})