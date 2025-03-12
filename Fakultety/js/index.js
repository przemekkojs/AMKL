// This script contains the main logic of the program

class row {
    constructor(course_name, suggested_learning_stage, teacher, place_limit, course_type, test_type, hours_winter, hours_summer, ects_winter, ects_summer, ects_combined, faculty, faculty_name, weekday, start_hour, end_hour, room, additional_pass_info, additional_info, semester="") {
        this.attributes = {
            'Course Name': course_name.trim(),
            'Suggested Learning Stage': suggested_learning_stage.trim(),
            'Teacher': teacher.trim(),
            'Place Limit': place_limit.trim(),
            'Course Type': course_type.trim(),
            'Test Type': test_type.trim(),
            'Hours Winter': hours_winter.trim(),
            'Hours Summer': hours_summer.trim(),
            'ECTS Winter': ects_winter.trim(),
            'ECTS Summer': ects_summer.trim(),
            'ECTS Combined': ects_combined.trim(),
            'Faculty': faculty.trim(),
            'Faculty Name': faculty_name.trim(),
            'Weekday' : weekday.trim(),
            'Start Hour': start_hour.trim(),
            'End Hour': end_hour.trim(),
            'Room': room.trim(),
            'Additional Pass Info': additional_pass_info.trim(),
            'Additional Info': additional_info.trim(),
            'Semester' : semester.trim()
        }

        this.correctAttributes()
    }

    correctAttributes() {
        if (this.attributes['Start Hour'].length > 5)
            this.attributes['Start Hour'] = "-";

        if (this.attributes['End Hour'].length > 5)
            this.attributes['End Hour'] = "-";
    }

    listAttributes() {
        let values = Object.keys(this.attributes).map(function(key) {
            return this.attributes[key];
        });

        return values;
    }

    queryString() {
        return new URLSearchParams(this.attributes).toString();
    }
}

function readOneRow(content) {
    try {
        return readOneRowNew(content);
    }
    catch (err) {
        try {
            return readOneRowOld(content);
        }
        catch (err) {
            console.error(err);
        }
    }
}

function readOneRowNew(content) {
    const splittedContent = content.split('\t');
    const contentLength = splittedContent.length;

    if (contentLength < 19 || contentLength > 20)
        throw new Error(`Error parsing row ${content}`);

    let semester = contentLength === 19 ? "" : splittedContent[19];

    return new row(
        splittedContent[0],
        splittedContent[1],
        splittedContent[2],
        splittedContent[3],
        splittedContent[4],
        splittedContent[5],
        splittedContent[6],
        splittedContent[7],
        splittedContent[8],
        splittedContent[9],
        splittedContent[10],
        splittedContent[11],
        splittedContent[12],
        splittedContent[13],
        splittedContent[14],
        splittedContent[15],
        splittedContent[16],
        splittedContent[17],
        splittedContent[18],
        semester
    );
}

function readOneRowOld(content) {
    let splittedContent = content.split(';');
        
    if (splittedContent.length < 14) {
        throw new Error(`Error parsing row ${content}`);
    }

    let clusteredInfo = splittedContent[13];
    
    let addInfo = "";
    let addPassInfo = "";
    let startHour = "";
    let endHour = "";
    let room = "";
    let weekday = "";
    let result;

    if (splittedContent.length == 15) {
        addInfo = splittedContent[14];
    }
    else {
        addInfo = "";
    }

    if (clusteredInfo.length > 0) {
        clusteredInfoSplitted = clusteredInfo.split(',');

        if (clusteredInfoSplitted.length < 3) {
            addPassInfo = clusteredInfo;
        }
        else {
            weekday = clusteredInfoSplitted[0];
            let time = clusteredInfoSplitted[1].split('-');
            room = clusteredInfoSplitted[2];

            if (time.length != 2) {
                startHour = "?????";
                endHour = "?????";
            }
            else {
                startHour = time[0].replace(".", ":");
                endHour = time[1].replace(".", ":");
            }

            if (clusteredInfoSplitted.length == 3) {
                addPassInfo = "";
            }
            else if (clusteredInfoSplitted.length == 4) {
                addPassInfo = clusteredInfoSplitted[3];
                room = clusteredInfoSplitted[2];
            }
            else {
                addPassInfo = "";

                clusteredInfoSplitted.forEach(item => {
                    addPassInfo += item.trim() + " ";
                });
            }           
        }

        result = new row(
            splittedContent[0],
            splittedContent[1],
            splittedContent[2],
            splittedContent[3],
            splittedContent[4],
            splittedContent[5],
            splittedContent[6],
            splittedContent[7],
            splittedContent[8],
            splittedContent[9],
            splittedContent[10],
            splittedContent[11],
            splittedContent[12],
            weekday,
            startHour,
            endHour,
            room,
            addPassInfo,
            addInfo
        )
    }
    else {
        result = new row(
            splittedContent[0],
            splittedContent[1],
            splittedContent[2],
            splittedContent[3],
            splittedContent[4],
            splittedContent[5],
            splittedContent[6],
            splittedContent[7],
            splittedContent[8],
            splittedContent[9],
            splittedContent[10],
            splittedContent[11],
            splittedContent[12],
            weekday,
            startHour,
            endHour,
            room,
            "",
            addInfo
        )
    }
    
    return result;
}

