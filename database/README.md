# DATABASE TODO LIST

## TABLES

:heavy\_check\_mark: => vérifié (aucune erreur)

- [x] user :heavy\_check\_mark:
- [x] node :heavy\_check\_mark:
- [x] branch :heavy\_check\_mark:
- [x] pull_request :heavy\_check\_mark:
- [x] comment :heavy\_check\_mark:
- [x] specfile :heavy\_check\_mark:
- [x] files3d :heavy\_check\_mark:
- [x] project :heavy\_check\_mark:
- [x] team :heavy\_check\_mark:
- [x] notifications :heavy\_check\_mark:
- [x] rights :heavy\_check\_mark:
- [x] rights_file :heavy\_check\_mark:
- [x] affectation :heavy\_check\_mark:
- [x] tag :heavy\_check\_mark:
- [x] ssh_keys :heavy\_check\_mark:
- [x] organization :heavy\_check\_mark:
- [x] stripe :heavy\_check\_mark:
- [x] issue :heavy\_check\_mark:
- [x] annotation :heavy\_check\_mark:

## FK

TEMPLATE :

- [ ] `FK_name (table_name(foreign_key) - table_name(primary_key))` => crée
- [x] `FK_name (table_name(foreign_key) - table_name(primary_key))` => non crée

:heavy\_check\_mark: => vérifié (aucune erreur)

- [x] FK\_owneraffectation ( team(id\_owner) - affectation(id) ) :heavy\_check\_mark:
- [x] FK\_usernotifications ( notifications(id\_user) - user(id) ) :heavy\_check\_mark:
- [x] FK\_usercomment ( comment(id\_author) - user(id) ) :heavy\_check\_mark:
- [x] FK\_projectnode ( node(id\_project) - project(id) ) :heavy\_check\_mark:
- [x] FK\_teamproject ( project(id\_team) - team(id)) :heavy\_check\_mark:
- [x] FK\_files3dcomment (comment(id\_files3d) - files3d(id)) :heavy\_check\_mark:
- [x] FK\_specfilecomment (comment(id\_specfile) - specfile(id)) :heavy\_check\_mark:
- [x] FK\_orgnanizationproject (project(id_organization) - organization(id)) :heavy\_check\_mark:
- [x] FK\_issuecomment (comment(id\_issue) - issue(id)) :heavy\_check\_mark:
- [x] FK\_nodeparentnode (node(nodeparent) - node(id)) :heavy\_check\_mark:
- [x] FK\_branchnode (node(id\_branch) - branch(id)) :heavy\_check\_mark:
- [x] FK\_nodespecfile (specfile(id\_node) - node(id)) :heavy\_check\_mark:
- [x] FK\_teamaffectation ( affectation(id\_team) - team(id) ) :heavy\_check\_mark:
- [x] FK\_useraffectation ( affectation(id\_user) - user(id) ) :heavy\_check\_mark:
- [x] FK\_nodetag(tag(id\_node) - node(id)) :heavy\_check\_mark:
- [x] FK\_stripeorganization (organization(id_stripe) - stripe(id)) :heavy\_check\_mark:
- [x] FK\_files3dnode (node(id\_files3d) - files3d(id)) :heavy\_check\_mark:
- [x] FK\_pullrequestproject (pull\_request(id\_project) - project(id)) :heavy\_check\_mark:
- [x] FK\_affectationrights (rights(id\_affectation) - affectation(id)) :heavy\_check\_mark:
- [x] FK\_files3drights_file (rights\_file(id\_files3d) - files3d(id)) :heavy\_check\_mark:
- [x] FK\_files3danntotation (annotation(id\_files3d) - files3d(id)) :heavy\_check\_mark:
- [x] FK\_affectationrights\_file (rights\_file(id\_affectation) - affectation(id)) :heavy\_check\_mark:
- [x] FK\_filesrightsspecfile (rights_file(id\_specfile) - specfile(id)) :heavy\_check\_mark:
- [x] FK\_branchpullrequest ( pullrequest(id\_branch) - branch() ) :heavy\_check\_mark:
- [x] FK\_projectissues (issue(id\_project) - project(id)) :heavy\_check\_mark:
- [x] FK\_noderights (rights(id\_node) - node(id)) :heavy\_check\_mark:
- [x] FK\_sshkeyaffectation (affectation(id\_ssh\_key)  - ssh\_key(id)) :heavy\_check\_mark:
- [x] FK\_CommentPullRequest (comment(id\_pull\_request) - pull\_request(if)) :heavy\_check\_mark:
- [x] FK\_branch\_first\_node (branch(id\_first\_node) - node(id)) :heavy\_check\_mark:
- [x] FK\_annotation\_user (annotation(id_user) - node(id)) :heavy\_check\_mark: