//toggle dropdown menu open/close
var toClose = false

function toggle(e) {
  e.stopPropagation();
  var btn=this;
  var menu = btn.nextSibling;
  
  while(menu && menu.nodeType != 1) {
     menu = menu.nextSibling
  }
  if(!menu) return;
  if (menu.style.display !== 'block') {
    menu.style.display = 'block';
    if(toClose) toClose.style.display="none";
    toClose  = menu;
  }  else {
    menu.style.display = 'none';
    toClose=false;
  }

};
function closeAll() {
    toClose.style.display='none';
};

window.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll(".options-node").forEach(function(btn){
     btn.addEventListener("click",toggle,true);
  });
});

window.onclick=function(event){
  if (toClose){
    closeAll.call(event.target);
  }
};