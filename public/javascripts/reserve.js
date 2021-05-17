$(document).ready(function(e) {
    $("#fixHeader").load("/header");

    $('#date').focusout(()=> {
        const inpDate = $('#date').val();
        console.log(inpDate);

        $.ajax({
            url: '/reserve/checkDate',
            type: 'POST',
            dataType: 'json',
            data: { 'inpDate': inpDate },
            success: (result) => {
                if(result['result'] == 'ok') {
                    $('#date_msg').html("사용 가능");
                    $("#reserveBtn").attr("disabled", false);
                }
                else if(result['result'] == 'passed') {
                    $('#date_msg').html("과거에서 오셨습니가");
                    $("#reserveBtn").attr("disabled", true);
                }
                else {
                    $('#date_msg').html("이미 예약된 날짜");
                    $("#reserveBtn").attr("disabled", true);
                }
            }
        });
    });
    $("#reset").on("click", () => {
        $(".msg").html("");
    });
});