export function readFile(file) {
    if(file.type !== "text/plain" && !file.name.endsWith(".txt"))
        throw new Error('Niewłaściwy typ pliku');

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