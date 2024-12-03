function submitForm(event){
    event.preventDefault();
    const URL = 'https://prod-30.centralindia.logic.azure.com:443/workflows/60847960349f4deebdbb8e59ebe6c629/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-WevHSR0PbtfOYaAWwlEVP3MXqgh3mzWrpmNZgNxioA';
    const formData = new FormData(event.target);
    const data = {
        //date: formData.get('date'),
        coil: formData.get('coil'),
        location: formData.get('location'),
        user: formData.get('users')
    };
    console.log(data);
    clearForm();
    fetch(URL, {method: 'POST',headers: {'Content-Type':'application/json'},body: JSON.stringify(data)})
    .then(response=>{console.log('Response:', response);alert('Coil location updated');})
    .catch(error => {console.error('Error:', error);alert('Error submitting data');});
}
function clearForm() {document.getElementById('form').reset();}

function processImage(imageSrc, callback) {
    const img = new Image();
    img.src = imageSrc;
    img.onload = function() {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {callback(code.data);} 
        else {callback(null);}
        
    }
}

function scanQRCode_jsQR(fileInputId, textInputId) {
    const fileInput = document.getElementById(fileInputId);
    const textInput = document.getElementById(textInputId);
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload=function(e){
            processImage(e.target.result, function(decodedText){
                if (decodedText){textInput.value = decodedText;}
                else{alert('No QR code found.');}
            });
        };
        reader.readAsDataURL(file);
    }
    else{alert('No file selected.');}
}
function scanQRCode_API(fileInputId, textInputId){
    const fileInput = document.getElementById(fileInputId);
    const textInput = document.getElementById(textInputId);
    const qrcodeURL = 'http://api.qrserver.com/v1/read-qr-code/';
    const qrcodeForm = new FormData();
    qrcodeForm.append('file', file);
    fetch(qrcodeURL,{method:'POST',body:qrcodeForm})
    .then(response=>response.json())   
    .then(data=>{
        console.log('response',data);
        textInput.value = String(data[0]['symbol'][0]['data']);})
    .then(error=>{console.log('error:',error);});
}
function scanQRCode(textInputId){
    const textInput = document.getElementById(textInputId);
    html5QrcodeScanner.render(
        (decodedText, decodedResult)=>{textInput.value=decodedText;html5QrcodeScanner.clear();},
        error=>console.warn(`Code scan error = ${error}`)
        ); 
}

    document.getElementById('form').addEventListener('submit',submitForm);
    let html5QrcodeScanner = new Html5QrcodeScanner("reader",{ fps: 10, qrbox: {width: 250, height: 250} },/* verbose= */ true);
