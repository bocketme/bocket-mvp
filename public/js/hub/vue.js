var breadcrumb = new Vue ({
    el: "#node-header",
    data: {
        selected: "Select a node",
        crumbs: []
    },
    methods: {
        /**
        * Load the node in the front
        * @param {String} node 
        * @param {String} path 
        */
        node_selected: (node, path) => {
            this.selected = node;
            this.crumbs = path.split("/");
        }
    }
});

var content = new Vue({
    el: '#content',
    data: {
        value: "To see the information, please charge a node"
    },
    method:{
        loading: () => {
            this.data.value = '<div class="preloader-wrapper big active">'
            + '<div class="spinner-layer spinner-blue-only">'
            + '<div class="circle-clipper left">'
            + '<div class="circle"></div>'
            + '</div><div class="gap-patch">'
            + '<div class="circle"></div>'
            + '</div><div class="circle-clipper right">'
            + '<div class="circle"></div>'
            + '</div>'
            + '</div>'
            + '</div>'
        },
        new_data: (res) => {
            this.data.value = res;
        }
    }
});

var node_tabs = new Vue({
    el:'',
    data: {
        
    },
    method: {
        
    }
});

var assembly_tabs = new Vue({
    
});

var files_tabs = new Vue({
    
});

var dashboard_tabs = new Vue({
    
});
