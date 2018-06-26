const defaultNodeValue = "Select a node";
(function ($) {
    $(function () {
        $('#submit-edit-part').click(event => {
            event.preventDefault();
            const cible = headerTitle.title;

            if (cible == defaultNodeValue)
                return Materialize.toast("You must select a node", 1000);

            const nodeId = idOfchoosenNode;
            const node = $("#" + nodeId);

            const form = document.getElementById('form-edit-part');
            const formdata = new FormData(form);
            const postRequest = new XMLHttpRequest();

            postRequest.addEventListener('load',
                reqEvent => {
                    if (postRequest.readyState !== postRequest.DONE) return;

                    if (postRequest.status === 200) {
                        $('#' + nodeId + ' > .p-node').contents().last()[0].textContent = postRequest.response;
                        const updateNodeEvent = new CustomEvent('[Viewer] - update', {
                            nodeId
                        });
                        document.dispatchEvent(updateNodeEvent);
                    } else if (postRequest.status === 404) Materialize.toast("Not Found", 1000);
                    else if (postRequest.status === 401) Materialize.toast("The selected node is not a part", 1000);
                });

            postRequest.open('PUT', '/part/update/' + nodeId, true);
            postRequest.send(formdata);
            $("#edit-part").modal("close");
            form.reset();
            $("#form-edit-part").find("input").val("");

        });

        // Submit the insertion of a new part
        $('#submit-import-part').click((event) => {
            event.preventDefault();
            console.log('Choosen Module: ' + idOfchoosenNode);
            const cible = headerTitle.title;
            if (cible !== defaultNodeValue.title) {
                const nodeId = idOfchoosenNode;
                if (document.getElementById('import-part-file3D').files[0]) {
                    var form = document.getElementById("form-import-part");
                    var formdata = new FormData(form);
                    var postRequest = new XMLHttpRequest();
                    var sub_level = $("#" + nodeId).contents().filter("span.p-node").attr("data-sublevel");
                    var breadcrumb = $("#" + nodeId).contents().filter("span.p-node").attr("data-breadcrumbs");
                    // var chips = $('#tags-import-part').material_chip('data');

                    formdata.append("sub_level", sub_level);
                    formdata.append("breadcrumb", breadcrumb);
                    Materialize.toast("Loading File... Please Wait", 2000);
                    postRequest.addEventListener("load", (reqEvent) => {
                        if (postRequest.readyState === postRequest.DONE) {
                            if (postRequest.status === 200) {
                                $('#' + nodeId + '-body').html(postRequest.response);
                                var element = document.querySelectorAll('.three-node');
                                $(element).click(loadNodeInformation);
                                Materialize.toast("File Uploaded Successfully", 1000);
                            } else if (postRequest.status === 404) {
                                Materialize.toast("Not Found", 1000);
                            } else if (postRequest.status === 401) {
                                Materialize.toast("The selected node is not an assembly", 1000);
                            } else if (postRequest.status === 500) {
                                Materialize.toast("Internal Server Error", 1000);
                            }
                        }
                    }, false);

                    postRequest.addEventListener("error", function (event) {
                        Materialize.toast("The Part was not created", 1000);
                    }, false);
                    postRequest.addEventListener("abort", function (event) {
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
            const cible = headerTitle.title;
            if (cible !== "Select a node") {
                const nodeId = idOfchoosenNode,
                    form = document.getElementById("form-import-assembly"),
                    formdata = new FormData(form),
                    postRequest = new XMLHttpRequest(),
                    sub_level = $("#" + nodeId).contents().filter("span").attr("data-sublevel"),
                    breadcrumb = $("#" + nodeId).contents().filter("span").attr("data-breadcrumbs");

                console.log(sub_level);
                console.log(breadcrumb);
                formdata.append("sub_level", sub_level);
                formdata.append("breadcrmb", breadcrumb);

                postRequest.addEventListener("load", (reqEvent) => {
                    if (postRequest.readyState === postRequest.DONE) {
                        if (postRequest.status === 200) {
                            $('#' + nodeId + '-body').html(postRequest.response);
                            var element = document.querySelectorAll('.three-node');
                            $(element).click(loadNodeInformation);
                        } else if (postRequest.status === 404) {
                            Materialize.toast("Not Found", 1000);
                        } else if (postRequest.status === 401) {
                            Materialize.toast("The selected node is not an assembly", 1000);
                        }
                    }
                }, false);
                postRequest.addEventListener("error", function (event) {
                    Materialize.toast("The Part was not created", 1000);
                }, false);
                postRequest.addEventListener("abort", function (event) {
                    Materialize.toast("Network Error - The Part could not be created", 1000);
                }, false);

                postRequest.open('POST', '/assembly/' + nodeId, true);
                postRequest.send(formdata);
                form.reset();
                $("#import-assembly").modal("close");
                $("#form-import-assembly").find("input").val("");
            } else
                Materialize.toast("You must select a node", 1000);
        });

        $('body').on('click', '#submit-add-existing', (event) => {
            event.preventDefault();

            var nodeId = idOfchoosenNode;

            var sub_level = $("#" + nodeId).contents().filter("span.p-node").attr("data-sublevel");
            var breadcrumb = $("#" + nodeId).contents().filter("span.p-node").attr("data-breadcrumbs");

            let dataToSend = [];
            $('.add-existing-checkbox').each((index, element) => {
                if ($(element).is(':checked')) {
                    let id = $(element).attr('id');
                    console.log("checké  :", id);

                    dataToSend.push(id);

                    delete id;
                }
            });
            socket.emit("GetSelectedItemsToAdd", dataToSend, nodeId, breadcrumb, sub_level);

            delete dataToSend;
            $("#add-existing").modal("close");

        });

        $(".edit-part-btn").on("click", () => {
            let editPart = $("#edit-part");
            let content = $("#content");

            editPart.find("#part-name").val(content.find("#content-title").text());
            editPart.find("#part-description").val(content.find("#content-description").text());
        });

        $('#change-pwd-btn').on('click', (e) => {
            const changePassword = $('#change-password');
            changePassword.find('input').val('');
            changePassword.modal('open');
        });

        //////////////////////////////////////////////////////////////////////
        $('.modal-node-selector').click((event) => {
            if (headerTitle.title == "Select a node") {
                Materialize.toast("You must select a node", 2000);
                $('.button-form-validate').addClass("disabled");
            } else $('.button-form-validate').removeClass("disabled");
        });

        $("#form-report-issue").submit(e => {
            e.preventDefault();
            const title = $('#title-issue').val();
            const description = $('#description-issue').val();
            socket.emit('reportIssue', {title, description})
        });


    })
})(jQuery); // end of jQuery name space
