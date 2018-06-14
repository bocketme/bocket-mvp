const defaultNodeValue = "Select a node";

const extensions3d = [
    'blend', 'dae', 'obj', 'stl',
    '3ds', 'fbx', 'dxf', 'lwo',
    'lxo', 'x3d', 'ply', 'ac3d',
    'off', 'step', 'asm', 'prt',
    'sld', 'cgr', 'catia', 'x_t',
];

function getFileExtension(filename = '') {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function parseFormFiles(files) {
    let ret = {
        files3d: [],
        textures: [],
        specs: []
    };

    for (var idx = 0; idx < files.length; idx++) {
        let fileExt = getFileExtension(files[idx].name);
        if (extensions3d.indexOf(fileExt.toLowerCase()) > -1) {
            console.log('is in array', files[idx].name, fileExt);
            ret.files3d.push(files[idx]);
        } else {
            console.log('is not in array', files[idx].name, fileExt);
            ret.specs.push(files[idx]);
        }
    }
    return ret;
}

$('#import-part-files').on('change', (event) => {
    createPartInForm(event);
})

function createPartInForm(event) {
    event.preventDefault();
    console.log('Choosen Module: ' + idOfchoosenNode);
    const cible = headerTitle.title;
    if (cible !== defaultNodeValue.title) {
        const nodeId = idOfchoosenNode;
        const files = parseFormFiles(document.getElementById('import-part-files').files);
        if (files.files3d.length) {

            console.log(files.files3d, files.specs);

            Materialize.toast("Loading File... Please Wait", 2000);

            $("#import-part").modal("close");
            $("#form-import-part").find("input").val("");
        }
    } else
        Materialize.toast("You must select a node", 1000);
}

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
            const formdata = new FormData(form)
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
        /////////////////////////////
        // Search for existing items
        ////////////////////////////
        $('#submit-search-existing').click((event) => {

            //    console.log ("submit-search-existing trigger");
            event.preventDefault();
            var cible = headerTitle.title;

            if (cible !== "Select a node") {
                var nodeId = idOfchoosenNode;
                var form = document.getElementById("form-add-existing");
                //        console.log ("submit-search-existing sur node", nodeId);

                var saisie = document.getElementById('full-text-search').value;
                console.log("submit-search-existing entrée", saisie);

                socket.emit("GetSearchCriteria", nodeId, saisie);



                socket.on("SearchAnswer", function (data) {
                    var nodeId = nodeId;
                    if ($("#form-items-to-add")) {
                        //remove existing search results
                        $("#form-items-to-add").remove();
                        //$("#form-items-to-add").html('');

                    } //add 
                    $("#form-add-existing").append(data);

                });

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
                    let id = $(element).attr('id')
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