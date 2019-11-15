/*
* This Script can be used to batch export photoshop .png graphics.
* Place the script in the same directory as the .psd template and the .csv file
* with the data to be used. 
*
* Author: Samuel Spycher
*/


// create the data
var data = importCSVData("Data.csv");
// create the .png files
createPNGFiles(data);


/*
*  This function dakes the name of a .csv file
*  and imports the data from the given filename.
*  The data is returned as array of json-objects.
*/
function importCSVData(docName){
  var data = [];
  var dataFile = new File(app.activeDocument.path + '/' + docName);
  dataFile.open('r');
  dataFile.readln(); // Skip first line
  while (!dataFile.eof) {
    var dataFileLine = dataFile.readln();

    var dataFilePieces = dataFileLine.split(';'); // change delimitor accordingly to your language
    data.push({
      name: dataFilePieces[0],
      description: dataFilePieces[1]
    });
  }
  dataFile.close();
  return data;
}

/*
*  This function takes an array of json-objects as input
*  and exports a .png file for every data-element.
*/
function createPNGFiles(data){
  for(i = 0; i < data.length ; i++){
    var name = data[i].name;
    var description = data[i].description;
    updateText(name, description);
    var docName = name.replace(/\s/g,'');
    exportPNG(docName);
  }
  // close the photoshop file without saving it to leave the template as it was
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  // quit the photoshop application - comment out if you don't want PS to quit
  executeAction(app.charIDToTypeID('quit'), undefined, DialogModes.NO);
}

/*
*  Helper function for createPNGFiles().
*  It takes two strings - name_new and description_new -
*  as input and replaces the corresponding text layers
*  in the photoshop file.
*/
function updateText(name_new, description_new) {
  //select the text layers in the photoshop file
  var name = app.activeDocument.layers.getByName("Name");
  var description = app.activeDocument.layers.getByName("Description");
  // replace the text
  name.textItem.contents = name_new;
  description.textItem.contents = description_new;
}

/*
*  Helper function for createPNGFiles()
*  Exports the current document as .png file
*  with the name given as input to the function.
*/
function exportPNG(docName){

  var doc = app.activeDocument;
  var filePath = activeDocument.fullName.path;
  // we store the new files in a folder called "Export"
  var folder = new Folder(filePath + "/Export");
  if(!folder.exists){
    folder.create();
  }
  var pngFile = File(folder + "/" + docName + ".png");
  if(pngFile.exists) pngFile.remove();

  var pngSaveOptions = new PNGSaveOptions();
  doc.saveAs(pngFile, pngSaveOptions, true, Extension.LOWERCASE);

  // undo the history and purge
  doc.activeHistoryState = doc.historyStates[doc.historyStates.length-2];
  app.purge(PurgeTarget.HISTORYCACHES);
}
