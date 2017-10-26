const connection = require('./index');

/**
 * User table creation
 */
connection.query("CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) not null, firstname varchar(255) not null, lastname varchar(255) not null, email varchar(255) not null, password varchar(255) not null, active bool default 1, company varchar(255), createdat varchar(255) not null );", (err) => {
    if (err) console.log("user : ", err.sqlMessage);
    else console.log('Table user successfully created');
});

/**
 * Node table creation
 */
connection.query("CREATE TABLE node (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) not null, path VARCHAR(255) not null, state_of_maturity int not null, is_intermediary BOOLEAN not null DEFAULT 0, node_parent int, id_branch int not null, id_files3d int);", (err) => {
    if (err) console.log("node : ", err.sqlMessage);
    else console.log('Table node successfully created');
});

/**
 * Branch table creation
 */
connection.query("CREATE TABLE branch (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) not null, id_first_node int, id_base_node int, id_project int not null);", (err) => {
    if (err) console.log("branch : ", err.sqlMessage);
    else console.log('Table branch successfully created');
});

/**
 * Pull_request table creation
 */
connection.query("CREATE TABLE pull_request (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) not null, content TEXT, branch_source int not null, branch_destination int not null, id_project int not null)", (err) => {
    if (err) console.log("pull_request : ", err.sqlMessage);
    else console.log('Table pull_request successfully created');
});

/**
 * Comments table creation
 */
connection.query("CREATE TABLE comments (id INT AUTO_INCREMENT PRIMARY KEY, content MEDIUMTEXT not null, date_of_publish date not null, id_author int not null, id_issue int, id_files3d int, id_specfile int, id_branch int, id_pull_request int, id_node int );", (err) => {
    if (err) console.log("comments : ", err.sqlMessage);
    else console.log('Table comments successfully created');
});

/**
 * SpecFile table creation
 */
connection.query("CREATE TABLE specfile (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) not null, id_node int not null );", (err) => {
    if (err) console.log("specfile : ", err.sqlMessage);
    else console.log('Table specfile successfully created');
});

/**
 * Files3D table creation
 */
connection.query("CREATE TABLE files3d (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) not null, uuid VARCHAR(255) not null);", (err) => {
    if (err) console.log("files3d : ", err.sqlMessage);
    else console.log('Table files3d successfully created');
});

/**
 * Project table creation
 */
connection.query("CREATE TABLE project (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) not null, description text, path VARCHAR(255) not null, id_organization int, id_team int not null, id_master_branch int);", (err) => {
    if (err) console.log("project : ", err.sqlMessage);
    else console.log('Table project successfully created');
});

/**
 * Team table creation
 */
connection.query("CREATE TABLE team (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) not null);", (err) => {
    if (err) console.log("team : ", err.sqlMessage);
    else console.log('Table team successfully created');
});

/**
 * Notifications table creation
 */
connection.query("CREATE TABLE notifications (id INT AUTO_INCREMENT PRIMARY KEY,message text, url mediumtext, is_read bool not null DEFAULT 0, id_user int not null );", (err) => {
    if (err) console.log("notifications : ", err.sqlMessage);
    else console.log('Table notifications successfully created');
});

/**
 * Right table creation
 */
connection.query("CREATE TABLE rights (id INT AUTO_INCREMENT PRIMARY KEY, administration BOOLEAN not null, id_affectation int not null, id_node int not null );", (err) => {
    if (err) console.log("rights : ", err.sqlMessage);
    else console.log('Table rights successfully created');
});

/**
 * Rights file table creation
 */
connection.query("CREATE TABLE rights_file (id INT AUTO_INCREMENT PRIMARY KEY, read_right BOOLEAN not null, write_right BOOLEAN not null, id_affectation int not null, id_specfile int, id_files3d int, id_node int not null );", (err) => {
    if (err) console.log("rights_file : ", err.sqlMessage);
    else console.log('Table rights_file successfully created');
});

/**
 * Affectation table creation
 */
connection.query("CREATE TABLE affectation (id INT AUTO_INCREMENT PRIMARY KEY, id_user int not null, id_team int not null, owner_team bool not null DEFAULT 0);", (err) => {
    if (err) console.log("rights : ", err.sqlMessage);
    else console.log('Table rights successfully created');
});

