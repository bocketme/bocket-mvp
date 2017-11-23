var pieces = (selector) => {
    console.log(this);
    if($(selector).hasClass('has-child')) {
        $("[href='#assemblyorpart']").html('ASSEMBLY');
        // CHANGE THE CONTENT OF THE ASSEMBLY HERE        
    } else if($(selector).hasClass('no-child')) {
        $("[href='#assemblyorpart']").html('PART')
        // CHANGE THE CONTENT OF THE PART HERE                
    }
};