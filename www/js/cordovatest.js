console.log('TestCtrl');

/*
 List dir test and remove all dirs and files in test to start over again the test
*/
function ClearDirectory() {
    console.log('ClearDirectory');
    $cordovaFile.listDir(fileDir + 'test').then(function (entries) {
        console.log('listDir: ', entries);
    }, function (err) {
        console.error('listDir error: ', err);
    });

    $cordovaFile.removeRecursively(fileDir + 'test')
        .then(function () {
            console.log(trinlDir + ' recursively removed');
        },
            function (err) {
                console.log(fileDir + ' error: ', err);
            });
}

/*
Here some examples with proper filepath
*/

function testFS() {
    // Download file from 'http://www.yourdomain.com/test.jpg' to test/one/test.jpg on device Filesystem
    var hostPath = 'http://www.yourdomain.com/test.jpg';
    var clientPath = fileTransferDir + 'test/one/test.jpg';
    var fileTransferOptions = {};

    $cordovaFile.downloadFile(hostPath, clientPath, true, fileTransferOptions).then(function () {
    });
    // Create dir test
    $cordovaFile.createDir(fileDir + 'test/').then(function (dirEntry) {
    });
    // Create dir aganin in dir test
    $cordovaFile.createDir(fileDir + 'test/one/').then(function (dirEntry) {
    });
    // Create empty file test.txt in test/again/
    $cordovaFile.createFile(fileDir + 'test/one/test.txt', true).then(function (fileEntry) {
    });
    // List of files in test/again
    $cordovaFile.listDir(fileDir + 'test/one/').then(function (entries) {
        console.log('list dir: ', entries);
    });
    // Write some text into file 
    $cordovaFile.writeFile(fileDir + 'test/one/test.txt', 'Some text te test filewrite', '').then(function (result) {
    });
    // Read text written in file
    $cordovaFile.readAsText(fileDir + 'test/one/test.txt').then(function (result) {
        console.log('readAsText: ', result);
    });
}

function testQ() {
    var hostPath = 'http://www.yourdomain.com/test.jpg';
    var clientPath = fileTransferDir + 'test/one/test.jpg';
    var fileTransferOptions = {};
    $q.all([
        $cordovaFile.downloadFile(hostPath, clientPath, true, fileTransferOptions),
        $cordovaFile.createDir(fileDir + 'test/'),
        $cordovaFile.createDir(fileDir + 'test/two/'),
        $cordovaFile.createFile(fileDir + 'test/one/test.txt', true),
        $cordovaFile.listDir(fileDir + 'test/one/'),
        $cordovaFile.writeFile(fileDir + 'test/one/test.txt', 'Some text te test filewrite', ''),
        $cordovaFile.readAsText(fileDir + 'test/one/test.txt')
    ]).then(function (result) {
        console.log('testQ result: ', result);
    });
}

/*
Here is what I am using for my Android and IOS apps
Keep attention to a couple of things:
-	Android and IOS have other directorynames for files
-	$cordovaFile functions prefixes all pathnames with root
	$cordovaFileTransfer functions needs absolute pathnames

Here I create the prefixes for File functions and FileTransfer functions for Android and IOS
*/

$ionicPlatform.ready(function () {
    if (ionic.Platform.isAndroid()) {
        console.log('cordova.file.externalDataDirectory: ' + cordova.file.externalDataDirectory);
        myFsRootDirectory1 = 'file:///storage/emulated/0/'; // path for tablet
        myFsRootDirectory2 = 'file:///storage/sdcard0/'; // path for phone
        fileTransferDir = cordova.file.externalDataDirectory;
        if (fileTransferDir.indexOf(myFsRootDirectory1) === 0) {
            fileDir = fileTransferDir.replace(myFsRootDirectory1, '');
        }
        if (fileTransferDir.indexOf(myFsRootDirectory2) === 0) {
            fileDir = fileTransferDir.replace(myFsRootDirectory2, '');
        }
        console.log('Android FILETRANSFERDIR: ' + fileTransferDir);
        console.log('Android FILEDIR: ' + fileDir);
    }
    if (ionic.Platform.isIOS()) {
        console.log('cordova.file.documentsDirectory: ' + cordova.file.documentsDirectory);
        fileTransferDir = cordova.file.documentsDirectory;
        fileDir = '';
        console.log('IOS FILETRANSFERDIR: ' + fileTransferDir);
        console.log('IOS FILEDIR: ' + fileDir);
    }

    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
        ClearDirectory();
        testFS();
        // Other functions here
    }
});
