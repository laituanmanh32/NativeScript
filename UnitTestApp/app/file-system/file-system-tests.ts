import * as appModule from 'tns-core-modules/application';
import * as fs from 'tns-core-modules/file-system';
import * as platform from 'tns-core-modules/platform';

import * as TKUnit from '../tk-unit';

export let testPathNormalize = function () {
    let documents = fs.knownFolders.documents();
    let testPath = "///test.txt";
    // Get a normalized path such as <folder.path>/test.txt from <folder.path>///test.txt
    let normalizedPath = fs.path.normalize(documents.path + testPath);
    let expected = documents.path + "/test.txt";
    TKUnit.assert(normalizedPath === expected);
};

export let testPathJoin = function () {
    let documents = fs.knownFolders.documents();
    // Generate a path like <documents.path>/myFiles/test.txt
    let path = fs.path.join(documents.path, "myFiles", "test.txt");
    let expected = documents.path + "/myFiles/test.txt";
    TKUnit.assert(path === expected);
};

export let testPathSeparator = function () {
    // An OS dependent path separator, "\" or "/".
    let separator = fs.path.separator;
    let expected = "/";
    TKUnit.assert(separator === expected);
};

export let testFileFromPath = function () {
    let documents = fs.knownFolders.documents();
    let path = fs.path.join(documents.path, "FileFromPath.txt");
    let file = fs.File.fromPath(path);

    // Writing text to the file.
    file.writeText("Something")
        .then(function () {
            // Succeeded writing to the file.
            file.readText()
                .then(function (content) {
                    TKUnit.assert(content === "Something", "File read/write not working.");
                    file.remove();
                }, function (error) {
                    TKUnit.assert(false, "Failed to read/write text");
                    //console.dir(error);
                });
        }, function (error) {
            // Failed to write to the file.
            TKUnit.assert(false, "Failed to read/write text");
            //console.dir(error);
        });
}

export let testFolderFromPath = function () {
    let path = fs.path.join(fs.knownFolders.documents().path, "music");
    let folder = fs.Folder.fromPath(path);
    TKUnit.assert(<any>folder, "Folder.getFolder API not working.");
    TKUnit.assert(fs.Folder.exists(folder.path), "Folder.getFolder API not working.");
    folder.remove();
}

export let testFileWrite = function () {
    let documents = fs.knownFolders.documents();
    let file = documents.getFile("Test_Write.txt");

    // Writing text to the file.
    file.writeText("Something")
        .then(function () {
            // Succeeded writing to the file.
            file.readText()
                .then(function (content) {
                    TKUnit.assert(content === "Something", "File read/write not working.");
                    file.remove();
                }, function (error) {
                    TKUnit.assert(false, "Failed to read/write text");
                    //console.dir(error);
                });
        }, function (error) {
            // Failed to write to the file.
            TKUnit.assert(false, "Failed to read/write text");
            //console.dir(error);
        });
};

export let testGetFile = function () {
    let documents = fs.knownFolders.documents();
    let file = documents.getFile("NewFileToCreate.txt");
    TKUnit.assert(<any>file, "File.getFile API not working.");
    TKUnit.assert(fs.File.exists(file.path), "File.getFile API not working.");
    file.remove();
}

export let testGetFolder = function () {
    let documents = fs.knownFolders.documents();
    let folder = documents.getFolder("NewFolderToCreate");
    TKUnit.assert(<any>folder, "Folder.getFolder API not working.");
    TKUnit.assert(fs.Folder.exists(folder.path), "Folder.getFolder API not working.");
    folder.remove();
};

export let testFileRead = function () {
    let documents = fs.knownFolders.documents();
    let myFile = documents.getFile("Test_Write.txt");

    let written: boolean;
    // Writing text to the file.
    myFile.writeText("Something")
        .then(function () {
            // Succeeded writing to the file.

            // Getting back the contents of the file.
            myFile.readText()
                .then(function (content) {
                    // Successfully read the file's content.
                    written = content === "Something";
                    TKUnit.assert(written, "File read/write not working.");
                    myFile.remove();
                    // << (hide)
                }, function (error) {
                    // Failed to read from the file.
                    TKUnit.assert(false, "Failed to read/write text");
                    //console.dir(error);
                });
        }, function (error) {
            // Failed to write to the file.
            TKUnit.assert(false, "Failed to read/write text");
            //console.dir(error);
        });
};

