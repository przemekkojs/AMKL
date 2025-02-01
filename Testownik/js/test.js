import { readFile } from "./fileLoading.js";
import { QNumber, Question, QType, Answer, Good, Link } from "./question.js";

const fileInput = document.getElementById('file-input');
const container = document.getElementById('container');
const description = document.getElementById('description');
const errors = document.getElementById('errors');

function isNewQuestion(line) {
    const accepted = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i = 0; i < accepted.length; i++) {
        var toCheck = accepted[i];

        if (line[0] === toCheck)
            return true;
    }

    return false;
}

function isNewAnswer(line) {
    return (line[0] === '(');
}

function isNewGood(line) {
    return (line[0] === '{');
}

function isNewLink(line) {
    return (line[0] === '<');
}

function isNewText(line) {
    return (line.length > 0);
}

fileInput.addEventListener('change', function(event) {    
    const file = event.target.files[0];

    if (file) {
        try {
            readFile(file).then(function(lines) {
                const firstLine = lines[0].trim();

                let answers = [];
                let good = [];
                let links = [];
                let text = "";
                let num = Number(firstLine.split('.')[0]);
                let type = firstLine.split('[')[1][0];
                const questions = []; //TEGO NIE MODYFIKOWAĆ                

                lines.forEach(l => {
                    const line = l.trim();

                    if (isNewQuestion(line)) { // Tu sprawdzamy, czy jest nowe pytanie - jak tak, to dodajemy poprzednie do listy.
                        if (line !== firstLine) {
                            if (answers.length === 0 || (good.length === 0 && type !== 'L')) {
                                throw new Error('Niewłaściwy format pliku.');
                            }

                            questions.push(new Question(
                                new QNumber(num),
                                text,
                                new QType(type),
                                links, answers, good
                            ));

                            // Reset pól
                            num = Number(line.split('.')[0]); // Parsowanie numeru
                            type = line.split('[')[1][0]; // Parsowanie typu pytania                            
                            answers = [];
                            good = [];
                            links = [];
                            text = "";
                        }          
                    }
                    else if (isNewLink(line)) {
                        const trimmed = line.substring(1, line.length - 1);
                        const linksSplitted = trimmed.split(' ');

                        linksSplitted.forEach(link => {
                            linksSplitted.push(new Link(link));
                        });
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
                        const ids = trimmed.split(' '); 

                        ids.forEach(id => {
                            const g = new Good(id);
                            good.push(g);
                        });
                    }
                    else if (isNewText(line)) {
                        text += `${line} `;
                    }
                });

                if (answers.length === 0 || (good.length === 0 && type !== 'L')) {
                    throw new Error('Niewłaściwy format pliku.');
                }

                questions.push(new Question(
                    new QNumber(num),
                    text,
                    new QType(type),
                    links, answers, good
                ));
                
                if (questions.length === 0)
                    throw new Error('Pusty lub niewłaściwy plik');

                description.style.display = 'none';
                errors.innerHTML = "";
                container.style.display = 'block';

                questions.forEach(q => {
                    container.appendChild(q.mainContainer);
                    container.appendChild(document.createElement('hr'));
                });
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

