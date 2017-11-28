(function ($) {
    $(function () {
        $('#submit-create-new-node').click((event) => {
            event.preventDefault();
            var cible = third_column.$data.selected;
            let form = document.querySelector("#form-create-new-node");       
            if(cible !== "Select a node"){
                
                let formData =  new FormData(form);
                var request = new XMLHttpRequest();
                
                let chips = $('#tags-new-node').material_chip('data');
                if(chips.length !== 0){
                    formData.append('tags', JSON.stringify(chips));                    
                }
                
                formData.append("workspaceId", workspaceId);
                request.open("POST", "/node/child/" +cible, true);
                request.onload = function(oEvent) {
                    if (request.status == 200) {
                        console.log("Uploaded!");
                    } else {
                        console.log("Error " + request.status + " occurred when trying to upload your file.<br \/>");
                    }
                };
                request.send(formData);
            }
            else {
                Materialize.toast('I am a toast!', 4000);
            }    
        });
        
        $('').click(() => {
            $.post();    
        });
        
        $('').click(() => {
            $.post();    
        });
        
        $('').click(() => {
            $.post();    
        });
    });
})(jQuery); // end of jQuery name space
