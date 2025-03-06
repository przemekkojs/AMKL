// This script is used to choose which file will be opened

function getFilesList() {
    const repoOwner = 'przemekkojs';
    const repoName = 'AMKL';
    const folderPath = 'Fakultety/js/resources';

    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`)
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = files.map(file => `
                <span onclick="saveToCookie('${file.name}')" class="files-list-element">${file.name.split('.')[0]}</span><br/>
            `).join('');
        })
        .catch(error => console.error('Error:', error));
}

function saveToCookie(filename) {
    localStorage.setItem('filename', filename);

    const currentPath = window.location.pathname;
    const newPath = currentPath.replace("loadDb.html", "index.html");
    window.location.replace(newPath);
}

getFilesList()