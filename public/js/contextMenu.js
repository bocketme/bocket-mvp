var menuState = false;
var activeClass = "specs-context-menu-active";
var gSelector;
var gSelectorId;

/**
 * Open the menuContext
 * @param selectorId : JQuery id of the dropdown context menu
 */
function toggleMenuContextOn(selectorId) {
    var selector = $(selectorId);

    gSelector = selector;
    gSelectorId = selectorId;
    console.log("toggleMenuContextOn");
    selector.addClass(activeClass);
    selector.addClass("active");
    var pos = getPosition(event);
    if (pos.x + selector.width() > $(document).width())
        pos.x = $(document).width() - selector.width() - 10;
    if (pos.y + selector.height() > $(document).height())
        pos.y = $(document).height() - selector.height() - 10;
    selector.css("left", pos.x + "px").css("top", pos.y + "px");
    menuState = true;
}

function toggleMenuContextOff() {
    if (gSelector !== undefined) {
        gSelector.removeClass("active");
        gSelector.removeClass(activeClass);
    }
}

$(document).ready(function(e) {
    $(document).on("click", function (e) {
       if (menuState === true && $(e.target).parents(gSelectorId).length === 0) {
           toggleMenuContextOff();
       }
    });
});

/**
 * get mouse position
 * @param e
 * @returns {{x: number, y: number}}
 */
function getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;

    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
        console.log("e.pageX:", posx, " e.pageY:", posy);
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
        console.log("e.clientX:", posx, " e.clientY:", posy);
    }

    return {
        x: posx,
        y: posy
    }
}