async function readAllRows() {
    const result = [];

    try {
        const filename = localStorage.getItem('filename');

        if (!filename || filename === "") {
            const currentPath = window.location.pathname;
            const newPath = currentPath.replace("index.html", "loadDb.html");
            window.location.replace(newPath);
        }

        const res = await fetch(`js/resources/${filename}`);
        const text = await res.text();

        const lines = text.split(/\r\n|\n/);
        let firstLine = true;

        lines.forEach(line => {
            if (!firstLine) {
                const parsed = readOneRow(line);
                result.push(parsed);
            }
            else {
                firstLine = false;
            }            
        });
    }
    catch (e) {
        console.error(e);
    }    

    return result;
}

function createTmp(query) {
    const params = new URLSearchParams(query);
    const parsed = Object.fromEntries(params.entries());

    localStorage.setItem('row', encodeURIComponent(JSON.stringify(parsed)));
}

function filterContains(list, column, value) {
    const resultList = [];

    list.forEach(r => {
        if (r.attributes[column].toLowerCase().includes(value.toLowerCase())) {
            resultList.push(r);
        }
    });

    return resultList;
}

function filterEqual(list, column, value) {
    const resultList = [];

    list.forEach(r => {
        if (r.attributes[column].toLowerCase() === value.toLowerCase()) {
            resultList.push(r);
        }
    });

    return resultList;
}

function filterGreaterEqualThan(list, column, value) {
    const resultList = [];

    list.forEach(r => {
        if (r.attributes[column].toLowerCase() >= value.toLowerCase()) {
            resultList.push(r);
        }
    });

    return resultList;
}

function filterLowerEqualThan(list, column, value) {
    const resultList = [];

    list.forEach(r => {
        if (r.attributes[column].toLowerCase() <= value.toLowerCase()) {
            resultList.push(r);
        }
    });

    return resultList;
}

function getDistinctColumnValues(list, column) {
    const resultList = [];

    list.forEach(r => {
        if (!resultList.includes(r.attributes[column])) {
            resultList.push(r.attributes[column]);
        }
    });

    return resultList;
}

function resultsForm(rowsLength) {
    const opt1 = 'wyniki';
    const opt2 = 'wyników';
    const opt3 = 'wynik';
    const lengthStr = rowsLength.toString();

    if (lengthStr === '' || lengthStr === '1')
        return opt3;
    
    const last = lengthStr[lengthStr.length - 1];   

    switch (last) {
        case '0':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            return opt2;
        case '1':
        case '2':
        case '3':
        case '4':
            return opt1;
    }
}

