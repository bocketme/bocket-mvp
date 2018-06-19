
$(document).ready(() => {
    $('select').material_select();
});

var partIdx = 0;
var partsArray = [];

const defaultNodeValue = "Select a node";

const extensions3d = [
    'dae', 'obj', 'stl',
    '3ds', 'fbx', 'lwo',
    'lxo', 'x3d', 'off',
];

const extensionsTextures = [
    'bmp', 'gif', 'jpg', 'jpeg',
    'png', 'tga', 'tif', 'mtl',
]

function getFileExtension(filename = '') {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function getFileName(filename = '') {
    return filename.slice(0, filename.lastIndexOf("."));
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
            ret.files3d.push(files[idx]);
        } else if (extensionsTextures.indexOf(fileExt.toLowerCase()) > -1) {
            ret.textures.push(files[idx]);
        } else {
            ret.specs.push(files[idx]);
        }
    }
    return ret;
}

$('#import-part-files').on('change', (event) => {
    createPartInForm(event);
})

function appendFileToList(file, fileType) {
    if (fileType === 'file3d') {
        return '                <li class="file_list_item row" >' +
            '                    <a class="material-icons col s1">close</a>' +
            `                    <span class="part_file_name col s3">${file.name}</span>` +
            `                    <span class="${partIdx}-file3d-error col s6" ></span>` +
            '                    <div class="input-field col s2">' +
            '                        <select>' +
            '                            <option value="files3d" selected>3d file</option>' +
            '                            <option value="specs">Spec file</option>' +
            '                        </select>' +
            '                    </div>' +
            '                </li>'
    } else if (fileType === 'textures') {
        return '                <li class="file_list_item row" >' +
            '                    <a class="material-icons col s1">close</a>' +
            `                    <span class="part_file_name col s3">${file.name}</span>` +
            `                    <span class="${partIdx}-texture-error col s6" ></span>` +
            '                    <div class="input-field col s2">' +
            '                        <select>' +
            '                            <option value="textures" selected>Texture file</option>' +
            '                            <option value="specs">Spec file</option>' +
            '                        </select>' +
            '                    </div>' +
            '                </li>'
    } else {
        return '                <li class="file_list_item row">' +
            '                    <a class="material-icons col s1">close</a>' +
            `                    <span class="part_file_name col s3">${file.name}</span>` +
            `                    <span class="${partIdx}-specs-error col s6" ></span>` +
            '                    <div class="input-field col s2">' +
            '                        <select disabled>' +
            '                            <option value="specs" disabled selected>Spec file</option>' +
            '                        </select>' +
            '                    </div>' +
            '                </li>'
    }

}

function handlePartError(files) {
    if (files.files3d.length === 0) {
        $(`#${partIdx}-error`).text('Error: You must import at least 1 3d file');
    } else if (files.files3d.length > 1) {
        $(`.${partIdx}-file3d-error`).text('Error: You must have only 1 3d file by part');
    } else {
        console.log('CA MARCHE PASSS');
    }
}

function addPartInModalList(files) {
    console.log(files);
    if (files) {
        const html = `<li id="${partIdx}-part" class="collection-item">` +
            '             <div class="row">' +
            '                 <div class="input-field col s6">' +
            (files.files3d.length ? `<input id="part_name" type="text" class="validate" value="${getFileName(files.files3d[0].name)}">` : `<input id="part_name" type="text" class="validate" value="">`) +
            '                 </div>' +
            `                 <span id="${partIdx}-error" class="part-error col s6"></span>` +
            '                 <div class="input-field col s12">' +
            '                     <textarea id="part_description" class="materialize-textarea"></textarea>' +
            '                     <label for="part_description">Description</label>' +
            '                 </div>' +
            `                 <ul id="${partIdx}_files_list">` +
            '                 </ul>' +
            '             </div>' +
            '        </li>';

        $('#parts_list').append(html);

        for (var idx = 0; idx < files.files3d.length; idx++) {
            $(`#${partIdx}_files_list`).append(appendFileToList(files.files3d[idx], 'file3d'));
        }
        for (var idx = 0; idx < files.textures.length; idx++) {
            $(`#${partIdx}_files_list`).append(appendFileToList(files.textures[idx], 'textures'));
        }
        for (var idx = 0; idx < files.specs.length; idx++) {
            $(`#${partIdx}_files_list`).append(appendFileToList(files.specs[idx], 'specs'));
        }
        $('select').material_select();
        console.log(partIdx);
        handlePartError(files);

        partsArray.push({ _id: partIdx, files }) // Keeps the files for te sending of datas
        partIdx++;
    } else {
        console.error('Could not load files');
    }
}

function createPartInForm(event) {
    event.preventDefault();
    console.log('Choosen Module: ' + idOfchoosenNode);
    const cible = headerTitle.title;
    if (cible !== defaultNodeValue.title) {
        const nodeId = idOfchoosenNode;
        const files = parseFormFiles(document.getElementById('import-part-files').files);
        addPartInModalList(files);
        if (files.files3d.length) {
            if (files.files3d.length !== 1) {
                Materialize.toast("You can't have more than one 3d file", 1000);
            }
            Materialize.toast("Loading File... Please Wait", 2000);

            // $("#import-part").modal("close");
            // $("#form-import-part").find("input").val("");
        }
    } else {
        Materialize.toast("You must select a node", 1000);
    }
    console.log('PART ARRAY', partsArray);
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