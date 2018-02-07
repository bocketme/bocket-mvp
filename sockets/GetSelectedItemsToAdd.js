const NodeSchema = require('../models/Node');
const Workspace = require('../models/Workspace');
const W = require('../models/User');
let TypeEnum = require('../enum/NodeTypeEnum');
let twig = require('twig');
const mongoose = require("mongoose");
const PartSchema = require('../models/Part');
const AssemblySchema = require('../models/Assembly');
//textSearch = require('mongoose-text-search');

let getSelectedItem = async (selection, nodeId) => {
    console.log("socket server GetSelectedItems", selection);

    let NodeType;
    let name;
    let description;
    let content;
    let subNode;

    try {
        parentNode = await NodeSchema.findById(nodeId);
    } catch (e) {
        console.log("ParentNode :", e);
    };


    console.log("Parent name :", parentNode.name);
    console.log("Parent type :", parentNode.type);

    if (parentNode.type === TypeEnum.part) {
        console.log("The parent node isn't an assemblage :", parentNode.name);
        return;
    }
    //action autorisée
    var idcourant;
    for (var i = 0, l = selection.length; i < l; i++) {
        idcourant = selection[i];
        console.log('------------------------------');
        console.log('IDcourant : ' + idcourant);
        console.log('------------------------------');

        //find assembly

        let fiston
        try {
            fiston = await AssemblySchema.findById(idcourant);
            if (fiston)
                NodeType = TypeEnum.assembly;
        } catch (e) {
            console.log("reccup assy :", e);
        };
        // 0 - Regarder si le noeud parent est un assemblage 
        console.log('------------------------------');
        console.log("fistonAssembly :", fiston);
        console.log('------------------------------');

        if (!fiston) {
            try {
                fiston = await PartSchema.findById(idcourant);
                if (fiston)
                    NodeType = TypeEnum.part;
            } catch (e) {
                console.log("reccup part :", e);
            };
            console.log('------------------------------');
            console.log("fistonPart :", fiston);
            console.log('------------------------------');
        }

        //node creation
        name = fiston.name;
        description = fiston.description;
        content = fiston._id;

        let workspaces = parentNode.workpaces;
        let team = parentNode.team;

        console.log('------------------------------');
        console.log("SubNode name :", name);
        console.log("SubNode desc :", description);
        console.log("SubNode content :", content);
        console.log("SubNode workspaces :", workspaces);
        console.log("SubNode team :", team);

        console.log('------------------------------');

        try {
            subNode = await NodeSchema.create({
                name: name,
                description: description,
                type: NodeType,
                content: content,
                Workspaces: workspaces,
                //tags: tags,
                team: team
            });
        } catch (e) {
            console.log("Node in DB :", e);
        };

        console.log('------------------------------');
        console.log("SubNode :", subNode);
        console.log('------------------------------');

        subNode.save()
            .then((subNode) => {
                parentNode.children.push({
                    _id: subNode._id,
                    type: subNode.type,
                    name: subNode.name,
                });
                parentNode.save()
                    .then((parentNode) => {
                   })
                    .catch(err => {//error Parent Node save
                        console.log("parent Node save err:", err);
                    });

            })
            .catch(err => {//error SubNode save
                console.log("SubNode save err:", err);
            });

    };//end of the loop    
};

module.exports = (socket) => {
    socket.on("GetSelectedItemsToAdd", (selection, nodeId) => {
        getSelectedItem(selection, nodeId)
            .catch((err) => {
                console.log("call getSelectedItem err:", err);
            });
    });//end socket

};//end socket on
