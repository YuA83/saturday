$(document).ready(function(e) {
    $("#fixHeader").load("/header");

    const id_pattern = /^[A-Za-z0-9_\-]{3,15}$/;
    const pw_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{6,12}$/;
    const name_pattern = /^[가-힣]+$/;
    const birth_pattern = /^(19[0-9][0-9]|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])+$/;

    let idBool = 1;
    let pwBool = 1;
    let reEnterBool = 1;
    let nameBool = 1;
    let birthBool = 1;

    $("#id").focusout(() => {
        let inp_id = $('#id').val();
        let idExp = id_pattern.test(inp_id);
        const regExp = ['admin', 'master'];
        let lower = inp_id.toLowerCase();

        let inxRes1 = lower.indexOf(regExp[0]); // 없으면 -1
        let inxRes2 = lower.indexOf(regExp[1]);

        if(inp_id == "") {
            $('#id_msg').html("필수 입력");
            idBool = 1;
            $("#signUpBtn").attr("disabled", true);
        }
        else {
            if(!idExp) {
                $('#id_msg').html("영어, 숫자 사용 3~15자");
                idBool = 1;
                $("#signUpBtn").attr("disabled", true);
            }
            else if((inxRes1 != -1) || (inxRes2 != -1)) {
                $('#id_msg').html("사용 불가능");
                idBool = 1;
                $("#signUpBtn").attr("disabled", true);
            }
            else {
                $.ajax({
                    url: '/signup/checkID',
                    type: 'POST',
                    dataType: 'json',
                    data: { 'data': inp_id },
                    success: (result) => {
                        if(result['result'] == true) {
                            $('#id_msg').html("사용 가능");
                            idBool = 0;
            
                            if((idBool||pwBool||reEnterBool||nameBool||birthBool) == 0) {
                                $("#signUpBtn").attr("disabled", false);
                            }
                        }
                        else {
                            $('#id_msg').html("중복된 아이디");
                            idBool = 1;
                            $("#signUpBtn").attr("disabled", true);
                        }
                    },
                });
            }
        }
    });

    $("#password").focusout(() => {
        let inp_pw = $('#password').val();
        let pwExp = pw_pattern.test(inp_pw);

        if(inp_pw == "") {
            $('#pw_msg').html("필수 입력");
            pwBool = 1;
            $("#signUpBtn").attr("disabled", true);
        }
        else {
            if(!pwExp) {
                $('#pw_msg').html("대문자, 소문자, 숫자, 특수문자 사용 6~12자");
                pwBool = 1;
                $("#signUpBtn").attr("disabled", true);
            }
            else {
                $('#pw_msg').html("사용 가능");
                pwBool = 0;

                if((idBool||pwBool||reEnterBool||nameBool||birthBool) == 0) {
                    $("#signUpBtn").attr("disabled", false);
                }
            }
        }
    });

    $("#re_enter").focusout(() => {
        if($('#re_enter').val() == "") {
            $('#re_enter_msg').html("필수 입력");
            reEnterBool = 1;
            $("#signUpBtn").attr("disabled", true);
        }
        else {
            if($('#re_enter').val() == $('#password').val()) {
                $('#re_enter_msg').html("비밀번호 일치");
                reEnterBool = 0;

                if((idBool||pwBool||reEnterBool||nameBool||birthBool) == 0) {
                    $("#signUpBtn").attr("disabled", false);
                }
            } 
            else {
                $('#re_enter_msg').html("비밀번호 불일치");
                reEnterBool = 1;
                $("#signUpBtn").attr("disabled", true);
            }
        }
    });

    $("#name").focusout(() => {
        let inp_name = $('#name').val();
        let nameExp = name_pattern.test(inp_name);

        if(inp_name == "") {
            $('#name_msg').html("필수 입력");
            nameBool = 1;
            $("#signUpBtn").attr("disabled", true);
        }
        else {
            if(!nameExp) {
                $('#name_msg').html("한글만 가능");
                nameBool = 1;
                $("#signUpBtn").attr("disabled", true);
            }
            else {
                $('#name_msg').html("사용 가능");
                nameBool = 0;

                if((idBool||pwBool||reEnterBool||nameBool||birthBool) == 0) {
                    $("#signUpBtn").attr("disabled", false);
                }
            }
        }
    });

    $("#birth").focusout(() => {
        let inp_birth = $('#birth').val();
        let birthExp = birth_pattern.test(inp_birth);

        if(inp_birth == "") {
            $('#birth_msg').html("필수 입력");
            birthBool = 1;
            $("#signUpBtn").attr("disabled", true);
        }
        else {
            if(!birthExp) {
                $('#birth_msg').html("잘못된 형식");
                birthBool = 1;
                $("#signUpBtn").attr("disabled", true);
            }
            else {
                $('#birth_msg').html("사용 가능");
                birthBool = 0;

                if((idBool||pwBool||reEnterBool||nameBool||birthBool) == 0) {
                    $("#signUpBtn").attr("disabled", false);
                }
            }
        }
    });
    
    $("#reset").on("click", () => {
        $(".msg").html("");
    });
});