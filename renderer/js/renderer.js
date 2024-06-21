const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
    const file = e.target.files[0]; //can use e.target as the event is is listening for is an img change

    if(!isFileImage(file)) {
        console.log('Please select and image of relevant file type (png,gif,jpeg,bmp)'); //
        return;
    }

    // get original dimensions
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        widthInput.value = this.widthInput;
        heightInput.value = this.heightInput;
    }


    console.log("It's working!");
    form.style.display = 'block'; // reveals the form if the file type is correct
    filename.innerText = file.name; // shows the original file name 
    outputPath.innerText = path.join(os.homedir(), 'imageResizer') // sets the output path to the chosen folder

}

// Make sure that the file is an image
function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/bmp', 'image/jpeg'];
    return file && acceptedImageTypes.includes(file['type']); //this is where the check takes place '.includes'
}

img.addEventListener('change', loadImage)
