import { readFile } from "./fileLoading.js";
import { Test } from "./question.js";

const fileInput = document.getElementById('file-input');
const container = document.getElementById('container');
const description = document.getElementById('description');
const errors = document.getElementById('errors');

fileInput.addEventListener('change', function(event) {    
    const file = event.target.files[0];

    if (file) {
        try {
            readFile(file).then(function(lines) {
                const test = new Test(lines);

                description.style.display = 'none';
                errors.innerHTML = "";
                container.style.display = 'block';

                test.questions.forEach(q => {
                    container.appendChild(q.mainContainer);
                });

                container.appendChild(test.submitButton);
                container.appendChild(test.reloadButton);
                container.appendChild(test.resultBox);
            })
            .catch(function(error) {
                errors.innerHTML = `<p>Coś poszło nie tak... spróbuj ponownie!<br/>Treść błędu: ${error}</p>`;
                console.error(error);
            });
        }
        catch (error) {
            errors.innerHTML = `<p>Coś poszło nie tak... spróbuj ponownie!<br/>Treść błędu: ${error}</p>`;
            console.error(error);
        }    
    }        
});