function createTable(rows) {
    const rowsLength = rows.length;

    let content = `
        <div>
            <div style="text-align:left; margin: 5px; color: red;">
                Znaleziono ${rowsLength} ${resultsForm(rowsLength)}
            </div>

            <table>
                <tbody>
                    <tr>
                        <th>Nazwa kursu</th>
                        <th>Prowadzący</th>
                        <th>Dzień tygodnia</th>
                        <th>Godzina rozpoczęcia</th>
                        <th>Godzina zakończenia</th>
                        <th>ECTS Łącznie</th>
                    </tr>
    `;

    rows.forEach(r => {
        content += `
                    <tr>
                        <td><a href="details.html" target="_blank" onclick="createTmp('${r.queryString()}')">${r.attributes["Course Name"]}</a></td>
                        <td>${r.attributes["Teacher"]}</td>
                        <td>${r.attributes["Weekday"]}</td>
                        <td>${r.attributes["Start Hour"]}</td>
                        <td>${r.attributes["End Hour"]}</td>
                        <td>${r.attributes["ECTS Combined"]}</td>
                    </tr>
        `
    });

    content += `
                </tbody>
            <table>
        <div>
    `

    document.getElementById('content').innerHTML = content;        
}

function populateForm(rows) {
    const facultyDropdownOptions = getDistinctColumnValues(rows, 'Faculty');
    const facultyNameDropdownOptions = getDistinctColumnValues(rows, 'Faculty Name');
    const suggestedLearningStageDropdownOptions = getDistinctColumnValues(rows, 'Suggested Learning Stage');
    const weekdayDropdownOptions = getDistinctColumnValues(rows, 'Weekday');
    const semesterDropdownValues = getDistinctColumnValues(rows, 'Semester');

    const facultyDropdown = document.getElementById('Faculty');
    const facultyNameDropdown = document.getElementById('Faculty Name');
    const suggestedLearningStageDropdown = document.getElementById('Suggested Learning Stage');
    const weekdayDropdown = document.getElementById('Weekday');
    const semesterDropdown = document.getElementById('Semester');

    facultyDropdown.innerHTML = '<option value=""></option>';
    facultyNameDropdown.innerHTML = '<option value=""></option>';
    suggestedLearningStageDropdown.innerHTML = '<option value=""></option>';
    weekdayDropdown.innerHTML = '<option value=""></option>';
    semesterDropdown.innerHTML = '<option value=""></option>';

    facultyDropdownOptions.forEach(option => {
        if (option !== "") {
            let opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            facultyDropdown.append(opt);
        }        
    });

    facultyNameDropdownOptions.forEach(option => {
        if (option !== "") {
            let opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            facultyNameDropdown.append(opt);
        }        
    });

    suggestedLearningStageDropdownOptions.forEach(option => {
        if (option !== "") {
            let opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            suggestedLearningStageDropdown.append(opt);
        }        
    });

    weekdayDropdownOptions.forEach(option => {
        if (option !== "") {
            let opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            weekdayDropdown.append(opt);
        }        
    });

    semesterDropdownValues.forEach(option => {
        if (option !== "") {
            let opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            semesterDropdown.append(opt);
        }        
    });
}

function clearFilters() {
    window.location.reload();
}

function filter() {
    readAllRows().then(rows => {
        let filteredList = rows;

        ['Course Name', 'Teacher'].forEach(item => {
            let value = document.getElementById(item).value;

            if (value && value.trim() !== "") {              
                filteredList = filterContains(filteredList, item, value);
            }            
        });
        
        const startHour = document.getElementById('Start Hour').value;
        const endHour = document.getElementById('End Hour').value;

        if (startHour && startHour.trim() !== "") {
            filteredList = filterGreaterEqualThan(filteredList, 'Start Hour', startHour);
        }

        if (endHour && endHour.trim() !== "") {
            filteredList = filterLowerEqualThan(filteredList, 'End Hour', endHour);
        }

        ['ECTS Winter', 'ECTS Summer', 'ECTS Combined', 'Hours Winter', 'Hours Summer', 'Suggested Learning Stage', 'Faculty', 'Faculty Name', 'Room', 'Weekday', 'Semester']
            .forEach(item => {
                const value = document.getElementById(item).value;

                if (value && value.trim() !== "") {  
                    filteredList = filterEqual(filteredList, item, value);
                }
            });
      
        createTable(filteredList);
    });
}

window.onload = function() {
    readAllRows().then(rows => {
        createTable(rows);
        populateForm(rows);
    });
}
