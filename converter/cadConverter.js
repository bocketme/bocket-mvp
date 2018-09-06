var sys = require('sys')
var exec = require('child_process').exec;
var datakitPath = "~/Datakit/";
var exportLib = "cd " + datakitPath + " && export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:./DatakitLibs.x64" ;
  


  async function convertFiles(file_Path){
    //./crossmanagerDtk_x64.run in="$file" out="./Converted / ModelG / $filename".obj fmtin=CATIAV5 fmtout=OBJ conf=config.dtk
    var command = exportLib + " && " + datakitPath ;
    command += './crossmanagerDtk_x64.run in=';
    command += file_Path + ' out=';
    let filePathNoExt = file_Path.indexOf(".",file_Path.length-10);
    let convertedPath = file_Path.substring(0, filePathNoExt) + ".obj ";
    command += convertedPath + "fmtout=OBJ conf="+datakitPath+"config.dtk" ;
    var child = exec(command, function (error, stdout, stderr) {
      sys.print('stdout: ' + stdout);
      sys.print('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      return error 
    });

}

module.exports = {
  convertFiles,
}


// let cadConverter = require('./cadConverter');
// async function JSimport (file_path) {
  // var secondResult = await cadConverter.exportLibrary();
  // var result = await cadConverter.convertFiles(file_path);
