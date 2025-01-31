export function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target.result;
            const lines = content.split('\n');
            resolve(lines);
        };

        reader.onerror = function() {
            reject(new Error('Błąd podczas czytania pliku'));
        }

        reader.readAsText(file);
    });
}