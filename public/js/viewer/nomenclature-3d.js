document.getElementById("visual-button").addEventListener("click", function(event) {
    var annot_table = $("[id^=annot]"),
        i = annot_table.length;

    while (--i >= 0)
    {
        if (annot_table[i].nodeName === "DIV" || annot_table[i].nodeName === "IMG")
        {
            if (annot_table[i].style.display === "block")
                annot_table[i].style.display = "none";
            else
                annot_table[i].style.display = "block";
        }
    }
});

document.getElementById("annot-button").addEventListener("click", function(event) {
    annot_mode = true;
});

// document.getElementById("ruler-button").addEventListener("click", function(event) {
//     ruler_mode = true;
// });

document.getElementById("resize-button").addEventListener("click", function(event) {
    viewer.fitToScreen();
});

document.getElementById("translate").addEventListener("click", function(event) {
    viewer.setTransformMode("translate");
});

document.getElementById("rotate").addEventListener("click", function(event) {
    viewer.setTransformMode("rotate");
});

document.getElementById("scale").addEventListener("click", function(event) {
    viewer.setTransformMode("scale");
});

document.getElementById("space").addEventListener("click", function(event) {
    viewer.changeTransformSpace();
});