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

var create_part = new Vue({
    el: "#create-part",
    data: {
        description: "",
        part_name: "",
    },
    methods: {
        chargefile : (event) => {
            data_files3D = event.target.files;
            console.log('files charged', data_files3D);
        },
        chargespecFiles : (event) => {
            data_specFiles = event.target.files;
            console.log('files charged', data_specFiles);
        },
        submitPart : () => {
            console.log("je ne comprends pas");

            var form = new FormData();
            // Assemblage des données

            form.append('description', create_part.$data.description)
            form.append('part_name', create_part.$data.part_name)

            if(data_specFiles){
                $.each(data_specFiles, (key, value) => {
                    form.append(key, value);
                });
            }

            $.each(data_files3D, (key, value) => {
                form.append(key, value);
            });

            console.log(form);
            var node_cible = third_column.$data.selected;

            $.post("/node/" + node_cible + "/new_part", $('#form-create-part').serialize(),(data)=>{console.log(data)})
        }
    }
});

var content = new Vue({
    el:'#content',
    data: {
        title: "Not Aviable",
        styleObject: {
            height: '14px',
            width: '14px',
            color: 'grey'
        },
        users: [],
        organization: "Not Aviable",
        used: "Not Aviable",
        pourcent: "0%",
        url: "",
    },
    methods: {

    }
});

var content = new Vue({
    el:'#location',
    data: {
        title: "Not Aviable",
        styleObject: {
            height: '14px',
            width: '14px',
            color: 'grey'
        },
        users: [],
        created: "",
        modified: "",
    },
    methods: {

    }
});