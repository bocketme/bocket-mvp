socket.on('nodeChild', (html, nodeID) => {
    console.log(html);
    console.log(nodeID);
    $(function () {
        $('.collapsible-body #'+String(nodeID)).appendChild(html);
    });
});

$(function(){
    $('i.material-icons.assembly').click();
    $('span.p-node').click(loadNodeInformation)
});

function loadChild () {
    console.log("Load Information AND SELECT NDOE");
    var body = $(this).parent();
    if (!body.contents().html()) {
        var nodeID = body.attr('id');
        socket.emit("nodeChildren", nodeID);
        $(function () {
            console.log("Yollo!");
            $(this).collapsible("open");
        })
    }
}

function loadNodeInformation (e) {
    console.log("Load Information AND SELECT NDOE");
    var element = $(this).parent();
    console.log(element);
    var nodeID = element.attr('id');
    socket.emit("nodeInformation", nodeID);
    $('.collapsible-header.node').removeClass('selected-accordion');
    element.addClass('selected-accordion');
    var fill_value = element.contents().filter("span").html();
    var breadcrumbs_value = element.contents().filter("span").attr("data-breadcrumbs");
    console.log(breadcrumbs_value);
    third_column.selectNode(fill_value, breadcrumbs_value);
    if ($('#location').hasClass('hide') || $('#content').hasClass('hide')) {
        $('#location').removeClass('hide');
        $('#location').fadeOut(0, () => {
            $('#location').fadeIn('slow');
        });
        $('#content').removeClass('hide');
        $('#content').fadeOut(0, () => {
            $('#content').fadeIn('slow');
        });
    }
    socket.emit("nodeChildren", nodeID);

    /*
    console.log("Load Information AND SELECT NDOE");
    var body = $(this).parent();
    if (!body.contents().html()) {
        var nodeID = body.attr('id');
        socket.emit("nodeChildren", nodeID);
    }
    */
}

$(document).ready(() => {
//    threeChild(twignode);
    $('.collapsible').css({'margin':'0'});
});