/**
 * Tag table creation
 */
connection.query("CREATE TABLE tag (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) not null, color varchar(255) not null, id_node int not null );", (err) => {
    if (err) console.log("tags : ", err.sqlMessage);
    else console.log('Table tags successfully created');
});

/**

 * SSH_Keys
 */
connection.query("CREATE TABLE ssh_key (id INT AUTO_INCREMENT PRIMARY KEY, content text not null);", (err) => {
    if (err) console.log("ssh_keys : ", err.sqlMessage);
    else console.log('Table ssh_keys successfully created');
});
/*
 * Organization table creation
 */
connection.query("CREATE TABLE organization (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) not null, id_owner int not null);", (err) => {
    if (err) console.log("tags : ", err.sqlMessage);
    else console.log('Table tags organization successfully created');
});

/**
 * Stripe table creation
 */
connection.query("CREATE TABLE stripe (id INT AUTO_INCREMENT PRIMARY KEY, id_transaction VARCHAR(255) not null, id_organization int not null, is_valid bool not null);", (err) => {
    if (err) console.log("stripe : ", err.sqlMessage);
    else console.log('Table stripe successfully created');
});

/**
 * Issue table creation
 */
connection.query("CREATE TABLE issue (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) not null, content text, is_resolved bool not null DEFAULT 0, id_project int not null);", (err) => {
    if (err) console.log("issue : ", err.sqlMessage);
    else console.log('Table issue successfully created');
});

/**
 * Annotation table creation
 */
connection.query("CREATE TABLE annotation (id INT AUTO_INCREMENT PRIMARY KEY, content TEXT not null, id_files3d int not null);", (err) => {
    if (err) console.log("annotation : ", err.sqlMessage);
    else console.log('Table annotation successfully created');
});

/**
 * FOREIGN KEYS queries
 *
 * ALTER TABLE Orders
 * ADD CONSTRAINT FK_PersonOrder
 * FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
 */


