
$(document).ready(() => {
    $('select').material_select();
});

var partIdx = 0 // USED TO DIFFERENTIATE PARTS IN PartsArray;
var fileId = 0; // USED TO DIFFERENTIATE FILES IN PartsArray
var partsArray = []; // USED TO MANAGE PARTS AND FILES BEFORE SENDING THEM TO THE SERVER

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

function nodeChildrenLoad(nodeId, html) {
    if ($(`#${nodeId}`).hasClass('search_child')) {
        const breadcrumbs_value = $(`#${nodeId}`).contents().filter('span.p-node').attr('data-breadcrumbs');
        const sub_level = $(`#${nodeId}`).contents().filter('span.p-node').attr('data-sublevel');
        $(`#${nodeId}`).removeClass('search_child');
        socket.emit('nodeChildren', nodeId, breadcrumbs_value, sub_level);
    } else {
        $(`#${nodeId}-body`).html(html);
    }
}


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

function uploadFileToPart(nodeId, type, partId, file, arrId) {

    var request = new XMLHttpRequest();

    var handleErrorsFct = function(arrId, type, fileId) {
        return function() {
            if(request.readyState === 4) {
                if (request.status === 200) {
                    const res = JSON.parse(request.response);
                    fileUploaded(arrId, type, fileId);
                    checkIfAllUploaded();
                } else if (request.status === 404) {
                    Materialize.toast("Not Found", 1000);
                } else if (request.status === 401) {
                    Materialize.toast("The selected node is not an assembly", 1000);
                } else if (request.status === 400) {
                    console.error('FILE FAILED TO UPLOAAAD', fileId);
                    const res = JSON.parse(request.response);
                    const { nodeId, partId } = res;
                    fileUploadFailed(fileId);
                }
            } else if (request.readyState === 3) {
                $(`${fileId}-file > upload-div`).css('visibility', 'visible');
                $(`${fileId}-file > upload-div > .preloader-wrapper`).show();
                $(`${fileId}-file > upload-div > .reload-btn`).hide();
                $(`${fileId}-file > upload-div > .upload-completed`).hide();
                    console.log('LOADING', idx);
            }
        }
    }

    $(`#${file._id}-upload-div > .reload-btn`).on('click', (event) => {
        uploadFileToPart(nodeId, type, partId, file, arrId);
    });
    request.open('POST', `/part/${nodeId}/${type}/${partId}`, true);
    request.onreadystatechange = handleErrorsFct(arrId, type, file._id);
    var form = new FormData();
    form.append('sentFile', file.file);
    request.send(form);
}

function sendFilesToPart(nodeId, partId, files, arrIdx) {
    if (files) {

        for (let i = 0; i < files.specs.length; i++) {
            uploadFileToPart(nodeId, 'specs', partId, files.specs[i], partsArray[arrIdx]._id);
        }
        for (let i = 0; i < files.textures.length; i++) {
            uploadFileToPart(nodeId, 'textures', partId, files.textures[i], partsArray[arrIdx]._id);
        }
        for (let i = 0; i < files.files3d.length; i++) {
            uploadFileToPart(nodeId, 'files3d', partId, files.files3d[i], partsArray[arrIdx]._id);
        }
    } else {
        console.error('UUUUUH, There are no files there');
    }
}

function fileUploadFailed(idFile) {
    $(`#${idFile}-upload-div`).css('visibility', 'visible');
    $(`#${idFile}-upload-div > .preloader-wrapper`).hide();
    $(`#${idFile}-upload-div > .reload-btn`).show();
    $(`#${idFile}-upload-div > .upload-completed`).hide();
}

function partUploaded(idx) {
    if (idx < partsArray.length) {
        partsArray[idx].isUpload = true;
        const id = partsArray[idx]._id;
        $(`#${id}-close`).prop('disabled', true);
        $(`#${id}_part_name`).prop('disabled', true);
        $(`#${id}_part_description`).prop('disabled', true);
        $(`#add-files-${id}`).prop('disabled', true);
    }
}

function checkIfAllUploaded() {
    for (var i = 0; i < partsArray.length; i++) {
        if (partsArray[i].isUpload) {
            var isUpload = true;
            Object.keys(partsArray[i].files).forEach(function(key) {
                for (let j = 0; j < partsArray[i].files[key].length; j++) {
                    if (partsArray[i].files[key][j].isUpload === false) {
                        isUpload = false;
                    }
                }
            });
            if (isUpload) {
                $(`#${partsArray[i]._id}-part`).remove();
                partsArray.splice(i, 1);
            }
        }
    }
    if (partsArray.length === 0) {
        $('#import-part').modal('close');
    }
}

