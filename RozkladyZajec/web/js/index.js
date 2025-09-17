const table = document.getElementById('main-table');
const detailsTable = document.getElementById('details-table');

const detailsIds = new Set();
const ids = new Set();

const processing = document.getElementById('processing');

let currentId = 0;
let detailId = 0;

function addDetail() {
    const curId = detailId;

    const id = document.createElement('input');
    id.setAttribute('type', 'text');
    id.id = `detail-id-${curId}`;
    id.readOnly = true;
    id.value = curId;

    const desc = document.createElement('input');
    desc.setAttribute('type', 'text');
    desc.id = `detail-desc-${curId}`;

    const removeButton = document.createElement('input');
    removeButton.setAttribute('type', 'button');
    removeButton.value = 'Usuń';
    removeButton.className = 'button remove-button';
    removeButton.addEventListener('click', () => removeDetail(curId));

    const row = document.createElement('tr');
    row.id = `detail-row-${curId}`;

    const id_td = document.createElement('td');
    id_td.appendChild(id);
    id_td.style = 'width: 10%';

    const desc_td = document.createElement('td');
    desc_td.appendChild(desc);
    desc_td.style = 'width: 75%';

    const removeButton_td = document.createElement('td');
    removeButton_td.appendChild(removeButton);
    removeButton_td.style = 'width: 15%';

    [id_td, desc_td, removeButton_td].forEach(element => {
        row.appendChild(element);
    })

    detailsTable.appendChild(row);

    detailsIds.add(curId);
    detailId++;

    updateDropdowns();
}

function updateDropdowns() {
    [...ids].forEach(element => {
        const id = `details-${element}`;

        const select = document.getElementById(id);
        const selectedValue = select.value;

        select.replaceChildren();
        
        const defaultOption = document.createElement('option');
        defaultOption.value = 'BRAK';
        defaultOption.innerText = 'BRAK';    
        select.appendChild(defaultOption)
        select.value = 'BRAK';

        detailsIds.forEach(detailId => {
            const option = document.createElement('option');
            option.value = detailId;
            option.innerText = detailId;
            select.appendChild(option);            

            if (String(detailId) === selectedValue) {
                select.value = detailId;
            }
        });
    });    
}

function removeDetail(id) {
    const row = document.getElementById(`detail-row-${id}`);

    if (row) {
        detailsTable.removeChild(row);
        detailsIds.delete(id);
        updateDropdowns();
    }    
}

function removeRow(id) {
    const row = document.getElementById(`row-${id}`);

    if (row) {
        table.removeChild(row);
        ids.delete(id);
    }        
}

function addRow() {
    const rowId = currentId;

    const subject = document.createElement('input');
    subject.setAttribute('type', 'text');
    subject.id = `subject-${rowId}`;

    const level = document.createElement('input');
    level.setAttribute('type', 'text');
    level.id = `level-${rowId}`;

    const teacher = document.createElement('input');
    teacher.setAttribute('type', 'text');
    teacher.id = `teacher-${rowId}`;

    const day = document.createElement('input');
    day.setAttribute('type', 'date');
    day.id = `day-${rowId}`;

    const startHour = document.createElement('input');
    startHour.setAttribute('type', 'time');
    startHour.id = `startHour-${rowId}`;

    const endHour = document.createElement('input');
    endHour.setAttribute('type', 'time');
    endHour.id = `endHour-${rowId}`;

    const room = document.createElement('input');
    room.setAttribute('type', 'text');
    room.id = `room-${rowId}`;

    const removeButton = document.createElement('input');
    removeButton.setAttribute('type', 'button');
    removeButton.id = `removeButton-${rowId}`;
    removeButton.value = 'Usuń';
    removeButton.className = 'button remove-button';
    removeButton.addEventListener('click', () => removeRow(rowId));

    const individual = document.createElement('input');
    individual.setAttribute('type', 'checkbox');
    individual.id = `individual-${rowId}`;

    const details = document.createElement('select');
    details.id = `details-${rowId}`;
    const defaultOption = document.createElement('option');
    defaultOption.value = 'BRAK';
    defaultOption.innerText = 'BRAK';    
    details.appendChild(defaultOption)

    detailsIds.forEach(detailId => {
        const option = document.createElement('option');
        option.value = detailId;
        option.innerText = detailId;
        details.appendChild(option);
    })

    const row = document.createElement('tr');
    row.id = `row-${rowId}`;
    
    [subject, level, teacher, day, startHour, endHour, room, individual, details, removeButton].forEach(element => {
        const td = document.createElement('td');
        td.appendChild(element);
        row.appendChild(td);
    });

    table.appendChild(row);

    ids.add(rowId);
    currentId++;
}

function save() {
    processing.innerText = 'Przetwarzanie...';

    try {
        const fields1 = ['subject', 'level', 'teacher', 'day', 'startHour', 'endHour', 'room', 'individual', 'details'];
        
        const result1 = [...ids].map(id => {
            const row = {};

            fields1.forEach(field => {
                if (field !== 'individual') {
                    row[field] = document.getElementById(`${field}-${id}`).value;
                }
                else {
                    row[field] = document.getElementById(`${field}-${id}`).checked;
                }
            });

            return row;
        });

        const fields2 = ['detail-id', 'detail-desc'];

        const result2 = [...detailsIds].map(id => {
            const row = {};

            fields2.forEach(field => {
                row[field] = document.getElementById(`${field}-${id}`).value;
            });

            return row;
        });

        const obj = {
            main: result1,
            details: result2
        }

        const resultJSON = JSON.stringify(obj);

        processing.innerText = 'Pobieranie...';

        const blob = new Blob([resultJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'plan.json';
        a.click();

        URL.revokeObjectURL(url);
        processing.innerText = 'Sukces!';
    } catch (ex) {
        processing.innerText = `Ups! Coś poszło nie tak...\n${ex}`;
    } finally {
        resetText();
    }
}

function resetText() {
    setTimeout(() => {
        processing.innerText = '';
    },
    3000);
}

function load() {
    if (!confirm("Czy na pewno chcesz załadować nowe dane? Wszelkie niezapisane zmiany zostaną utracone")) {
        return;
    }
}