/*


setTimeout(() => {

    connection.query("ALTER TABLE pull_request add constraint FK_pull_request_branch_source foreign key (branch_source) references branch(id);", (err) => {
        if (err) console.log("FK_pull_request_branch_source : ", err.sqlMessage);
        else console.log('Table FK_pull_request_branch_source successfully created');
    });

    connection.query("ALTER TABLE pull_request add constraint FK_pull_request_branch_destination foreign key (branch_destination) references branch(id);", (err) => {
        if (err) console.log("FK_pull_request_branch_destination : ", err.sqlMessage);
        else console.log('Table FK_pull_request_branch_destination successfully created');
    });

    connection.query("ALTER TABLE annotation add constraint FK_annotation_user foreign key (id_user) references user(id)", (err) => {
        if (err) console.log("FK_annotation_user : ", err.sqlMessage);
        else console.log('Foreign key FK_annotation_user added');
    });

    connection.query("ALTER TABLE comment add constraint FK_CommentPullRequest foreign key (id_pull_request) references pull_request(id);", (err) => {
        if (err) console.log("FK_CommentPullRequest : ", err.sqlMessage);
        else console.log('Foreign key FK_CommentPullRequest added');
    });

    connection.query("ALTER TABLE organization add constraint FK_OrganizationOwnerUser foreign key (id_owner) references user(id);", (err) => {
        if (err) console.log("FK_OrganizationOwnerUser : ", err.sqlMessage);
        else console.log('Foreign key FK_OrganizationOwnerUser added');
    });

    connection.query("ALTER TABLE team add constraint FK_TeamOwnerUser foreign key (id_owner) references user(id);", (err) => {
        if (err) console.log("FK_TeamOwnerUser : ", err.sqlMessage);
        else console.log('Foreign key FK_TeamOwnerUser added');
    });

    connection.query("ALTER TABLE notifications add constraint FK_UserNotification foreign key (id_user) references user(id);", (err) => {
        if (err) console.log("FK_UserNotification : ", err.sqlMessage);
        else console.log('Foreign key FK_UserNotification added');
    });

    connection.query("ALTER TABLE rights add constraint FK_RightsNode foreign key (id_node) references node(id);", (err) => {
        if (err) console.log("FK_RightsUser : ", err.sqlMessage);
        else console.log('Foreign key FK_RightsUser added');
    });

    connection.query("ALTER TABLE rights add constraint FK_RightsAffectation foreign key (id_affectation) references affectation(id);", (err) => {
        if (err) console.log("FK_RightsAffectation : ", err.sqlMessage);
        else console.log('Foreign key FK_RightsAffectation added');
    });

    connection.query("ALTER TABLE rights_file add constraint FK_RightsSpecFile foreign key (id_specfile) references specfile(id);", (err) => {
        if (err) console.log("FK_RightsSpecFile : ", err.sqlMessage);
        else console.log('Foreign key FK_RightsSpecFile added');
    });

    connection.query("ALTER TABLE rights_file add constraint FK_Rightsfiles3d foreign key (id_files3d) references files3d(id);", (err) => {
        if (err) console.log("FK_Rightsfiles3d : ", err.sqlMessage);
        else console.log('Foreign key FK_Rightsfiles3d added');
    });

    connection.query("ALTER TABLE rights_file add constraint FK_RightsAffectation foreign key (id_affectation) references affectation(id);", (err) => {
        if (err) console.log("FK_RightsAffectation : ", err.sqlMessage);
        else console.log('Foreign key FK_RightsAffectation added');
    });

    connection.query("ALTER TABLE project add constraint FK_TeamProject foreign key (id_team) references team(id);", (err) => {
        if (err) console.log("FK_TeamProject : ", err.sqlMessage);
        else console.log('Foreign key FK_TeamProject added');
    });

    connection.query("ALTER TABLE project add constraint FK_ProjectNode foreign key (id_first_node) references node(id);", (err) => {
        if (err) console.log("FK_ProjectNode : ", err.sqlMessage);
        else console.log('Foreign key FK_ProjectNode added');
    });

    connection.query("ALTER TABLE project add constraint FK_ProjectOrganization foreign key (id_organization) references organization(id);", (err) => {
        if (err) console.log("FK_ProjectOrganization : ", err.sqlMessage);
        else console.log('Foreign key FK_ProjectOrganization added');
    });

    connection.query("ALTER TABLE comments add constraint FK_UserComments foreign key (id_author) references user(id);", (err) => {
        if (err) console.log("FK_UserComments : ", err.sqlMessage);
        else console.log('Foreign key FK_UserComments added');
    });

    connection.query("ALTER TABLE comments add constraint FK_Files3dComments foreign key (id_files3d) references files3d(id);", (err) => {
        if (err) console.log("FK_Files3dComments : ", err.sqlMessage);
        else console.log('Foreign key FK_Files3dComments added');
    });

    connection.query("ALTER TABLE comments add constraint FK_IssueComments foreign key (id_issue) references issue(id);", (err) => {
        if (err) console.log("FK_IssueComments : ", err.sqlMessage);
        else console.log('Foreign key FK_IssueComments added');
    });

    connection.query("ALTER TABLE comments add constraint FK_SpecfileComments foreign key (id_specfile) references specfile(id);", (err) => {
        if (err) console.log("FK_SpecfileComments : ", err.sqlMessage);
        else console.log('Foreign key FK_SpecfileComments added');
    });

    connection.query("ALTER TABLE node add constraint FK_NodeParentNode foreign key (node_parent) references node(id);", (err) => {
        if (err) console.log("FK_NodeParentNode : ", err.sqlMessage);
        else console.log('Foreign key FK_NodeParentNode added');
    });

    connection.query("ALTER TABLE node add constraint FK_NodeProject foreign key (id_project) references project(id);", (err) => {
        if (err) console.log("FK_NodeProject : ", err.sqlMessage);
        else console.log('Foreign key FK_NodeProject added');
    });

    connection.query("ALTER TABLE node add constraint FK_BranchNode foreign key (id_branch) references branch(id);", (err) => {
        if (err) console.log("FK_BranchNode : ", err.sqlMessage);
        else console.log('Foreign key FK_BranchNode added');
    });

    connection.query("ALTER TABLE specfile add constraint FK_specfileNode foreign key (id_node) references node(id);", (err) => {
        if (err) console.log("FK_specfileNode : ", err.sqlMessage);
        else console.log('Foreign key FK_specfileNode added');
    });

    connection.query("ALTER TABLE affectation add constraint FK_AffectationUser foreign key (id_user) references user(id);", (err) => {
        if (err) console.log("FK_AffectationUser : ", err.sqlMessage);
        else console.log('Foreign key FK_AffectationUser added');
    });

    connection.query("ALTER TABLE affectation add constraint FK_AffectationTeam foreign key (id_team) references team(id);", (err) => {
        if (err) console.log("FK_AffectationTeam : ", err.sqlMessage);
        else console.log('Foreign key FK_AffectationTeam added');
    });

    connection.query("ALTER TABLE tag add constraint FK_TagNode foreign key (id_node) references node(id);", (err) => {
        if (err) console.log("FK_TagNode : ", err.sqlMessage);
        else console.log('Foreign key FK_TagNode added');
    });

    connection.query("ALTER TABLE stripe add constraint FK_StripeOrganization foreign key (id_organization) references organization(id);", (err) => {
        if (err) console.log("FK_StripeOrganization : ", err.sqlMessage);
        else console.log('Foreign key FK_StripeOrganization added');
    });

    connection.query("ALTER TABLE node add constraint FK_files3dNode foreign key (id_files3d) references files3d(id);", (err) => {
        if (err) console.log("FK_files3dNode : ", err.sqlMessage);
        else console.log('Foreign key FK_files3dNode added');
    });

    connection.query("ALTER TABLE pull_request add constraint FK_pullrequestproject foreign key (id_project) references project(id);", err => {
        if (err) console.log("FK_pullrequestproject : ", err.sqlMessage);
        else console.log('Foreign key FK_pullrequestproject added');
    });

    connection.query("ALTER TABLE rights add constraint FK_affectationrights foreign key (id_affectation) references affectation(id);", err => {
        if (err) console.log("FK_affectationrights : ", err.sqlMessage);
        else console.log('Foreign key FK_affectationrights added');
    });

    connection.query("ALTER TABLE rights_file add constraint FK_files3drights_file foreign key (id_files3d) references files3d(id);", err => {
        if (err) console.log("FK_files3drights_file : ", err.sqlMessage);
        else console.log('Foreign key FK_files3drights_file added');
    });

    connection.query("ALTER TABLE annotation add constraint FK_files3danntotation foreign key (id_files3d) references files3d(id);", err => {
        if (err) console.log("FK_files3danntotation : ", err.sqlMessage);
        else console.log('Foreign key FK_files3danntotation added');
    });

    connection.query("ALTER TABLE rights_file add constraint FK_affectationrights_file foreign key (id_affectation) references affectation(id);", err => {
        if (err) console.log("FK_affectationrights_file : ", err.sqlMessage);
        else console.log('Foreign key FK_affectationrights_file added');
    });

    connection.query("ALTER TABLE pull_request add constraint FK_branchpullrequest foreign key (id_branch) references branch(id);", err => {
        if (err) console.log("FK_branchpullrequest : ", err.sqlMessage);
        else console.log('Foreign key FK_branchpullrequest added');
    });

    connection.query("ALTER TABLE issue add constraint FK_projectissues foreign key (id_project) references project(id);", err => {
        if (err) console.log("FK_projectissues :", err.sqlMessage);
        else console.log('Foreign key FK_projectissues added');
    });

    connection.query("ALTER TABLE rights add constraint FK_noderights foreign key (id_node) references node(id);", err => {
        if (err) console.log("FK_noderights : ", err.sqlMessage);
        else console.log('Foreign key FK_noderights added');
    });

    connection.query("ALTER TABLE affectation add constraint FK_sshkeyaffectation foreign key (id_ssh_key) references ssh_key(id);", err => {
        if (err) console.log("FK_sshkeyaffectation : ", err.sqlMessage);
        else console.log('Foreign key FK_sshkeyaffectation added');
    });

        connection.query("ALTER TABLE branch add constraint FK_branch_first_node foreign key (id_first_node) references node(id) ", (err) => {
        if (err) console.log("FK_branch_first_node : ", err.sqlMessage);
        else console.log('Foreign key FK_branch_first_node added');
    });
}, 3000);
*/