function fileUploaded(arrId, type, idFile) {
    console.log('PAAAARTS', partsArray, arrId);
    const idx = partsArray.findIndex((elem) => { return elem._id === arrId});
    if (idx === -1) {
        console.log('YA PAS DE PART');
        return ;
    }
    if (type === 'specs') {
        const file = partsArray[idx].files.specs.find((elem) => { return elem._id === idFile });
        file.isUpload = true;
        $(`#${idFile}-close-${partsArray[idx]._id}`).css('visibility', 'hidden');
        $(`#${idFile}-file > .select-spec`).css('visibility', 'hidden');
    } else if (type === 'textures') {
        const file = partsArray[idx].files.textures.find((elem) => { return elem._id === idFile });
        file.isUpload = true;
        $(`#${idFile}-close-${partsArray[idx]._id}`).css('visibility', 'hidden');
        $(`#${idFile}-file > .select-texture`).css('visibility', 'hidden');
    } else if (type === 'files3d'){
        const file = partsArray[idx].files.files3d.find((elem) => { return elem._id === idFile });
        file.isUpload = true;
        $(`#${idFile}-close-${partsArray[idx]._id}`).css('visibility', 'hidden');
        $(`#${idFile}-file > .select-file3d`).css('visibility', 'hidden');
    }
    $(`#${idFile}-upload-div`).css('visibility', 'visible');
    $(`#${idFile}-upload-div > .preloader-wrapper`).hide();
    $(`#${idFile}-upload-div > .reload-btn`).hide();
    $(`#${idFile}-upload-div > .upload-completed`).show();
}

function uploadParts() {
    const cible = headerTitle.title;
    var postRequest = [];
    if (cible !== "Select a node") {
        const nodeId = idOfchoosenNode;
        var sub_level = $("#" + nodeId).contents().filter("span.p-node").attr("data-sublevel");
        var breadcrumb = $("#" + nodeId).contents().filter("span.p-node").attr("data-breadcrumbs");

        var helperFunc=function(arrIndex,itemId) {
            return function() {
                if(postRequest[arrIndex].readyState === 4) {
                    if (postRequest[arrIndex].status === 200) {
                        const res = JSON.parse(postRequest[arrIndex].response);
                        const { nodeId, partId } = res;
                        sendFilesToPart(nodeId, partId, partsArray[arrIndex].files, arrIndex);
                        nodeChildrenLoad(nodeId, res.html);
                        partUploaded(arrIndex);
                    } else if (postRequest[arrIndex].status === 404) {
                        Materialize.toast("Not Found", 1000);
                    } else if (postRequest[arrIndex].status === 401) {
                        Materialize.toast("The selected node is not an assembly", 1000);
                    }
                } else if (postRequest[arrIndex].readyState === 3) {
                    console.log('LOADING');
                }
            }
        }

        for (var i = 0; i < partsArray.length; i++) {

            if (!partsArray[i].isUpload) {
                postRequest[i] = new XMLHttpRequest();
                console.log(postRequest[i], 'REQUEST')
                const partId = partsArray[i]._id;
                postRequest[i].onreadystatechange=helperFunc(i,nodeId);

                postRequest[i].addEventListener("error", function (event) {
                    Materialize.toast("The Part was not created", 1000);
                }, false);
                postRequest[i].addEventListener("abort", function (event) {
                    Materialize.toast("Network Error - The Part could not be created", 1000);
                }, false);

                postRequest[i].open('POST', '/part/' + nodeId, true);
                postRequest[i].setRequestHeader("Content-Type", "application/json");
                const name =  $(`#${partId}_part_name`).val();
                const description = $(`#${partId}_part_description`).val();
                console.log('Outputs: ', name, description);
                postRequest[i].send(JSON.stringify({ name, description, sub_level, breadcrumb }));
            }
        }
    } else {
        Materialize.toast("You must select a node", 1000);

    }
}

$('#import-part-files').on('change', (event) => {
    createPartInForm(event);
});

$('#upload-parts-btn').on('click', (event) => {
    event.preventDefault();
    uploadParts();
    console.log('Je CLick et j\'upload');
});

