import { readFile } from "./fileLoading.js";
import { QNumber, Question, Type, Answer, Good, Link } from "./question.js";

const fileInput = document.getElementById('file-input');
const container = document.getElementById('container');
const description = document.getElementById('description');
const errors = document.getElementById('errors');

function isNewQustion(line) {
    const accepted = ['1', '2', '3', '3', '5', '6', '7', '8', '9'];

    for (let i = 0; i < accepted.length; i++) {
        var toCheck = accepted[i];

        if (line.startsWith(toCheck))
            return true;
    }

    return false;
}

function isNewAnswer(line) {
    return (line.startsWith('('));
}

function isNewGood(line) {
    return (line.startsWith('{'));
}

function isNewLink(line) {
    return (line.startsWith('<'));
}

function isNewText(line) {
    return (line.length > 0);
}

fileInput.addEventListener('change', function(event) {    
    const file = event.target.files[0];

    if (file) {
        try {
            readFile(file).then(function(lines) {
                description.style.display = 'none';
                errors.innerText = "";
                container.style.display = 'block';
                
                let answers = [];
                let good = [];
                let links = [];
                let text = "";
                let num = 1;
                let type = "";
                const questions = []; //TEGO NIE MODYFIKOWAĆ

                lines.forEach(l => {
                    const line = l.trim();

                    if (isNewQustion(line)) { // Tu sprawdzamy, czy jest nowe pytanie - jak tak, to dodajemy poprzednie do listy.
                        if (questions.length > 0) {
                            if (answers.length === 0 || (good.length === 0 && type !== 'L')) {
                                errors.innerHTML = `<p>Coś poszło nie tak... spróbuj ponownie!</p>`;
                                return;
                            }

                            questions.push(new Question(
                                new QNumber(num),
                                text,
                                new Type(type),
                                links, answers, good
                            ));

                            // Reset pól
                            num = Number(line.split('.')[0]); // Parsowanie numeru
                            type = line.split('[')[1].split(']')[0]; // Parsowanie typu pytania
                            answers = [];
                            good = [];
                            links = [];
                            text = "";
                        }

                        // Jedziem z parsowaniem
                        if (isNewLink(line)) {
                            const trimmed = line.substring(1, line.length - 1);
                            const links = line.split(' ');

                            links.forEach(link => {
                                links.push(new Link(link));
                            });
                        }
                        else if (isNewText(line)) {
                            text += `${line} `;
                        }
                        else if (isNewAnswer(line)) {
                            const id = line
                                .substring(1) // bez '('
                                .split(')')[0];

                            const text = line
                                .split(')')[1]
                                .trim();

                            const ans = new Answer(id, text);
                            answers.push(ans);
                        }
                        else if (isNewGood(line)) {
                            const trimmed = line.substring(1, line.length - 1);
                            const ids = line.split(' '); 

                            ids.forEach(id => {
                                const g = new Good(id);
                                good.push(g);
                            });
                        }                        

                        // W innym wypadku mamy pustą linię i ją pomijamy.
                    }
                });

                if (answers.length === 0 || (good.length === 0 && type !== 'L')) {
                    errors.innerHTML = `<p>Coś poszło nie tak... spróbuj ponownie!</p>`;
                    return;
                }

                questions.push(new Question(
                    new QNumber(num),
                    text,
                    new Type(type),
                    links, answers, good
                ));
            })
            .catch(function(error) {
                errors.innerText = "<p>Coś poszło nie tak... spróbuj ponownie!</p><p>Treść błędu: ${error}</p>";
                console.error(error);
            });
        }
        catch (error) {
            errors.innerHTML = `<p>Coś poszło nie tak... spróbuj ponownie!</p><p>Treść błędu: ${error}</p>`;
            console.error(error);
        }        
    }        
});

