var sys = require('sys')
var exec = require('child_process').exec;
var datakitPath = "~/Datakit/";
var exportLib = "cd " + datakitPath + " && export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:./DatakitLibs.x64" ;
  


  async function convertFiles(file_Path){
    var mfile_Path = file_Path ;
    var command = exportLib + " && " + datakitPath ;
    command += './crossmanagerDtk_x64.run in=';
    var j = 0 ;
    for (var i=0;i<file_Path.length;i++){
      if(file_Path[i]===" "){
        var output = [mfile_Path.slice(0, i + j ), "\\", mfile_Path.slice( i + j)].join('');
        mfile_Path = output ;
        j= j + 1 ;
      }
    }
    command += mfile_Path + ' out=';
    let filePathNoExt = mfile_Path.indexOf(".",file_Path.length-10);
    let convertedPath = mfile_Path.substring(0, filePathNoExt) + ".obj ";
    command += convertedPath + "fmtout=OBJ conf="+datakitPath+"config.dtk" ;
    var child = exec(command, function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr); 
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      return true 
    });

}

module.exports = {
  convertFiles,
}
