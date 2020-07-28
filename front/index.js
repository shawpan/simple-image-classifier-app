let isLoading = false;
const setupSection = document.getElementById('setup-section');
const setupHeader = document.getElementById('setup-header');

const token = document.getElementById('token');
const url = document.getElementById('url');
const resultCanvas = document.getElementById('image-upload');
const resultPreview = document.getElementById('result-preview');
const imagePreview = document.getElementById('image-preview');

const uploadInput = document.getElementById('upload-input');
let imgFile = null;

const getToken = () => {
    const locationURL = new URL(window.location.href);
    const tokenParam = locationURL.searchParams.get('token');
    const urlParam = locationURL.searchParams.get('url');
    token.value = tokenParam || '';
    url.value = urlParam || '';
};

setTimeout(() => {
    getToken();
}, 500);
// ------------------------------------------------
//
// Show & hide setup section
//
// ------------------------------------------------
setupHeader.addEventListener('click', () => {
    setupSection.classList.toggle('hidden');
    setupSection.classList.toggle('up');
});

// ------------------------------------------------
//
// Upload img & Get results actions
//
// ------------------------------------------------
const uploadImgButton = document.getElementById('upload-img-btn');
const getResultsButton = document.getElementById('get-results-btn');

uploadImgButton.addEventListener('click', (e) => {
    e.preventDefault();
    uploadInput.click();
});

getResultsButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (!imgFile) {
        return;
    }
    uploadImage(resultCanvas, imgFile.name);
});


// ------------------------------------------------
//
// Drag & drop files
//
// ------------------------------------------------

function handleDroppedFile(e) {
    e.preventDefault();
    if (!isLoading) {
        saveFormdata();
        let files = extractFiles(e.dataTransfer);
        imgFile = null;
        if (files.length > 0) {
            imgFile = files[0];
            updateImage(imgFile, () => {
                getResultsButton.disabled = false;
            });
            imagePreview.classList.add('uploaded');
            getResultsButton.disabled = true;
        }
    }
    cleanupDragData(e.dataTransfer);
    return false;
}

function handleFileUpload(e) {
    let reader = new FileReader();
    let file = this.files[0];
    if (!file || Object.is(file, imgFile)) {
        return;
    }
    let timeout = setTimeout(() => {
        alert('FileReader not functioning');
    }, 500);
    imgFile = null;
    reader.onload = () => {
        clearTimeout(timeout);
        imgFile = file;
        updateImage(file, () => {
            getResultsButton.disabled = false;
        });
        imagePreview.classList.add('uploaded');
        getResultsButton.disabled = true;
    };
    reader.readAsDataURL(file);
}

function handleDragEnter(e) {
    e.preventDefault();
    return true;
}

const dropIcon = document.getElementById('drop-icon');
function handleDragOver(e) {
    e.preventDefault();
    if (!isLoading) {
        dropIcon.classList.add('uploaded');
    }
    return true;
}

function handleDragLeave(e) {
    e.preventDefault();
    return true;
}

function extractFiles(dataTransfer) {
    let files = [], i;
    if (dataTransfer.items) {
        for (i = 0; i < dataTransfer.items.length; i++) {
            if (dataTransfer.items[i].kind === 'file') {
                let file = dataTransfer.items[i].getAsFile();
                files.push(file);
            }
        }
    } else {
        for (i = 0; i < dataTransfer.files.length; i++) {
            files.push(dataTransfer.files[i]);
        }
    }
    return files;
}

function cleanupDragData(dataTransfer) {
    if (dataTransfer.items) {
        dataTransfer.items.clear();
    } else {
        dataTransfer.clearData();
    }
}

// ------------------------------------------------
//
// Layout actions
//
// ------------------------------------------------

const grayscaleButton = document.getElementById('grayscale-button');
const tiltButton = document.getElementById('tilt-button');
const invertButton = document.getElementById('invert-button');

let isGrayScaled = false;
let isTilted = false;
let isInverted = false;

const resetImage = () => {
    if (imgFile) {
        updateImage(imgFile, () => {
            getResultsButton.disabled = false;
        });
    }
}

grayscaleButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.classList.toggle('selected');
    isGrayScaled = !isGrayScaled;
    localStorage.setItem('grayscale-input', isGrayScaled);
    resetImage();
});

tiltButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.classList.toggle('selected');
    isTilted = !isTilted;
    localStorage.setItem('rotate-input',isTilted);
    resetImage();
});

invertButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.classList.toggle('selected');
    isInverted = !isInverted;
    localStorage.setItem('rotate-input',isTilted);
    resetImage();
});

// ------------------------------------------------
//
// Persistence & session
//
// ------------------------------------------------

const imgParamName = document.getElementById('image-param-name');
const imgWidth = document.getElementById('input-width');
const imgHeight = document.getElementById('input-height');
function saveFormdata() {
    localStorage.setItem('token', token.value);
    localStorage.setItem('url', url.value);
    localStorage.setItem('image-param-name', imgParamName.value);
    localStorage.setItem('input-width', imgWidth.value);
    localStorage.setItem('input-height', imgHeight.value);
    localStorage.setItem('rotate-input',isTilted);
    localStorage.setItem('grayscale-input', isGrayScaled);
    localStorage.setItem('invert-input', isInverted);
}

