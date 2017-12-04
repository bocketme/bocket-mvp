var second_collumn = new Vue ({
    el: "#second_column_content",
    data: {
        content: "Select a Node to see more information",
    },
    methods:{
        loadingNewContent: () => {
            return this.content = '<div class="preloader-wrapper big active">'
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
    }
});

var third_column = new Vue ({
    el: "#third_column",
    data: {
        selected: "Select a node",
        crumbs: [],
        triple_dots: false,
    },
    methods: {
       selectNode: (node, path) => {
            if (node !== third_column.$data.selected)
                third_column.$data.selected = node;
            if (path !== third_column.$data.crumbs)
                third_column.$data.crumbs = path.split("/");
        },
        selectedNode: (node) => {
            this.selected = node;
        },
        selectedPath: (path) => {
            this.crumbs = path.split("/");
        },
        newContent: (res) => {
            this.content = res;
        },
        createPart: () => {
            var data = new FormData;
            socket.emit("createPart");
        }
    }
});
var data_specFiles;
var data_files3D;