export let testFileReadWriteBinary = function () {
    let fileName = "logo.png";
    let error;

    let sourceFile = fs.File.fromPath(__dirname + "/../" + fileName);
    let destinationFile = fs.knownFolders.documents().getFile(fileName);

    let source = sourceFile.readSync(e => { error = e; });

    destinationFile.writeSync(source, e => { error = e; });

    let destination = destinationFile.readSync(e => { error = e; });
    TKUnit.assertNull(error);
    if (platform.device.os === platform.platformNames.ios) {
        TKUnit.assertTrue(source.isEqualToData(destination));
    } else {
        TKUnit.assertEqual(new java.io.File(sourceFile.path).length(), new java.io.File(destinationFile.path).length());
    }

    destinationFile.removeSync();
};

export let testGetKnownFolders = function () {
    // Getting the application's 'documents' folder.
    let documents = fs.knownFolders.documents();
    TKUnit.assert(<any>documents, "Could not retrieve the Documents known folder.");
    TKUnit.assert(documents.isKnown, "The Documents folder should have its isKnown property set to true.");
    // Getting the application's 'temp' folder.
    let temp = fs.knownFolders.temp();
    TKUnit.assert(<any>temp, "Could not retrieve the Temporary known folder.");
    TKUnit.assert(temp.isKnown, "The Temporary folder should have its isKnown property set to true.");
};

function _testIOSSpecificKnownFolder(knownFolderName: string) {
    let knownFolder: fs.Folder;
    let createdFile: fs.File;
    let testFunc = function testFunc() {
        knownFolder = fs.knownFolders.ios[knownFolderName]();
        if (knownFolder) {
            createdFile = knownFolder.getFile("createdFile");
            createdFile.writeTextSync("some text");
        }
    };
    if (platform.isIOS) {
        testFunc();
        if (knownFolder) {
            TKUnit.assertTrue(knownFolder.isKnown, `The ${knownFolderName} folder should have its "isKnown" property set to true.`);
            TKUnit.assertNotNull(createdFile, `Could not create a new file in the ${knownFolderName} known folder.`);
            TKUnit.assertTrue(fs.File.exists(createdFile.path), `Could not create a new file in the ${knownFolderName} known folder.`);
            TKUnit.assertEqual(createdFile.readTextSync(), "some text", `The contents of the new file created in the ${knownFolderName} known folder are not as expected.`);
        }
    }
    else {
        TKUnit.assertThrows(testFunc,
            `Trying to retrieve the ${knownFolderName} known folder on a platform different from iOS should throw!`,
            `The "${knownFolderName}" known folder is available on iOS only!`);
    }
}

export let testIOSSpecificKnownFolders = function () {
    _testIOSSpecificKnownFolder("library");
    _testIOSSpecificKnownFolder("developer");
    _testIOSSpecificKnownFolder("desktop");
    _testIOSSpecificKnownFolder("downloads");
    _testIOSSpecificKnownFolder("movies");
    _testIOSSpecificKnownFolder("music");
    _testIOSSpecificKnownFolder("pictures");
    _testIOSSpecificKnownFolder("sharedPublic");
};

export let testGetEntities = function () {
    let documents = fs.knownFolders.documents();
    let file = documents.getFile("Test.txt");
    let file1 = documents.getFile("Test1.txt");

    let fileFound,
        file1Found;

    // IMPORTANT: console.log is mocked to make the snippet pretty.
    let globalConsole = console;
    var console = {
        log: function (file) {
            if (file === "Test.txt") {
                fileFound = true;
            } else if (file === "Test1.txt") {
                file1Found = true;
            }
        }
    };

    documents.getEntities()
        .then(function (entities) {
            // entities is array with the document's files and folders.
            entities.forEach(function (entity) {
                console.log(entity.name);
            });

            TKUnit.assert(fileFound, "Failed to enumerate Test.txt");
            TKUnit.assert(file1Found, "Failed to enumerate Test1.txt");

            file.remove();
            file1.remove();
        }, function (error) {
            // Failed to obtain folder's contents.
            // globalConsole.error(error.message);
        });
};

