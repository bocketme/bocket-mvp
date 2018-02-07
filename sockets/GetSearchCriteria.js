const Node = require('../models/Node');
const Workspace = require('../models/Workspace');
const W = require('../models/User');
let TypeEnum = require('../enum/NodeTypeEnum');
let twig = require('twig');
const mongoose = require("mongoose");
const PartSchema = require('../models/Part');
const AssemblySchema = require('../models/Assembly');
//textSearch = require('mongoose-text-search');


module.exports = (socket) => {
    socket.on("GetSearchCriteria", (nodeId,saisie) => {
        console.log("socket server GetSearchCriteria", saisie);
        var currentWorkspace=socket.handshake.session.currentWorkspace;
        //var nodeId=nodeId;
        console.log("nom ID workspace", currentWorkspace);
        Workspace.findById(currentWorkspace)
            .then(w => {
                var Orga = w.organization;
                console.log("Orga name", Orga);
                //search for assembly
                //var SearchAssemblyResults = AssemblySchema.find ({'name': {'$regex': saisie},'description': {'$regex': saisie}, 'ownerOrganization': Orga});
                AssemblySchema.find ({'name': {'$regex': saisie}, 'ownerOrganization': Orga})
                    .then(comms => {

                        comms = comms.map(com => {
                            let _com;
                                _com = com;
                                _com.type = TypeEnum.assembly
                                return _com
                        });

                        PartSchema.find ({'name': {'$regex': saisie}, 'ownerOrganization': Orga})
                        .then(commsPart=>{
                            commsPart = commsPart.map(com => {
                                let _com;
                                _com = com;
                                _com.type = TypeEnum.part
                                return _com
                            });                            
                            //comms.push(commsPart);
                            //console.lownerOrganization.nameog("comms: ", comms);
                            var elements = [...comms, ...commsPart];

                            /*
                            for (var i = 0, l = elements.length; i < l; i++) {
                                let comm = elements[i];
                            
                                //console.log("comm = ",comm);    
                                
                                console.log('------------------------------');
                                console.log('name : ' + comm.name);
                                console.log('description : ' + comm.description);
                                console.log('maturity : ' + comm.maturity);
                                console.log('organization : ' + comm.ownerOrganization.name);
                                console.log('type : ' + comm.type);
                                console.log('ID : ' + comm._id);
                                console.log('------------------------------');
                                
                            }
 */         
                            twig.renderFile('./views/socket/AddExistingSearchAnswer.twig', {
                                elements: elements,
                                TypeEnum:TypeEnum,
                            },
                            (err, retour) => {
                                if (err){
                                    console.log(err);
                                    socket.emit("error mis en twig", err);
                                }
                                else socket.emit("SearchAnswer", retour);
                            
                            })
                        
                        })                 
                        .catch(err=>{//error on search part
                            console.log("search part",err); 
                        }); 
                    })
                    .catch(err=>{//error on search assembly
                    console.log("search assy",err); 
                    });
            })
            .catch(err => {//error on workspace search
            console.log("get workspace", err);
            });

    });//end socket
};//end socket on
