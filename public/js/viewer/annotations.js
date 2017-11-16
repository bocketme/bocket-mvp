/**
 * @desc
 * @param {domElement} renderArea
 * @param {THREE.PerspectiveCamera} camera
 */
var Annotation = function (renderArea, camera) {

/* *************************** Private attributes *************************** */

    var p_renderArea    = renderArea ? renderArea : document.getElementById('renderDiv');
    var p_camera        = camera     ? camera     : null;

    if (!p_camera)
    {
        console.error(new Error('Invalid scene parameter'));
        return;
    }

/* ******************* Functions needed by the ADD method ******************* */

    var createDescDiv = function (name, text) {
        var divToAddTo = $(`div#${name}`);

        $('<div/>', {
            id:     'text',
            text:   `${text}`,
            style:  `display:       block;
                     outline:       0px solid transparent;
                     padding-right: 10px;
                     width:         100%;`
        })
        .attr('contenteditable', 'true')
        .appendTo(divToAddTo);

        var descDiv = $(`div#${name} div:last`);

        if (descDiv[0].textContent === '')
            descDiv.focus();

        descDiv.blur(function() {
            if (descDiv[0].textContent === '' || descDiv[0].textContent === undefined)
                remove(name);
            annotations.forEach(function(element, index) {
                if (element.name === name)
                    if (element.userData.id)
                        modify(element.userData.id);
            });
            send(name);
        });

        descDiv.keydown(function(event) {
            if (event.key === 'Enter')
                event.preventDefault();
        });

        descDiv.keyup(function(event) {
            if (event.key === 'Enter')
                descDiv.blur();
        });
    };

    var createDeleteImg = function (name) {
        var divToAddTo = $(`div#${name}`);

        $('<div/>', {
            style: `display:    block;
                    width:      100%;`
        }).appendTo(divToAddTo);

        $('<img/>', {
            src:    '/img/trashcan.svg',
            style:  `align-item     right;
                     cursor:        pointer;
                     float:         right;
                     height:        10px;
                     padding-left:  5px;
                     width:         10px;`
        })
        .click(function() {
            remove(name);
        })
        .appendTo($(`div#${name} div:first`));
    };

    var createAnnotDiv = function(position, name, text) {
        $('<div/>', {
            id:     name,
            text:   '',
            class:  'annotation',
            style:  `display:   block;
                     left:      ${position.x + 5}px;
                     position:  absolute;
                     top:       ${position.y + 5}px;`
        }).appendTo(p_renderArea);

        createDeleteImg(name);
        createDescDiv(name, text);
    };

    var createAnnotImg = function (position, name) {
        $('<img/>', {
            id:     name,
            src:    '/img/pin.svg',
            style:  `display:   block;
                     height:    24px;
                     left:      ${position.x - 4};
                     position:  absolute;
                     top:       ${position.y - 15};
                     width:     24px;`
        }).appendTo(p_renderArea);

        $(`img#${name}`).click(function() {
            $(`div#${name}`).toggle();
        });
    };

    var toScreenPosition = function(object) {
        var vector     = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld),
            halfWidth  = (renderer.context.canvas.width) / 2,
            halfHeight = (renderer.context.canvas.height) / 2;

        vector.project(camera);

        return ({
            x:  (vector.x * halfWidth)  + halfWidth,
            y: -(vector.y * halfHeight) + halfHeight
        });
    };