export let testEnumEntities = function () {
    let documents = fs.knownFolders.documents();
    let file = documents.getFile("Test.txt");
    let file1 = documents.getFile("Test1.txt");
    let testFolder = documents.getFolder("testFolder");
    let fileFound = false;
    let file1Found = false;
    let testFolderFound = false;
    let console = {
        log: function (file) {
            if (file === "Test.txt") {
                fileFound = true;
            } else if (file === "Test1.txt") {
                file1Found = true;
            } else if (file === "testFolder") {
                testFolderFound = true;
            }
        }
    }
    documents.eachEntity(function (entity) {
        console.log(entity.name);
        // Return true to continue, or return false to stop the iteration.
        return true;
    });
    TKUnit.assert(fileFound, "Failed to enumerate Test.txt");
    TKUnit.assert(file1Found, "Failed to enumerate Test1.txt");
    TKUnit.assert(testFolderFound, "Failed to enumerate testFolder");

    file.remove();
    file1.remove();
    testFolder.remove();
};

export let testGetParent = function () {
    let documents = fs.knownFolders.documents();
    let file = documents.getFile("Test.txt");
    TKUnit.assert(<any>file, "Failed to create file in the Documents folder.");
    // The parent folder of the file would be the documents folder.
    let parent = file.parent;
    TKUnit.assert(documents === parent, "The parent folder should be the Documents folder.");
    file.remove();
};

export let testFileNameExtension = function () {
    let documents = fs.knownFolders.documents();
    let file = documents.getFile("Test.txt");
    // Getting the file name "Test.txt".
    let fileName = file.name;
    // Getting the file extension ".txt".
    let fileExtension = file.extension;
    TKUnit.assert(fileName === "Test.txt", "Wrong file name.");
    TKUnit.assert(fileExtension === ".txt", "Wrong extension.");
    file.remove();
};

export let testFileExists = function () {
    let documents = fs.knownFolders.documents();
    let filePath = fs.path.join(documents.path, "Test.txt");
    let exists = fs.File.exists(filePath);
    TKUnit.assert(!exists, "File.exists API not working.");
    let file = documents.getFile("Test.txt");
    exists = fs.File.exists(file.path);
    TKUnit.assert(exists, "File.exists API not working.");
    file.remove();
};

export let testFolderExists = function () {
    let documents = fs.knownFolders.documents();
    let exists = fs.Folder.exists(documents.path);
    TKUnit.assert(exists, "Folder.exists API not working.");
    exists = fs.Folder.exists(documents.path + "_");
    TKUnit.assert(!exists, "Folder.exists API not working.");
};

export let testContainsFile = function () {
    let folder = fs.knownFolders.documents();
    let file = folder.getFile("Test.txt");

    let contains = folder.contains("Test.txt");
    TKUnit.assert(contains, "Folder.contains API not working.");
    contains = folder.contains("Test_xxx.txt");
    TKUnit.assert(!contains, "Folder.contains API not working.");

    file.remove();
};

export let testFileRename = function () {
    let documents = fs.knownFolders.documents();
    let file = documents.getFile("Test.txt");

    file.rename("Test_renamed.txt")
        .then(function (result) {
            // Successfully Renamed.
            TKUnit.assert(file.name === "Test_renamed.txt", "File.rename API not working.");
            file.remove();
            documents.getFile("Test.txt").remove();
        }, function (error) {
            // Failed to rename the file.
            TKUnit.assert(false, "Failed to rename file");
        });
};

export let testFolderRename = function () {
    let folder = fs.knownFolders.documents();
    let myFolder = folder.getFolder("Test__");

    myFolder.rename("Something")
        .then(function (result) {
            // Successfully Renamed.
            TKUnit.assert(myFolder.name === "Something", "Folder.rename API not working.");
            myFolder.remove();
            folder.getFolder("Test__").remove();
            // << (hide)
        }, function (error) {
            // Failed to rename the folder.
            TKUnit.assert(false, "Folder.rename API not working.");
        });
};

export let testFileRemove = function () {
    let documents = fs.knownFolders.documents();
    let file = documents.getFile("AFileToRemove.txt");
    file.remove()
        .then(function (result) {
            // Success removing the file.
            TKUnit.assert(!fs.File.exists(file.path));
        }, function (error) {
            // Failed to remove the file.
            TKUnit.assert(false, "File.remove API not working.");
        });
};

