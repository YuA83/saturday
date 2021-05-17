$(document).ready(function(e) {
    $("#fixHeader").load("/header");

    $("#id").focusout(() => {
        let inp_id = $('#id').val();

        if(inp_id == "") {
            $('#id_msg').html("필수 입력");
        }
        else {
            $('#id_msg').html("");

        }
    });

    $("#password").focusout(() => {  
        let inp_pw = $('#password').val();

        if(inp_pw == "") {
            $('#pw_msg').html("필수 입력");
        }
        else {
            $('#pw_msg').html("");
        }
    });

    $("#reset").on("click", () => {
        $(".msg").html("");
    });
});