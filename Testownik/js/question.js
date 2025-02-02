export class QNumber {
    constructor(num) {
        if (Number.isInteger(num))
            this.number = num;
        else
            throw new Error(`${num} to nie jest właściwy numer polecenia.`);
    }
}

export class QType {
    constructor(t) {
        const accepted = ["J", "W", "P", "L", "O"];

        if (accepted.includes(t))
            this.type = t;
        else
            throw new Error(`Niezdefiniowany typ pytania: ${t}. Akceptowane: ["J", "W", "P", "L", "O"]`);
    }
}

export class Link {
    constructor(text) {
        this.text = text;
    }
}

export class Answer {
    constructor(id, text) {
        const accepted = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

        if (id.length != 1 || !accepted.includes(id))
            throw new Error(`Złe id odpowiedzi: ${id}`);
        else
            this.id = id;

        this.text = text;
    }
}

export class Good {
    constructor(id) {
        const accepted = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

        if (id.length != 1 || !accepted.includes(id))
            throw new Error(`Złe id odpowiedzi: ${id}`);
        else
            this.id = id;
    }
}

export class Question {
    constructor(number, text, type, links, answers, good) {
        this.number = number;
        this.text = text;
        this.type = type;
        this.links = links;
        this.answers = answers;
        this.good = good;

        this.answersIds = [];

        this.#validateAnswers();
        this.#createHTMLElements();
    }

    getAnswers() {
        const t = this.type.type;
        const answered = [];

        if (t === "J" || t === 'W' || t === "P") {
            this.answersIds.forEach(a => {
                const elem = document.getElementById(a);
                const checked = elem.checked;

                if (checked) {
                    const label = document.getElementById(`${a}-label`);
                    const text = label.innerText;
                    answered.push(text);
                }     
            });
        }
        else if (t === "L" ){
            this.answersIds.forEach(a => {
                const elem = document.getElementById(a);
                const text = elem.value;
                answered.push(text);
            });
        }
        else {
            const elem = document.getElementById(`ans-${this.number.number}-a`);
            const value = elem.value;            
            answered.push(value);
        }

        return answered;
    }

    showSolution() {
        this.correctContainer.style.display = 'block';
    }

    #validateAnswers() {
        const all = [];
        const good = [];

        this.answers.forEach(e => {
            all.push(e.id);
        });

        this.good.forEach(e => {
            good.push(e.id);
        });

