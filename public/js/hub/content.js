var fill_content = (value) => {
    $.get("/node/" + value, () => {                
        $("#content").html('<div class="preloader-wrapper big active" style="margin:auto">'
        + '<div class="spinner-layer spinner-blue-only">'
        + '<div class="circle-clipper left">'
        + '<div class="circle"></div>'
        + '</div><div class="gap-patch">'
        + '<div class="circle"></div>'
        + '</div><div class="circle-clipper right">'
        + '<div class="circle"></div>'
        + '</div>'
        + '</div>'
        + '</div>')
    })
    .done(data => {
        
    })
    .fail(err => {
        $("#content").html('<span>There is no result</span>')
    });
}