import {readFile} from "./fileLoading.js";

const fileInput = document.getElementById('file-input');
const container = document.getElementById('container');

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        readFile(file).then(function(lines) {
            console.log(lines); // Co wsm robimy przy czytaniu pliku XD
        }).catch(function(error) {
            console.error(error); // Może jakieś inne informowanie...
        });
    }        
});