        good.forEach(g => {
            if (!all.includes(g)) {
                throw new Error("Dobre odpowiedzi zawierają nieistniejące.");
            }
        });
    }

    #createHTMLElements() {
        this.mainContainer = document.createElement('div');     
        this.mainContainer.id = `question-${this.number.number}`;

        this.numberContainer = document.createElement('div');
        this.numberContainer.className = 'question-number';
        this.numberContainer.innerText = this.number.number;

        this.textContainer = document.createElement('div');
        this.textContainer.className = 'question-text';
        
        if (this.type.type === 'L') {
            let goodIndex = 0;
            let htmlText = "";
            
            for (let i = 0; i < this.text.length; i++) {
                let check = this.text[i];

                if (check === '_') {
                    let id = `ans-${this.number.number}-${this.answers[goodIndex].id}`;
                    goodIndex++;

                    this.answersIds.push(id);                   

                    const span = document.createElement('span');
                    span.innerText = htmlText;
                    this.textContainer.appendChild(span);
                    htmlText = "";

                    const elem = document.createElement('input');
                    elem.type = 'text';
                    elem.placeholder = 'uzupełnij...';
                    elem.id = id;
                    elem.className = 'text-input';                   

                    this.textContainer.appendChild(elem);
                }
                else {
                    htmlText += check;
                }
            }

            const span = document.createElement('span');
            span.innerText = htmlText;

            this.textContainer.appendChild(span);
        }
        else if (this.type.type === "O") {
            const span = document.createElement('span');
            span.innerText = this.text;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'odpowiedź...';
            input.id = `ans-${this.number.number}-a`;
            input.className = 'long-text-input';

            this.textContainer.appendChild(span);
            this.textContainer.appendChild(document.createElement('br'));
            this.textContainer.appendChild(input);         
        }
        else {
            this.textContainer.innerHTML = this.text;
        }

        this.linksContainer = document.createElement('div');    

        this.links.forEach(l => {
            if (l.text !== '') {
                let element = document.createElement('img');
                element.src = l.text;
                element.className = "link-image";
                element.alt = 'obrazek';

                this.linksContainer.appendChild(element);                 
            }            
        });

        this.answersContainer = document.createElement('div');
        this.answersContainer.id = `question-${this.number.number}-ans`;

        if (this.type.type === "J" || this.type.type === "P" || this.type.type === "W") {
            this.answers.forEach(a => {
                let id = `ans-${this.number.number}-${a.id}`;
                this.answersIds.push(id);
    
                let label = document.createElement('label');
                    label.for = id;
                    label.innerText = a.text;
                    label.id = `${id}-label`;
    
                if (this.type.type === "J" || this.type.type === "P") {
                    let radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = `ans-${this.number.number}`;
                    radio.id = id;
    
                    this.answersContainer.appendChild(radio);                
                }
                else if (this.type.type === "W") {
                    let checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.id = id;
    
                    this.answersContainer.appendChild(checkbox);
                }
    
                this.answersContainer.appendChild(label);
                this.answersContainer.appendChild(document.createElement('br'));
            });
        }        

        this.correctContainer = document.createElement('div');
        this.correctContainer.style.display = 'none';

        if (this.good.length === 0)
            this.correctContainer.innerText = "Poprawne: brak";
        else if (this.good.length === 1)
            this.correctContainer.innerText = "Poprawna: ";
        else
            this.correctContainer.innerText = "Poprawne: ";
        
        if (this.type.type === "J" || this.type.type === "W" || this.type.type === "P") {
            this.answers.forEach(a => {
                const id = a.id;
                const goodIds = [];

                this.good.forEach(g => {
                    goodIds.push(g.id);
                });

                if (goodIds.includes(id))
                    this.correctContainer.innerText += `${a.id}, `;
            });

            this.correctContainer.innerText = this.correctContainer.innerText
                .trim()
                .slice(0, -1);
        }
        else if (this.type.type === "L") {
            if (this.answers.length === 1)
                this.correctContainer.innerText = "Poprawna: ";
            else
                this.correctContainer.innerText = "Poprawne: ";

            this.answers.forEach(a => {
                this.correctContainer.innerText += `${a.text}, `;
            });

            this.correctContainer.innerText = this.correctContainer.innerText
                .trim()
                .slice(0, -1);
        }
        else if (this.type.type === "O") {
            this.correctContainer.innerText += this.answers[0].text;
        }        

        this.numberTextContainer = document.createElement('div');
        this.numberTextContainer.appendChild(this.numberContainer);
        this.numberTextContainer.appendChild(this.textContainer);

        this.mainContainer.appendChild(this.numberTextContainer);
        this.mainContainer.appendChild(this.linksContainer);
        this.mainContainer.appendChild(this.answersContainer);
        this.mainContainer.appendChild(this.correctContainer);
        this.mainContainer.appendChild(document.createElement('hr'));
    }    
}

export class Test {
    constructor(lines) {
        this.questions = [];
        this.allGood = [];

        this.submitButton = document.createElement('input');
        this.submitButton.type = 'button';
        this.submitButton.value = 'Sprawdź';
        this.submitButton.onclick = (() => this.check());

        this.reloadButton = document.createElement('input');
        this.reloadButton.type = 'button';
        this.reloadButton.value = 'Wyjdź';
        this.reloadButton.onclick = (() => location.reload());

        this.resultBox = document.createElement('div');

        this.#parseLines(lines);
    }

    check() {
        const maxPoints = this.questions.length;
        let curPoints = 0;

        this.questions.forEach(q => {
            const ans = q.getAnswers(); // Działa
            const goodValues = []; // Nie działa

            q.answers.forEach(a => {
                const goodIds = [];

                q.good.forEach(g => {
                    goodIds.push(g.id);
                })

                if (goodIds.includes(a.id)) {
                    goodValues.push(a.text);
                }
            });

            let hasGood = false;
            let goodCount = 0;

            for (let i = 0; i < ans.length; i++) {
                const current = ans[i];

                if (goodValues.includes(current)) {
                    goodCount++;

                    if (goodCount === goodValues.length || (['P', 'J'].includes(q.type.type) && goodCount === 1)) {
                        hasGood = true;
                        break;
                    }                    
                }
            }

            if (hasGood) {
                curPoints++;
                q.textContainer.classList.add("correct");
                q.textContainer.classList.remove("incorrect");
            }
            else {
                q.textContainer.classList.add("incorrect");
                q.textContainer.classList.remove("correct");
            }
        });

        this.resultBox.innerText = `Wynik: ${curPoints}/${maxPoints} (${curPoints / maxPoints * 100}%)`
        this.#showSolution();
    }    

    #showSolution() {
        this.questions.forEach(q => {
            q.showSolution();
        });
    }

    #parseLines(lines) {
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
                    links.push(new Link(link));
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

        this.questions = questions;
    }
}




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