function handleChangeFile3d(event) {
    const elem = event.target;
    const id = elem.id;
    const fileName = id.substr(0, (elem.id.lastIndexOf('-')));
    const partId = id.substr(elem.id.lastIndexOf('_') + 1);
    const value = event.target.value;
    var idxToChange = -1;
    const part = partsArray.find((element) => { return element._id.toString() === partId });

    if (part.isUpload)
        return;
    if (value === 'specs') {
        idxToChange = part.files.files3d.findIndex((element) => { return element.file.name === fileName;});
        if (idxToChange !== -1) {
            part.files.specs.push(part.files.files3d[idxToChange])
            part.files.files3d.splice(idxToChange, 1);
        } else {
            console.error('COuld not find file');
        }
    } else if (value === 'files3d') {
        idxToChange = part.files.specs.findIndex((element) => { return element.file.name === fileName;});
        if (idxToChange !== -1) {
            part.files.files3d.push(part.files.specs[idxToChange])
            part.files.specs.splice(idxToChange, 1);
        } else {
            console.error('Could not find file');
        }

    }
    handlePartsError();
}

function handleChangeTexture(event) {
    const elem = event.target;
    const id = elem.id;
    const fileName = id.substr(0, (elem.id.lastIndexOf('-')));
    const partId = id.substr(elem.id.lastIndexOf('_') + 1);
    const value = event.target.value;
    var idxToChange = -1;
    const part = partsArray.find((element) => { return element._id.toString() === partId });

    if (part.isUpload)
        return;
    if (value === 'specs') {
        console.log(part.files);
        idxToChange = part.files.textures.findIndex((element) => { return element.file.name === fileName;});
        if (idxToChange !== -1) {
            part.files.specs.push(part.files.textures[idxToChange])
            part.files.textures.splice(idxToChange, 1);
        } else {
            console.error('Could not find file');
        }

    } else if (value === 'textures') {
        idxToChange = part.files.specs.findIndex((element) => { return element.file.name === fileName;});
        if (idxToChange !== -1) {
            part.files.textures.push(part.files.specs[idxToChange])
            part.files.specs.splice(idxToChange, 1);
        } else {
            console.error('Could not find file');
        }
    }
    handlePartsError();
}

function appendFileToList(idPart, file, fileType) {
    if (fileType === 'file3d') {
        return `<li id="${fileId}-file" class="file_list_item row file3d" >` +
            `                    <a id="${fileId}-close-${idPart}" class="material-icons close-files col s1">close</a>` +
            `                    <span class="part_file_name col s3">${file.name}</span>` +
            `                    <span class="${idPart}-file3d-error col s5" ></span>` +
            '                    <div class="input-field col s2 select-file3d">' +
            `                        <select id="${file.name}-${fileId}_${idPart}" onchange="handleChangeFile3d(event)">` +
            '                            <option value="files3d" selected>3d file</option>' +
            '                            <option value="specs">Spec file</option>' +
            '                        </select>' +
            '                    </div>' +
            `                    <div id="${fileId}-upload-div" class="upload-div col s1">` +
            '                       <div class="upload-completed"><i class="material-icons">check</i></div>\n' +
            '                       <div class="preloader-wrapper small active">' +
            '                       <div class="spinner-layer spinner-blue-only">' +
            '                       <div class="circle-clipper left">' +
            '                       <div class="circle"></div>' +
            '                           </div><div class="gap-patch">' +
            '                           <div class="circle"></div>' +
            '                           </div><div class="circle-clipper right">' +
            '                               <div class="circle"></div>' +
            '                               </div>' +
            '                           </div>' +
            '                       </div>' +
            '                       <a class="reload-btn material-icons">cached</a>' +
            '                   </div>' +
            '                </li>'
    } else if (fileType === 'textures') {
        return `                <li id="${fileId}-file" class="file_list_item row texture" >` +
            `                    <a id="${fileId}-close-${idPart}" class="material-icons close-files col s1">close</a>` +
            `                    <span class="part_file_name col s3">${file.name}</span>` +
            `                    <span class="${idPart}-texture-error col s5" ></span>` +
            '                    <div class="input-field col s2 select-texture">' +
            `                        <select id="${file.name}-${fileId}_${idPart}" onchange="handleChangeTexture(event)">` +
            '                            <option value="textures" selected>Texture file</option>' +
            '                            <option value="specs">Spec file</option>' +
            '                        </select>' +
            '                    </div>' +
            `                    <div id="${fileId}-upload-div" class="upload-div col s1">` +
            '                       <div class="upload-completed"><i class="material-icons">check</i></div>' +
            '                       <div class="preloader-wrapper small active">' +
            '                       <div class="spinner-layer spinner-blue-only">' +
            '                       <div class="circle-clipper left">' +
            '                       <div class="circle"></div>' +
            '                           </div><div class="gap-patch">' +
            '                           <div class="circle"></div>' +
            '                           </div><div class="circle-clipper right">' +
            '                               <div class="circle"></div>' +
            '                               </div>' +
            '                           </div>' +
            '                       </div>' +
            '                       <a class="reload-btn material-icons ">cached</a>' +
            '                   </div>' +
            '                </li>'
    } else {
        return `<li id="${fileId}-file" class="file_list_item row texture">` +
            `                    <a id="${fileId}-close-${idPart}" class="material-icons close-files col s1">close</a>` +
            `                    <span class="part_file_name col s3">${file.name}</span>` +
            `                    <span class="${idPart}-specs-error col s5" ></span>` +
            '                    <div class="input-field col s2 select-spec">' +
            `                        <select id="${file.name}-${fileId}_${idPart}" disabled>` +
            '                            <option value="specs" disabled selected>Spec file</option>' +
            '                        </select>' +
            '                    </div>' +
            `                    <div id="${fileId}-upload-div" class="upload-div col s1">` +
            '                       <div class="upload-completed"><i class="material-icons">check</i></div>' +
            '                       <div class="preloader-wrapper small active">' +
            '                       <div class="spinner-layer spinner-blue-only">' +
            '                       <div class="circle-clipper left">' +
            '                       <div class="circle"></div>' +
            '                           </div><div class="gap-patch">' +
            '                           <div class="circle"></div>' +
            '                           </div><div class="circle-clipper right">' +
            '                               <div class="circle"></div>' +
            '                               </div>' +
            '                           </div>' +
            '                       </div>' +
            '                       <a class="reload-btn material-icons ">cached</a>' +
            '                   </div>' +
            '                </li>'
    }

}

