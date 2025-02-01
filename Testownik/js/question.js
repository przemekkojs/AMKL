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

        this.#checkAnswers();
        this.#createHTMLElements();
    }

    #checkAnswers() {
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
                throw new Error("Dobre odpowiedzi zawierają nieistniejące");
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

        const acceptable = [];

        this.answers.forEach(a => {
            acceptable.push(a.id);
        })

        if (this.type === 'L') {
            const gaps = [];
            const gapTextsIds = [];
            const htmlText = "";
            
            for (let i = 0; i < this.text.length - 2; i++) {
                let open = this.text[i];
                let sign = this.text[i + 1];
                let close = this.text[i + 2];

                if (open === '^') {
                    if (close !== '^')
                        throw new Error('Niewłaściwe formatowanie pytania z luką.');
                    else if (!acceptable.includes(sign))
                        throw new Error('Niewłaściwe powiązanie pytań i odpowiedzi');

                    gaps.push(sign);
                    
                    let id = `gap-${this.number.number}-${sign}`;
                    gapTextsIds.push(id);
                    htmlText += ` <input type="text" placeholder="uzupełnij..." id="gap-${this.number.number}-${sign}" `;
                }
                else {
                    htmlText += open;
                }
            }

            this.gapTextsIds = gapTextsIds;
            this.textContainer.innerHTML = htmlText;
        }
        else {
            this.textContainer.innerText = this.text
        }

        this.linksContainer = document.createElement('div');        
        this.links.forEach(l => {
            let element = document.createElement('img');
            element.src = l.text;
            element.className = "link-image";
            this.linksContainer.appendChild(element);
        });

        this.answersContainer = document.createElement('div');
        this.answersContainer.id = `question-${this.number.number}-ans`;

        this.answers.forEach(a => {
            let id = `ans-${this.number.number}-${a.id}`;

            if (this.type.type === "J" || this.type.type === "P") {
                let label = document.createElement('label');
                label.for = id;
                label.innerText = a.text;

                let radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `ans-${this.number.number}`;
                radio.id = id;

                this.answersContainer.appendChild(radio);
                this.answersContainer.appendChild(label);
                this.answersContainer.appendChild(document.createElement('br'));
            }
            else if (this.type.type === "W") {                
                let label = document.createElement('label');
                label.for = id;
                label.innerText = a.text;

                let checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = id;

                this.answersContainer.appendChild(checkbox);
                this.answersContainer.appendChild(label);
                this.answersContainer.appendChild(document.createElement('br'));
            }
            else if (this.type.type === 'L') {
                // TODO
            }
            else { // O
                // TODO
            }     
        });

        this.correctContainer = document.createElement('div');
        this.correctContainer.style.display = 'none';
        
        if (this.type.type === "J" || this.type.type === "W" || this.type.type === "P") {
            this.correctContainer.innerText = "Poprawne: ";

            this.answers.forEach(a => {
                this.correctContainer.innerText += `${a.id}, `;
            });
        }
        else if (this.type.type === "L") {
            this.correctContainer.innerText = "Poprawne: ";

            this.answers.forEach(a => {
                this.correctContainer.innerText += `${a.text}, `;
            });
        }
        else if (this.type.type === "O") {
            this.correctContainer.innerText = this.answers[0].text;
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

    showSolution() {
        this.correctContainer.style.display = 'block';
    }
}