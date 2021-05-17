$(document).ready(function(e) {
    $("#fixHeader").load("/header");

    const email_pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))+$/;

    let emailB = 1;
    let authB = 1;

    $("#email").focusout(() => {
        let inp_email = $("#email").val();
        let emailExp = email_pattern.test(inp_email);

        if(inp_email == "") {
            $('#email_msg').html("필수 입력");
            emailB = 1;
            $("#send_num").attr("disabled", true);
            $("#emailBtn").attr("disabled", true);
        }
        else {
            if(!emailExp) {
                $('#email_msg').html("잘못된 형식");
                emailB = 1;
                $("#send_num").attr("disabled", true);
                $("#emailBtn").attr("disabled", true);
            }
            else {
                $.ajax({
                    url: '/email/check',
                    type: 'POST',
                    dataType: 'json',
                    data: { 'email': inp_email },
                    success: (result) => {
                        if(result['result'] == true) {
                            $('#email_msg').html("사용 가능");
                            emailB = 0;
                            $("#send_num").attr("disabled", false);

                            if((emailB||authB) == 0) {
                                $("#emailBtn").attr("disabled", false);
                            }
                        }
                        else {
                            $('#email_msg').html("중복된 이메일");
                            emailB = 1;
                            $("#send_num").attr("disabled", true);
                            $("#emailBtn").attr("disabled", true);
                        }
                    },
                });
            }
        }
    });

    $('#send_num').on("click", () => {
        const usermail = $('#email').val();

        $.ajax({
            url: '/auth',
            type: 'POST',
            dataType: 'json',
            data: { 
                'usermail': usermail,
             },
            success: () => {
                console.log("끝");
            },
        });
    });

    $("#numCheck").focusout(() => {
        let inp_num = $('#numCheck').val();

        if(inp_num == "") {
            $('#email_msg').html("필수 입력");
            authB = 1;
            $("#emailBtn").attr("disabled", true);
        }
        else {
            $.ajax({
                url: '/email/numcheck',
                type: 'POST',
                dataType: 'json',
                data: { 'num': inp_num },
                success: (result) => {
                    if(result['result'] == true) {
                        $('#auth_msg').html("인증 성공");
                        emailB = 0;
                            $("#emailBtn").attr("disabled", false);
                    }
                    else {
                        $('#auth_msg').html("인증 실패");
                        emailB = 1;
                        $("#emailBtn").attr("disabled", true);
                    }
                },
            }); 
        }
    });
});