function handlePartsError() {
    var isEnabled = true;
    for (var i = 0; i < partsArray.length; i++) {
        var idx = partsArray[i]._id;
        var files = partsArray[i].files;
        $(`#${idx}-part`).removeClass('red lighten-2');
        if (files.files3d.length === 0) {

            $(`#${idx}-error`).text('Error: You must import at least 1 3d file');
            isEnabled = false;
            $(`#${idx}-part`).addClass('red lighten-2')
        } else if (files.files3d.length > 1) {
            $(`.${idx}-file3d-error`).text('Error: You must have only 1 3d file by part');
            isEnabled = false;
            $(`#${idx}-part`).addClass('red lighten-2')
        } else {
            $(`#${idx}-error`).text('');
            $(`.${idx}-file3d-error`).text('');
        }
    }
    if (!isEnabled) {
        $('#upload-parts-btn').addClass('disabled');
    } else {
        $('#upload-parts-btn').removeClass('disabled');
    }
}

function addPartInModalList(files) {
    if (files) {
        const html = `<li id="${partIdx}-part" class="collection-item">` +
            '             <div class="row">' +
            `             <a id="${partIdx}-close" class="material-icons close-files col s1">close</a>` +
            '                 <div class="input-field col s6">' +
            (files.files3d.length ? `<input id="${partIdx}_part_name" type="text" class="validate part_name" value="${getFileName(files.files3d[0].name)}">` : `<input id="${partIdx}_part_name" type="text" class="validate part_name" value="">`) +
            '                 </div>' +
            `                 <span id="${partIdx}-error" class="part-error col s4"></span>` +
            '                 <div class="input-field col s12">' +
            `                     <textarea id="${partIdx}_part_description" class="materialize-textarea"></textarea>` +
            '                     <label for="part_description">Description</label>' +
            '                 </div>' +
            `                 <ul id="${partIdx}_files_list">` +
            '                 </ul>' +
            '                 <div class="btn btn-normal file-field input-field col s4">' +
            '                     <span>Add files</span>' +
            `                     <input id="add-files-${partIdx}" type="file" multiple name="partFiles">` +
            '                 </div>' +
            '             </div>' +
            '        </li>';

        $('#parts_list').append(html);


        $(`#add-files-${partIdx}`).on('change', (event) => {
            const elem = event.target;
            const idElem = elem.id;
            const idPart = idElem.slice(idElem.lastIndexOf('-') + 1);
            const files = parseFormFiles(document.getElementById(idElem).files);
            console.log('J\'ai add a file', idPart, files);
            linkFilesToList(Number(idPart), files);
            handlePartsError();
        });

        $(`#${partIdx}-close`).on('click', (event) => {
            removePart(event);
        });

        partsArray.push({
            _id: partIdx,
            isUpload: false,
            files: {
              files3d: [],
              textures: [],
              specs: []
            }
        }) // Keeps the files for the sending of datas
        linkFilesToList(partIdx, files);
        handlePartsError();
        partIdx++;
    } else {
        console.error('Could not load files');
    }
}

