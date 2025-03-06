// This script is used to choose which file will be opened

function getFilesList() {
    const repoOwner = 'przemekkojs';
    const repoName = 'AMKL';
    const folderPath = 'Fakultety/js/resources';

    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`)
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = files.map(file => `<p>${file.name}</p>`).join('');
        })
        .catch(error => console.error('Error:', error));
}

getFilesList()