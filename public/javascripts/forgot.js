$(document).ready(function(e) {
    $("#fixHeader").load("/header");

    $("#id").focusout(() => {
        if($('#id').val() == "") {
            $('#id_msg').html("필수 입력");
        }
    });

    $("#email").focusout(() => {
        if($('#email').val() == "") {
            $('#email_msg').html("필수 입력");
        }
    });

    $('#send_num').on("click", () => {
        const userid = $('#id').val();
        const usermail = $('#email').val();

        $.ajax({
            url: '/findpw',
            type: 'POST',
            dataType: 'json',
            data: { 
                'userid' : userid,
                'usermail': usermail,
             },
            success: () => {
                console.log("끝");
            },
        });
    });

    $("#numCheck").focusout(() => {
        const inp_id = $('#id').val();
        const inp_num = $('#numCheck').val();

        if(inp_num == "") {
            $('#auth_msg').html("필수 입력");
            $("#findPwBtn").attr("disabled", true);
        }
        else {
            $.ajax({
                url: '/findpw/numcheck',
                type: 'POST',
                dataType: 'json',
                data: { 
                    'id' : inp_id,
                    'num': inp_num, 
                },
                success: (result) => {
                    if(result['result'] == true) {
                        $('#auth_msg').html("인증 성공");
                        $("#findPwBtn").attr("disabled", false); 
                    }
                    else {
                        $('#auth_msg').html("인증 실패");
                        $("#findPwBtn").attr("disabled", true);
                    }
                },
            }); 
        }
    });
});