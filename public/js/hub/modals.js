(function ($) {
    $(function () {
        // Submit the insertion of a new assembly
        $('#submit-import-assembly').click((event) => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            let form = document.querySelector("#form-import-assembly");
            if(cible !== "Select a node"){
                var node = {name: $("#assembly-name").val(), description: $("#assembly-description").val(), type: NodeTypeEnum.assembly};
                socket.emit("newNode", {node: node, workspaceId: workspaceId, parent: idOfchoosenNode});
                $("#import-assembly").modal("close");
            }
            else {
                Materialize.toast("You must select a node", 1000);
            }
        });
        // Submit the insertion of a new part
        $('#submit-import-part').click((event) => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            if(cible !== "Select a node"){
                var node = {name: $("#part-name").val(), description: $("#part-description").val(), type: NodeTypeEnum.part};
                socket.emit("newNode", {node: node, workspaceId: workspaceId, parent: idOfchoosenNode});
                $("#import-part").modal("close");
            }
            else {
                Materialize.toast("You must select a node", 1000);
            }
        });
        // Submit the insert of
        $('#submit-import-assembly').click(event => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            if(cible !== "Select a node"){
                var node = {name: $("#part-name").val(), description: $("#part-description").val(), type: NodeTypeEnum.assembly};
                socket.emit("newNode", {node: node, workspaceId: workspaceId, parent: idOfchoosenNode});
                $("#import-part").modal("close");
            }
            else {
                Materialize.toast("You must select a node", 1000);
            }
        })

        $('.modal-node-selector').click((event) => {
            if (third_column.$data.selected == "Select a node"){
                Materialize.toast("You must select a node", 2000);
                $('.button-form-validate').addClass("disabled");
            } else $('.button-form-validate').removeClass("disabled");
        });

    });
})(jQuery); // end of jQuery name space
