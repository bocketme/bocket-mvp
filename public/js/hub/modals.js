(function ($) {
    $(function () {
        // Submit the creation of a new Node
        $('#submit-create-new-node').click((event) => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            var form = document.querySelector("#form-create-new-node");
            if(cible !== "Select a node"){
                var node = {name: $("#node-name").val(), description: $("#node-description").val()};
                var splitedURL = window.location.href.split("//")[1].split("/");
                var workspaceId = splitedURL[2];
                socket.emit("newNode", {node: node, workspaceId: workspaceId});
            }
            else {
                Materialize.toast("You must select a node", 1000);
            }
        });
        // Submit the insertion of a new assembly
        $('#submit-import-assembly').click((event) => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            let form = document.querySelector("#form-import-assembly");
            if(cible !== "Select a node"){

                let formData =  new FormData(form);
                var request = new XMLHttpRequest();

                let chips = $('#tags-import-assembly').material_chip('data');
                if(chips.length !== 0){
                    formData.append('tags', JSON.stringify(chips));
                }

                request.open("POST", "/part/child/" +cible, true);
                request.onload = function(oEvent) {
                    if (request.status == 200) {
                        console.log("Uploaded!");
                    } else {
                        console.log("Error " + request.status + " occurred when trying to upload your file.<br \/>");
                    }
                };
                request.send(formData);
            }
            else {
                Materialize.toast("You must select a node", 1000);
            }
        });
        // Submit the insertion of a new part
        $('#submit-import-part').click((event) => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            let form = document.querySelector("#form-import-part");
            if(cible !== "Select a node"){

                let formData =  new FormData(form);
                var request = new XMLHttpRequest();

                let chips = $('#tags-import-part').material_chip('data');
                if(chips.length !== 0){
                    formData.append('tags', JSON.stringify(chips));
                }

                request.open("POST", "/part/" +cible, true);
                request.onload = function(oEvent) {
                    if (request.status == 200) {

                    } else {

                    }
                };
                request.onerror = (err) => {
                    console.error(err);
                }
                request.send(formData);
            }
            else {
                Materialize.toast("You must select a node", 1000);
            }
        });
        // Submit the insert of
        $('#submit-import-assembly').click(event => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            let form = document.querySelector("#form-import-part");
            if(cible !== "Select a node"){

                let formData =  new FormData(form);
                var request = new XMLHttpRequest();

                let chips = $('#tags-import-assembly').material_chip('data');
                if(chips.length !== 0){
                    formData.append('tags', JSON.stringify(chips));
                }

                request.open("POST", "/assembly/child/" +cible, true);
                request.onload = function(oEvent) {
                    if (request.status == 200) {
                        console.log("Uploaded!");
                    } else {
                        console.log("Error " + request.status + " occurred when trying to upload your file.<br \/>");
                    }
                };
                request.onerror = () => {}
                request.send(formData);
            }
            else {
                Materialize.toast("You must select a node", 1000);
            }
        })

        $('.modal-node-selector').click((event) => {
            console.log("yollo");
            if (third_column.$data.selected == "Select a node"){
                Materialize.toast("You must select a node", 2000);
                $('.button-form-validate').addClass("disabled");
            } else $('.button-form-validate').removeClass("disabled");
        });

    });
})(jQuery); // end of jQuery name space
