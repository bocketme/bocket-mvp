INSERT INTO user (id, username, firstname, lastname, email, password, active, createdat) VALUES
(1, 'admin', 'game', 'throne', 'game@of.throne', 'johnsnow', true, "2004-11-20"),
(2, 'creator', 'sonic', 'mania', 'sonic@mania.fr', 'sonicisthebest', true, "2004-11-20"),
(3, 'nintendo', 'mario', 'odyssey', 'mario@odyssey.fr', 'mariothebest', true, "2004-11-20");

INSERT INTO organization (id, name, id_owner) VALUES
(1, 'The Ultimate', 1);

INSERT INTO team (id, name) VALUES
(1, 'THE FIRST ONE');

INSERT INTO ssh_key (id, content) VALUES
(1, 'blablou');

INSERT INTO affectation (id, id_user, id_team, owner_team) VALUES
(1, 1, 1, true),
(2, 2, 1, false),
(3, 3, 1, false);

INSERT INTO files3d (id, name, uuid) VALUES
(1, "master", "maja");

INSERT INTO node (id, name, path, state_of_maturity, is_intermediary, id_branch, id_files3d) VALUES
(1, "master", "master", "0", true, 1, 1);

INSERT INTO project (id, name, path, id_organization, id_team, id_master_branch) VALUES
(1, "ZE PROJEKT", "Environnement_v1", 1, 1, 1);

INSERT INTO branch (id, name, id_first_node, id_base_node, id_project) VALUES
(1, "master", 1, null,  1),
(2, "keychain_to_shuttle", 12, 6, 1);

INSERT INTO files3d (id, name, uuid) VALUES
(2,     "tetraedre", "baka"),
(3,     "void", "lola"),
(4,     "sphere", "soda"),
(5,     "tore", "fafa"),
(6,     "keychain", "moma"),
(7,     "key_1", "anas"),
(8,     "key_2", "vava"),
(9,     "key_3", "joie"),
(10,    "key_4", "coca"),
(11,    "key_5", "cola");

INSERT INTO node (id, name, path, state_of_maturity, is_intermediary, node_parent, id_branch, id_files3d) VALUES
(2,     "tetraedre",    "tetraedre",    4, false, 1, 1, 2),
(3,     "vide", 	    "void",         1, true, 1, 1, 3),
(4,     "sphere", 	    "sphere",       4, false, 3, 1, 4),
(5,     "tore", 	    "tore",         4, false, 3, 1, 5),
(6,     "keychain",     "keychain",     3, true, 1, 1, 6),
(7,     "vide", 	    "key_1",         1, true, 6, 1, 7),
(8,     "vide", 	    "key_2",         1, true, 6, 1, 8),
(9,     "vide", 	    "key_3",         1, true, 6, 1, 9),
(10,    "vide", 	    "key_4",         1, true, 6, 1, 10),
(11,    "vide", 	    "key_5",         1, true, 6, 1, 11);

INSERT INTO files3d (id, name, uuid) VALUES
(12, "shuttle", "sonic_le_rebel");

INSERT INTO node (id, name, path, state_of_maturity, is_intermediary, node_parent, id_branch, id_files3d) VALUES
(12, "shuttle", "keychain", 4, true, null, 2, 12),
(13,     "vide", 	    "key_1",         1, true, 12, 1, 7),
(14,     "vide", 	    "key_2",         1, true, 12, 1, 8),
(15,     "vide", 	    "key_3",         1, true, 12, 1, 9),
(112,    "vide", 	    "key_4",         1, true, 12, 1, 10),
(17,    "vide", 	    "key_5",         1, true, 12, 1, 11);

INSERT INTO rights (id, administration, id_affectation, id_node) VALUES
-- RIGHTS FOR THE ADMIN
(1, true, 1, 1),
(2, true, 1, 2),
(3, true, 1, 3),
(4, true, 1, 4),
(5, true, 1, 5),
(6, true, 1, 6),
(7, true, 1, 7),
(8, true, 1, 8),
(9, true, 1, 9),
(10, true, 1, 10),
(11, true, 1, 11);

INSERT INTO rights_file (id, read_right, write_right, id_affectation, id_files3d, id_node) VALUES

-- RIGHTS-FILE FOR THE ADMIN
(1, true, false, 1, 1, 1),
(2, true, false, 1, 2, 2),
(3, true, false, 1, 3, 3),
(4, true, false, 1, 4, 4),
(5, true, false, 1, 5, 5),
(6, true, false, 1, 6, 6),
(7, true, false, 1, 7, 7),
(8, true, false, 1, 8, 8),
(9, true, false, 1, 9, 9),
(10, true, false, 1, 10, 10),
(11, true, false, 1, 11, 11),

-- RIGHTS-FILE FOR THE USER CREATOR
(12, true, true, 2, 1,  1),
(13, true, true, 2, 2,  2),
(14, true, true, 2, 3,  3),
(15, true, true, 2, 4,  4),
(16, true, true, 2, 5,  5),
(17, true, false, 2, 6,  6),
(18, true, false, 2, 7,  7),
(19, true, false, 2, 8,  8),
(20, true, false, 2, 9,  9),
(21, true, false, 2, 10, 10),
(22, true, false, 2, 11, 11),

-- RIGHTS-FILE FOR THE USER Nintendo
(23, true, true, 2, 1, 1),
(24, false, false, 2, 2, 2),
(25, false, false, 2, 3, 3),
(26, false, false, 2, 4, 4),
(27, false, false, 2, 5, 5),
(28, true, true, 2, 6, 6),
(29, true, true, 2, 7, 7),
(30, true, true, 2, 8, 8),
(31, true, true, 2, 9, 9),
(32, true, true, 2, 10, 10),
(33, true, true, 2, 11, 11);

INSERT INTO specfile (id, name, id_node) VALUES
(1, "README.MD", 1);

INSERT INTO rights_file (id, read_right, write_right, id_affectation, id_specfile, id_node) VALUES
(34, true, true, 1, 1, 1),
(35, true, true, 1, 1, 1),
(36, true, true, 1, 1, 1);

INSERT INTO pull_request (id, title, content, branch_source, branch_destination, id_project) VALUES
(1, "new shuttle", "I want a new Shuttle", 2, 1, 1);