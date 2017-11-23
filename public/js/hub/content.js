var fill_content = (value) => {
    $(".node-selector").html(value)
    $.get("/node/" + value, () => {                
        $("#content").html('<div class="preloader-wrapper big active">'
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

var fil = document.querySelector("span.fil")

var breadcrumbs = (value) => {
    let data = value.split("/");
    console.log(data)
    data.forEach(element => {
        var a = document.createElement('a'),
        text_a = document.createTextNode(element);

        a.appendChild(text_a);
        a.setAttribute("class", 'breadcrumb')
        fil.appendChild(a);
        console.log(element, " created")
    });
};