function removePart(event) {
    const id = event.target.id;
    const partId = id.slice(0, id.indexOf('-'));
    const idx = partsArray.findIndex((element) => { return element._id.toString() === partId });
    partsArray.splice(idx, 1);
    $(`#${partId}-part`).remove();
    console.log('After Remove', partsArray);
    handlePartsError();
}

function removeFile(event) {
    const id = event.target.id;
    const idFile = id.slice(0, id.indexOf('-'));
    const idPart = id.slice(id.lastIndexOf('-') + 1);
    const filename = $(`#${idFile}-file span.part_file_name`).text();
    const part = partsArray.find((element) => { return element._id.toString() === idPart });
    var idx = part.files.files3d.findIndex((element) => { return element._id === Number(idFile) });
    if (idx !== -1 && !part.files.files3d[idx].isUpload) {
        console.log('TROUVEEE');
        part.files.files3d.splice(idx, 1);
        $(`#${idFile}-file`).remove();
        handlePartsError();
        return;
    }
    idx = part.files.textures.findIndex((element) => { return element._id === Number(idFile) });
    if (idx !== -1 && !part.files.textures[idx].isUpload) {
        console.log('TROUVEEE');
        part.files.textures.splice(idx, 1);
        $(`#${idFile}-file`).remove();
        handlePartsError();
        return;
    }
    idx = part.files.specs.findIndex((element) => { return element._id === Number(idFile) });
    if (idx !== -1 && !part.files.specs[idx].isUpload) {
        part.files.specs.splice(idx, 1);
        $(`#${idFile}-file`).remove();
        handlePartsError();
        console.log('TROUVEEE');
        return;
    }
}

function addFileToPart(idPart, file, idFile, type) {
    console.log(typeof idPart, idPart);
    const part = partsArray.find((element) => { return element._id === idPart });
    if (type === "file3d") {
        part.files.files3d.push({ _id: idFile, isUpload: false, file })
    } else if (type === "texture") {
        part.files.textures.push({ _id: idFile, isUpload: false, file })
    } else {
        part.files.specs.push({ _id: idFile, isUpload: false, file })
    }
}

function linkFilesToList(idPart, files) {
    for (var idx = 0; idx < files.files3d.length; idx++) {
        $(`#${idPart}_files_list`).append(appendFileToList(idPart, files.files3d[idx], 'file3d'));
        addFileToPart(idPart, files.files3d[idx], fileId,'file3d');
        $(`#${fileId}-upload-div`).css('visibility', 'hidden');

        $(`#${fileId}-close-${idPart}`).on('click', (event) => {
            removeFile(event);
        });

        fileId++;
    }
    for (var idx = 0; idx < files.textures.length; idx++) {
        $(`#${idPart}_files_list`).append(appendFileToList(idPart, files.textures[idx], 'textures'));
        addFileToPart(idPart, files.textures[idx], fileId,'texture');
        $(`#${fileId}-upload-div`).css('visibility', 'hidden');

        $(`#${fileId}-close-${idPart}`).on('click', (event) => {
            removeFile(event);
        });

        fileId++;
    }
    for (var idx = 0; idx < files.specs.length; idx++) {
        $(`#${idPart}_files_list`).append(appendFileToList(idPart, files.specs[idx], 'specs'));
        addFileToPart(idPart, files.specs[idx], fileId,'spec');
        $(`#${fileId}-upload-div`).css('visibility', 'hidden');


        $(`#${fileId}-close-${idPart}`).on('click', (event) => {
            removeFile(event);
        });

        fileId++;
    }
    $('select').material_select();
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