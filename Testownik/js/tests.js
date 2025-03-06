const container = document.getElementById('container');
const files = [];

const filterButton = document.getElementById('filter-button');
filterButton.onclick = () => filter();

const found = document.getElementById('found');

fetch("tests/files.json")
.then(response => response.json())
.then(data => {
    data.files.forEach(file => {
        const element = document.createElement('a');
        element.href = `https://przemekkojs.github.io/AMKL/Testownik/tests/${file}`;
        element.download = true;
        element.innerText = file;

        container.appendChild(element);
        container.appendChild(document.createElement('br'));

        files.push(file);
    });

    found.innerText = `Znaleziono: ${files.length} wyników`;
})
.catch(error => console.error("Error:", error));

export function filter() {
    const textBox = document.getElementById('text-box');
    const value = textBox.value.trim();
    let filtered = [];

    if (value === "") {
        filtered = files;
    }
    else {
        files.forEach(file => {
            if (file.includes(value))
                filtered.push(file);
        });
    }

    container.replaceChildren();

    filtered.forEach(file => {
        const element = document.createElement('a');
        element.href = `https://przemekkojs.github.io/AMKL/Testownik/tests/${file}`;
        element.download = file;
        element.innerText = file;

        container.appendChild(element);
        container.appendChild(document.createElement('br'));
    });

    found.innerText = `Znaleziono: ${filtered.length} wyników`;
}