/* ***************************** Public Method ****************************** */


    /**
     * @desc
     * @param {THREE.Vector3}   position    The world space position vector of the annotation
     * @param {number}          id          The id of the annotation
     * @param {string}          name        The local name of the annotation
     * @param {string}          text        The content of the annotation
     */
    var add = function (position, object, id, name, text) {
        var annot = new THREE.Points(),
            annot_pos;

        if (!position)
            return;

        name = name ? name : 'annot' + annotations.length;
        text = text ? text : '';
        id   = id   ? id   : 0;

        annot.name                = name;
        annot.userData.id         = id;
        annot.userData.parentName = object.parent.name;
        annot.userData.objectName = object.name;
        annot.position.set(position.x, position.y, position.z);

        createAnnotImg(position, annot.name);
        createAnnotDiv(position, annot.name, text);

        annotations.push(annot);
        object.add(annot);
    };

    /**
     * @desc
     * @param {Number} id The id of the annotation
     */
    var remove = function (id) {
        var mark,
            annot_id,
            annot_name;

        if (id !== undefined && id !== null)
        {
            if (typeof(id) === 'number' || typeof(id) === 'string')
                mark = id;
        }

        annotations.forEach(function (element, index) {
            if (element.userData.id === mark || element.name === mark)
            {
                if (element.userData.id)
                    annot_id = element.userData.id;
                annot_name = element.name;
                annotations.splice(index, 1);
            }
            // id_annot = annotations[index].userData.id;
        });

        $(`img#${annot_name}`).remove();
        $(`div#${annot_name}`).remove();

        if (annot_id)
        {
            $.ajax({
                url:    `/api/annotation/${annot_id}`,
                type:   'DELETE'
            })
            .done(function() {
                console.log('Successfully removed annotation');
            })
            .fail(function() {
                console.error('Failed to remove annotation');
            });
        }
    };

    /**
     * @desc
     * @param {Number} id The id of the annotation
     */
    var modify = function (id) {
        var toSend = {};

        annotations.forEach(function(element, index) {
            if (element.userData.id === id)
            {
                toSend = {
                    content:    $('div#text')[index].textContent,
                    name:       element.name,
                    position:   element.position,
                    meta:       element.userData
                };

                $.ajax({
                    type:   'PUT',
                    url:    `/api/annotation/${id}`,
                    data: {data: JSON.stringify(toSend)}
                })
                .done(function() {
                    console.log('yay');
                })
                .fail(function() {
                    console.log('bad');
                });
            }
            console.log(toSend);
        });
    };

    /**
     * @desc
     * @param {String} name
     */
    var send = function (name) {
        var toSend = {};

        if (annotations.length === 0 || $(`div#${name}`).length === 0)
            return;

        annotations.forEach(function (element, index) {
            if (!(element.userData.id) && element.name === name)
            {
                toSend = {
                    content:    $('div#text')[index].textContent,
                    name:       element.name,
                    position:   element.position,
                    meta:       element.userData
                };
                console.log(toSend);
                $.post(`/api/annotation/${id_node}`, {
                    data: JSON.stringify(toSend)
                })
                .done(function(newId) {
                    element.userData.id = newId.id;
                });
            }
        });
    };

    /**
     * @desc
     * @param {Number} id
     */
    var get = function (id) {
        $.get(`/api/annotation/${id}`)
        .done(function(serv_annots) {
            var temp = [];

            serv_annots.forEach(function (element, index) {
                temp.push(JSON.parse(element.content));
                scene.traverse(function (child) {
                    if (child.name === temp[index].meta.parentName) {
                        child.traverse(function (child) {
                            if (child.name === temp[index].meta.objectName) {
                                annotation.add(temp[index].position, child, temp[index].id, temp[index].name, temp[index].content);
                                return;
                            }
                        });
                        return;
                    }
                });
            });
        })
        .fail(function(err) {
            if (err.status === 404)
            try { throw (new Error('No annotation found')); } catch (error) {}
        })
        .always(function() {
        });
    };

    /**
     * @description
     */
    var update = function () {
        var pos, div, img;

        annotations.forEach(function (element) {
            pos = toScreenPosition(element);
            div = $(`div#${element.name}`)[0];
            img = $(`img#${element.name}`)[0];

            div.style.left  = (pos.x +  5) + 'px';
            div.style.top   = (pos.y +  5) + 'px';
            img.style.left  = (pos.x -  8) + 'px';
            img.style.top   = (pos.y - 23) + 'px';
        });
    };

    this.list = [];

    return ({
        add:        add,
        delete:     remove,
        modify:     modify,
        get:        get,
        update:     update
    });
};

/* ************************************************************************** */

Annotation.prototype.constructor = Annotation;

/* ************************************************************************** */

/**
 * @description
 */
Annotation.prototype.get = function (id_node) {
    if (!id_node || typeof(id_node) !== 'number') {
        console.error(new Error('No or bad id'));
        return;
    }
};

/* ************************************************************************** */

/**
 * @description
 */
Annotation.prototype.add = function (area, point, object, annotData) {

    if (!area   || !(area instanceof HTMLElement)    ||
        !point  || !(point instanceof THREE.Vector3) ||
        !object || !(object instanceof THREE.Mesh)   || !(object instanceof THREE.Group)) {
        console.error(new Error('Bad arguments'));
        return;
    }
};

/* ************************************************************************** */

/**
 * @description
 */
Annotation.prototype.delete = function (id_annotation) {
    if (!id_annotation || typeof(id_annotation) !== 'number') {
        console.error(new Error('No or bad argument'));
        return;
    }
};

/* ************************************************************************** */

/**
 * @description
 */
Annotation.prototype.modify = function (id_annotation) {
    if (!id_annotation || typeof(id_annotation) !== 'number') {
        console.error(new Error('No or bad argument'));
        return;
    }
};

/* ************************************************************************** */

/**
 * @description
 */
Annotation.prototype.update = function () {};