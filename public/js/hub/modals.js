(function ($) {
    $(function () {

        // Submit the insertion of a new part
        $('#submit-import-part').click((event) => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            if (cible !== "Select a node") {
                var nodeId = $('.selected-accordion').attr('id');
                if (document.getElementById('import-part-file3D').files[0]) {
                    var form = document.getElementById("form-import-part");
                    var formdata = new FormData(form);
                    var postRequest = new XMLHttpRequest();
                    var chips = $('#tags-import-part').material_chip('data');
                    var sub_level = $("#"+nodeId).contents().filter("span.p-node").attr("data-sublevel");
                    var breadcrumb = $("#"+nodeId).contents().filter("span.p-node").attr("data-breadcrumbs");

                    formdata.append("sub_level", sub_level);
                    formdata.append("breadcrumb", breadcrumb);
                    formdata.append("tags", JSON.stringify(chips));

                    postRequest.addEventListener("load", (reqEvent) => {
                        if (postRequest.readyState === postRequest.DONE) {
                            if (postRequest.status === 200) {
                                $('#'+nodeId+'-body').html(postRequest.response)
                                var element = document.querySelectorAll('.three-node');
                                $(element).click(loadNodeInformation);
                            }  else if (postRequest.status === 404) {
                                Materialize.toast("Not Found", 1000);
                            } else if (postRequest.status === 401) {
                                Materialize.toast("The selected node is not an assembly", 1000);
                            }
                        }
                    }, false);

                    postRequest.addEventListener("error", function(event) {
                        Materialize.toast("The Part was not created", 1000);
                    }, false);
                    postRequest.addEventListener("abort", function(event) {
                        Materialize.toast("Network Error - The Part could not be created", 1000);
                    }, false);

                    postRequest.open('POST', '/part/' + nodeId, true);
                    postRequest.send(formdata);
                    $("#import-part").modal("close");
                    form.reset();
                    $("#form-import-part").find("input").val("");
                } else
                Materialize.toast("You must add a 3d File", 1000);
            } else
            Materialize.toast("You must select a node", 1000);
        });

        // Submit the insert of
        $('#submit-import-assembly').click(event => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            if (cible !== "Select a node") {
                if (document.getElementById('import_assembly_file3d').files[0]) {
                    var nodeId = $('.selected-accordion').attr('id'),
                        form = document.getElementById("form-import-assembly"),
                        formdata = new FormData(form),
                        postRequest = new XMLHttpRequest(),
                        chips = $('#tags-import-part').material_chip('data'),
                        sub_level = $(nodeId).contents().filter("span").attr("data-sublevel"),
                        breadcrumb = $(nodeId).contents().filter("span").attr("data-breadcrumbs");

                    formdata.append("sub_level", sub_level);
                    formdata.append("breadcrmb", breadcrumb);
                    formdata.append("tags", JSON.stringify(chips));

                    postRequest.addEventListener("load", (reqEvent) => {
                        if (postRequest.readyState === postRequest.DONE) {
                            if (postRequest.status === 200) {
                                $('#'+nodeId+'-body').html(postRequest.response);
                                var element = document.querySelectorAll('.three-node');
                                $(element).click(loadNodeInformation);
                            } else if (postRequest.status === 404) {
                                Materialize.toast("Not Found", 1000);
                            } else if (postRequest.status === 401) {
                                Materialize.toast("The selected node is not an assembly", 1000);
                            }
                        }
                    }, false);
                    postRequest.addEventListener("error", function(event) {
                        Materialize.toast("The Part was not created", 1000);
                    }, false);
                    postRequest.addEventListener("abort", function(event) {
                        Materialize.toast("Network Error - The Part could not be created", 1000);
                    }, false);

                    postRequest.open('POST', '/assembly/' + nodeId, true);
                    postRequest.send(formdata);
                    form.reset();
                    $("#import-assembly").modal("close");
                    $("#form-import-assembly").find("input").val("");
               } else
                Materialize.toast("You must add a 3d File", 1000);
            } else
            Materialize.toast("You must select a node", 1000);
        });

        $('.modal-node-selector').click((event) => {
            if (third_column.$data.selected == "Select a node") {
                Materialize.toast("You must select a node", 2000);
                $('.button-form-validate').addClass("disabled");
            } else $('.button-form-validate').removeClass("disabled");
        });

    });
})(jQuery); // end of jQuery name space