function highlightElement(id) {
    const element = document.getElementById(id);
    const highlightClass = "highlight";

    if (element) {
        element.parentElement.classList.add(highlightClass);

        setTimeout(() => {
            element.parentElement.classList.remove(highlightClass);
        }, 3000)
    }
}