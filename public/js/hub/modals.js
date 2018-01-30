function makerProductStructure(name, type, sub_level, breadcrumbs,){
 
    var childStructure = document.createElement('div');
 
    var ulVrapper = document.createElement('ul'),
        liVrapper = document.createElement('li'),
        divHeader = document.createElement('div'),
        divBody = document.createElement('div'),
        iconNode = document.createElement('img'),
        iconStatus = document.createElement('img'),
        iconMaterialize = document.createElement('img'),
        spanInformation = document.createElement('span'),
        spanVrapper = document.createElement('span'),
        nameNode = document.createTextNode(name);
 
    ulVrapper.classList.add("collapsible");
    ulVrapper.setAttribute("data-collapsble" , "accordion");
 
    childStructure.classList.add("row");
    childStructure.classList.add("colla");
    divHeader.classList.add("collapsible-header");
    divHeader.classList.add("three-node");
    divHeader.classList.add("valign-wrapper");
 
    divBody.classList.add('collapsible-body');
    divBody.classList.add('container');
    divBody.classList.add('valign-wrapper');
 
    iconNode.classList.add("material-icons");
    iconStatus.setAttribute("id", "status-node");
 
    spanInformation.classList.add("p-node");
 
 
    sub_level++;
    spanInformation.setAttribute("data-breadcrumbs", breadcrumbs);
    spanInformation.setAttribute("data-sublevel", sub_level);
    spanInformation.appendChild(nameNode);
 
    if (type == NodeTypeEnum.assembly){
        spanInformation.setAttribute("data-node", type);
 
        iconNode.setAttribute("src", "/img/07-Assembly icon.svg");
 
        spanVrapper.setAttribute("style", "padding-left:"+(sub_level * 20)+"px");
 
        divHeader.appendChild(spanVrapper);
        divHeader.appendChild(iconMaterialize);
        divHeader.appendChild(iconNode);
        divHeader.appendChild(spanInformation);
 
        liVrapper.appendChild(divHeader);
        liVrapper.appendChild(divBody);