function restoreFormdata() {
    token.value = localStorage.getItem('token') || '';
    url.value = localStorage.getItem('url') || '';
    imgParamName.value = localStorage.getItem('image-param-name') || '';
    imgWidth.value = localStorage.getItem('input-width') || '';
    imgHeight.value = localStorage.getItem('input-height') || '';
    tiltButton.classList.toggle('selected', localStorage.getItem('rotate-input') === 'true');
    grayscaleButton.classList.toggle('selected', localStorage.getItem('grayscale-input') === 'true');
    invertButton.classList.toggle('selected', localStorage.getItem('invert-input') === 'true');
}

// ------------------------------------------------
//
// Image manipulation
//
// ------------------------------------------------

function processCanvasData(canvasElement, processors) {
    let context = canvasElement.getContext('2d');
    let imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
    let data = imageData.data;
    let i, p;
    for (i = 0; i < data.length; i += 4) {
        for (p = 0; p < processors.length; p++) {
            processors[p](data, i);
        }
    }
    context.putImageData(imageData, 0, 0);
}

function invertProcessor(data, i) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
}

function grayscaleProcessor(data, i) {
    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
}

// ------------------------------------------------
//
// View & UI
//
// ------------------------------------------------


function renderImage(ctx, img, w, h, rotation) {
    let cw = ctx.canvas.width;
    let ch = ctx.canvas.height;
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, cw, ch);
    ctx.save();
    if (rotation != 0) {
        ctx.translate(cw * 0.5 , ch * 0.5);
        ctx.rotate(rotation);
        ctx.drawImage(img, - w * 0.5, -h * 0.5, w, h);
    } else {
        ctx.drawImage(img, (cw - w) * 0.5, (ch - h) * 0.5, w, h);
    }
    ctx.restore();
}

function updateImage(file, callback) {
    let canvasBig = document.getElementById('image-big');
    let canvasUpload = resultCanvas;
    let ctxBig = canvasBig.getContext('2d');
    let ctxUpload = canvasUpload.getContext('2d');
    let img = new Image;
    let imageWidth = imgWidth.value;
    let imageHeight = imgHeight.value;

    let canvasProcessors = [];
    if (isInverted) {
        canvasProcessors.push(invertProcessor);
    }
    if (isGrayScaled) {
        canvasProcessors.push(grayscaleProcessor);
    }


    img.src = URL.createObjectURL(file);
    img.onload = () => {
        if (!imageWidth || !imageHeight) {
          imageWidth = img.width;
          imageHeight = img.height;
        }
        canvasUpload.setAttribute('width', imageWidth);
        canvasUpload.setAttribute('height', imageHeight);
        let bigScale = Math.min(img.width, img.height);
        bigScale = Math.min(320 / bigScale, 1);
        let w = img.width * bigScale;
        let h = img.height * bigScale;
        let rotation = isTilted ? Math.PI * 0.5 : 0;

        renderImage(ctxBig, img, w, h, rotation);
        renderImage(ctxUpload, img, imageWidth, imageHeight, rotation);

        if (canvasProcessors.length > 0) {
            processCanvasData(canvasUpload, canvasProcessors);
            processCanvasData(canvasBig, canvasProcessors);
        }

        callback();
    }
}

function printStatus(message, isResult) {
    resultPreview.classList.toggle('result', isResult);
    document.getElementById('result').textContent = message;
}

// ------------------------------------------------
//
// API interaction
//
// ------------------------------------------------

function extractResult(responseText) {
    // let label;
    // let maxLabel = '';
    // let maxVal = 0;
    // let json = JSON.parse(responseText);
    // let outer = Object.keys(json)[0];
    // let labels = json[outer];
    // for (label in labels) {
    //     if (labels[label] > maxVal) {
    //         maxLabel = label;
    //         maxVal = labels[label];
    //     }
    // }
    // return maxLabel;

    let json = JSON.parse(responseText);
    let top = json.result[0];
    let html = 'Label=' + top.label + ', Score=' + top.score;
    return html
}

function postForm(token, params) {
    let xhr = new XMLHttpRequest();
    isLoading = true;
    xhr.open('POST', url.value, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.onreadystatechange = () => {
        isLoading = false;
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.responseText);
            let maxLabel = extractResult(xhr.responseText);
            printStatus(maxLabel, true);
        } else {
            printStatus('Oops, an error occurred (' + xhr.status + ')');
        }
    };

    let formData = new FormData();
    let p;
    for (p in params) {
        formData.append.apply(formData, [p].concat(params[p]));
    }
    printStatus('Quering API...');
    xhr.send(formData);
}

function uploadImage(canvasElement, filename) {
    return  canvasElement.toBlob((blob) => {
        let imageField = imgParamName.value;
        let typedBlob = blob.slice(0, blob.size, 'application/octet-stream');
        let params = {
            // token: [token.value]
        };
        params[imageField] = [typedBlob, filename.split('.')[0] + '.jpg'];
        postForm(token.value, params);
    }, 'image/jpeg', 100);
}

// ------------------------------------------------
//
// Main & startup
//
// ------------------------------------------------


window.addEventListener('drop', handleDroppedFile, false);
window.addEventListener('dragenter', handleDragEnter, false);
window.addEventListener('dragover', handleDragOver, false);
window.addEventListener('dragenter', handleDragLeave, false);
uploadInput.addEventListener('change', handleFileUpload, false);
restoreFormdata();
