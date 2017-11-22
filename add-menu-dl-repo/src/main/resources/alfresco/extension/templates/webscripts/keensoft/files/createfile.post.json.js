// extract arguments from JSON
var destination = json.get("destination");

// search for folder
var folder = search.findNode(destination);

// validate that folder has been found
if (folder == undefined || !folder.isContainer) {
   status.code = 404;
   status.message = "Folder " + destination + " not found.";
   status.redirect = true;
}

// create sample file
var doc = folder.createFile("newFile.txt");
doc.content = "original text";

// put information for FTL view
model.doc = doc;