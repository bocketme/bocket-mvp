var third_column = new Vue ({
    el: "#third_column",
    data: {
        selected: "Select a node",
        crumbs: [],
        triple_dots: false,
    },
    methods: {
       selectNode: (node, path) => {
            if (node !== third_column.$data.selected) {
                third_column.$data.selected = node;
                search.$data.content = node;
            }
            if (path !== third_column.$data.crumbs)
                third_column.$data.crumbs = path.split("/");
        },
        selectedNode: (node) => {
            third_column.selected = node;
        },
        selectedPath: (path) => {
            third_column.crumbs = path.split("/");
        },
        newContent: (res) => {
            third_column.content = res;
        },
        createPart: () => {
            var data = new FormData;
            socket.emit("createPart");
        }
    }
});

var locationVue = new Vue ({
    el: "#location",
    data: {
        url: "",
        styleObject: {
            'background-color' : 'blue',
        },
        maturity: "",
        created_on: "",
        modified: "",
        owners: [],
    },
    methods:{
        nodeInformation: (node) => {
            console.log(node);
            locationVue.$data.created_on = moment(node.createdOn).format("MMM Do YYYY");
            locationVue.$data.modified = moment(node.modified).format("MMM Do YYYY");
            locationVue.$data.owners = node.owners;
        },
        maturityInformation: (maturity) => {
            locationVue.$data.maturity = maturity;
            if (maturity == NodeTypeEnum.maturity[0]) {
                locationVue.$data.styleObject = {
                    'background-color' : 'red',
                };
            } else if (maturity == NodeTypeEnum.maturity[1])
            {
                locationVue.$data.styleObject = {
                    'background-color' : 'yellow',
                };
            } else if (maturity == NodeTypeEnum.maturity[2])
            {
                locationVue.$data.styleObject = {
                    'background-color' : 'green',
                };
            }
        }
    }
});

var search = new Vue({
    el: "#search-and-branch",
    data: {
        content: "Select a Node"
    },
    methods: {
        partOrAssembly: (content) => {
            this.$data.content;
        }
    }
})

var contentVue = new Vue ({
    el: "#content",
    data: {
        title: "Select a Node",
        url: "",
        styleObject: {
            'background-color' : 'grey',
        },
        maturity: "",
        users: [],
        organization: "",
        used: "",
        pourcent: "0%",
    },
    methods:{
        partOrAssembly: (partOrAssembly) => {
            this.$data.pourcent = partOrAssembly.pourcent;
            this.$data.used = partOrAssembly.used;
            this.$data.organization = partOrAssembly.organization;
            this.$data.users = partOrAssembly.users;
        },
        maturityInformation: (maturity) => {
            this.$data.maturity = maturity;
            if (maturity == NodeTypeEnum.maturity[0]) {
                this.$data.styleObject = {
                    'background-color' : 'red',
                };
            } else if (maturity == NodeTypeEnum.maturity[1])
            {
                this.$data.styleObject = {
                    'background-color' : 'yellow',
                };
            } else if (maturity == NodeTypeEnum.maturity[2])
            {
                this.$data.styleObject = {
                    'background-color' : 'green',
                };
            }
        }
    }
});