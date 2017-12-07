$(document).ready(function() {
    $(".activity-upload").on("click", function () {
        $("#activity-uploader").click();
    });

    $(".comment").on("click", function() {
        console.log("[.comment] onClick", $($(this).prev().children()[0]));
        $(this).prev().slideToggle(function() {
            $(this).children().trigger("select");
        });
    })
});
