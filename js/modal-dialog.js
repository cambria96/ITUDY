$(function() {

    $(document).ready(function() {

        $(".item-container").click(function() {
            var src = $(this).attr('value')
            console.log(src);
            $("#content-detail").prop('src',src)
            $("#myModal").css({
                "display": "block"
            });
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