export let testFolderRemove = function () {
    let documents = fs.knownFolders.documents();
    let file = documents.getFolder("AFolderToRemove");
    // Remove a folder and recursively its content.
    file.remove()
        .then(function (result) {
            // Success removing the folder.
            TKUnit.assert(!fs.File.exists(file.path));
        }, function (error) {
            // Failed to remove the folder.
            TKUnit.assert(false, "File.remove API not working.");
        });
}

export let testFolderClear = function () {
    let documents = fs.knownFolders.documents();
    let folder = documents.getFolder("testFolderEmpty");
    folder.getFile("Test1.txt");
    folder.getFile("Test2.txt");
    let subfolder = folder.getFolder("subfolder");
    let emptied;
    folder.clear()
        .then(function () {
            // Successfully cleared the folder.
            emptied = true;
        }, function (error) {
            // Failed to clear the folder.
            TKUnit.assert(false, error.message);
        });
    folder.getEntities()
        .then(function (entities) {
            TKUnit.assertEqual(entities.length, 0, `${entities.length} entities left after clearing a folder.`);
            folder.remove();
        });
};

// misc
export let testKnownFolderRename = function () {
    // You can rename known folders in android - so skip this test.
    if (!appModule.android) {
        let folder = fs.knownFolders.documents();
        folder.rename("Something")
            .then(function (result) {
                TKUnit.assert(false, "Known folders should not be renamed.");
            }, function (error) {
                TKUnit.assert(true);
            });
    }
};

export function testKnownFolderRemove(done) {
    let knownFolder = fs.knownFolders.temp();

    knownFolder.remove().then(
        function () {
            done(new Error("Remove known folder should resolve as error."));
        },
        function (error) {
            done(null);
        });
};

export function test_FSEntity_Properties() {
    let documents = fs.knownFolders.documents();
    let file = documents.getFile("Test_File.txt");

    TKUnit.assert(file.extension === ".txt", "FileEntity.extension not working.");
    TKUnit.assert(file.isLocked === false, "FileEntity.isLocked not working.");
    TKUnit.assert(file.lastModified instanceof Date, "FileEntity.lastModified not working.");
    TKUnit.assert(file.size === 0, "FileEntity.size not working.");
    TKUnit.assert(file.name === "Test_File.txt", "FileEntity.name not working.");
    TKUnit.assert(file.parent === documents, "FileEntity.parent not working.");

    file.remove();
}

export function test_FileSize(done) {
    let file = fs.knownFolders.documents().getFile("Test_File_Size.txt");
    file.writeText("Hello World!").then(() => {
        TKUnit.assert(file.size === "Hello World!".length);
        return file.remove();
    }).then(() => done())
        .catch(done);
}

export function test_UnlockAfterWrite(done) {
    let file = fs.knownFolders.documents().getFile("Test_File_Lock.txt");
    file.writeText("Hello World!").then(() => {
        return file.readText();
    }).then(value => {
        TKUnit.assert(value === "Hello World!");
        return file.remove();
    }).then(() => done())
        .catch(done);
}

export function test_CreateParentOnNewFile(done) {
    let documentsFolderName = fs.knownFolders.documents().path;
    let tempFileName = fs.path.join(documentsFolderName, "folder1", "folder2", "Test_File_Create_Parent.txt");
    let file = fs.File.fromPath(tempFileName);
    file.writeText("Hello World!").then(() => {
        return fs.knownFolders.documents().getFolder("folder1").remove();
    }).then(() => done())
        .catch(done);
}

export function test_FolderClear_RemovesEmptySubfolders(done) {
    let documents = fs.knownFolders.documents();
    let rootFolder = documents.getFolder("rootFolder");
    let emptySubfolder = rootFolder.getFolder("emptySubfolder");
    TKUnit.assertTrue(fs.Folder.exists(emptySubfolder.path), "emptySubfolder should exist before parent folder is cleared.");
    rootFolder.clear().then(
        () => {
            TKUnit.assertFalse(fs.File.exists(emptySubfolder.path), "emptySubfolder should not exist after parent folder was cleared.");
            rootFolder.remove();
            done();
        })
        .catch(done);
}
