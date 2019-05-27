import * as fs from 'tns-core-modules/file-system';
import * as imageSource from 'tns-core-modules/image-source';

export function imageSourceFromAsset(imageAsset) {
    let source = new imageSource.ImageSource();
    source.fromAsset(imageAsset).then((imageSource) => {
        let folder = fs.knownFolders.documents().path;
        let fileName = "test.png";
        let path = fs.path.join(folder, fileName);
        let saved = imageSource.saveToFile(path, "png");
        if (saved) {
            console.log("Image saved successfully!");
        }
    })
}
