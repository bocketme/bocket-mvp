(function ($) {
    $(function () {
        //initialize all modals
        $('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .7, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '2%', // Starting top style attribute
            endingTop: '10%', // Ending top style attribute
        });
        $(".collapsible").collapsible();
        $(".collapsible").collapsible('open', 1);
        $('ul.tabs').tabs();

        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: true, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left', // Displays dropdown with edge aligned to the left of button
            stopPropagation: false // Stops event propagation
        });

        $(".triple-dots").dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left', // Displays dropdown with edge aligned to the left of button
            stopPropagation: false, // Stops event propagation
        });

        //Socket<
        $('.chips').material_chip();

        //Socket
        socket.on("nodeLocation", (node) => {
            console.log(node);
            locationVue.nodeInformation(node);
            locationVue.maturityInformation(node.maturity);
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
        })

        socket.on('nodeChild', (html, nodeId) => {
            console.log("Find Node Child")
            var collapsible_body = $('#'+nodeId+'-body');
            if(collapsible_body.hasClass("container")) {
                collapsible_body.removeClass("container");
                collapsible_body.html(html);
            }
        });

        socket.on('contentFile3d', (data) => {
            //JA A TOI DE JOUER

        });

        socket.on('nodeChild', (html, nodeId) => {
            console.log("Find Node Child");
            var collapsible_body = $('#'+nodeId+'-body');
            if(collapsible_body.hasClass("container")) {
                collapsible_body.removeClass("container");
                collapsible_body.html(html);
            }
        });

        var views = $(".view");
        views.mouseout(function () {
            $(this).removeClass("viewHover");
            if (!$(this).hasClass("viewClicked")) {
                $(this).addClass("viewNotHover");
                console.log("hasNot");
            } else {
                console.log("hasClass");
            }
        });

        views.mouseover(function () {
            $(this).removeClass("viewNotHover");
            $(this).addClass("viewHover");
        });

        views.on("click", function () {
            views.removeClass("viewClicked");
            views.addClass("viewNotHover");
            $(this).removeClass("viewHover");
            $(this).removeClass("viewNotHover");
            $(this).addClass("viewClicked");
        });

        collapseOwners($("#location .owners"));
    });
})(jQuery); // end of jQuery name space

/**
 * Collapse the owners in location div
 * @param owners : JQueryElement
 */
function collapseOwners(owners) {
    var i = 0;
    var zIndex = owners.length;
    var move = 0;

    console.log("zIndex = ", zIndex);
    while (i < owners.length) {
        $(owners[i]).css("right", move + "%");
        $(owners[i]).css("z-index", zIndex--);
        i += 1;
        move += 8;
    }
}
