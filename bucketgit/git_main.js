var git = {};

/* ************************************************************************** */
/*                                                                            */
/*                      Assemblage NODEGIT commands                           */
/*                                                                            */
/* ************************************************************************** */

git.node = require('./git_add_node');

git.ini = require('./git_init');

git.commit = require('./git_commit').browser;

git.read = require('./git_read').read_only;

git.read.commit = require('./git_read').commit;

git.write = require('./git_commit').write;

module.exports = git;