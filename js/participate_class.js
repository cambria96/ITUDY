$(function() {

    $(document).ready(function () {

        $(".participate_button").click(function () {
            var content_id = $('#content_id').attr('value')
            var position_id = $('#position').val()
            console.log(content_id)
            console.log(position_id)
            var data = {content_id: content_id, position_id: position_id}
            $.ajax({
                url: '/participate_class',
                type: 'POST',
                data: data,
                success: function () {
                    alert("참가 신청이 완료되었습니다.");
                    // location.href = '/mypage';
                },
                error: function (request, error, status) {
                    alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                    return false;
                }
            })
        });
    })
})
