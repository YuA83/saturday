if(!document.referrer) {
    alert('ERROR : permission denined');
    location.replace('/forgot/pw');
}
else {
    $(document).ready(function(e) {

        $("#fixHeader").load("/header");

        const pw_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{6,12}$/;
        let pwBool = 1;
        let reEnterBool = 1;

        $("#resetPw").focusout(() => {
            let inp_pw = $('#resetPw').val();
            let pwExp = pw_pattern.test(inp_pw);

            if(inp_pw == "") {
                $('#repw_msg').html("필수 입력");
                pwBool = 1;
                $("#resetBtn").attr("disabled", true);
            }
            else {
                if(!pwExp) {
                    $('#repw_msg').html("대문자, 소문자, 숫자, 특수문자 사용 6~12자");
                    pwBool = 1;
                    $("#resetBtn").attr("disabled", true);
                }
                else {
                    $('#repw_msg').html("사용 가능");
                    pwBool = 0;

                    if((pwBool||reEnterBool) == 0) {
                        $("#resetBtn").attr("disabled", false);
                    }
                }
            }
        });

        $("#rereen").focusout(() => {
            if($('#rereen').val() == "") {
                $('#rereen_msg').html("필수 입력");
                reEnterBool = 1;
                $("#resetBtn").attr("disabled", true);
            }
            else {
                if($('#rereen').val() == $('#repw').val()) {
                    $('#rereen_msg').html("비밀번호 일치");
                    reEnterBool = 0;

                    if((pwBool||reEnterBool) == 0) {
                        $("#resetBtn").attr("disabled", false);
                    }
                } 
                else {
                    $('#rereen_msg').html("비밀번호 불일치");
                    reEnterBool = 1;
                    $("#resetBtn").attr("disabled", true);
                }
            }
        });
    });
}