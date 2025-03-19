class Box {
    #col;
    #row;
    #color;
    #free;
    #open;
    #element;

    constructor(row, col, color) {
        this.#col = col;
        this.#row = row;
        this.#color = color;
        this.#free = true;
        this.#open = false;
    }

    get col() {
        return this.#col;
    };

    get row() {
        return this.#row;
    };

    set element(element) {
        this.#element = element;
    };

    get element() {
        return this.#element;
    };

    get open() {
        return this.#open;
    };

    get free() {
        return this.#free;
    };

    set free(newValue) {
        this.#free = newValue;
    };

    get color() {
        return this.#color;
    };

    addEventClick() {
        if (this.#element) {
            this.#element.addEventListener('click', (event) => {
                if (this.#open === false) {
                    this.#element.style.backgroundColor = this.#color;
                    this.#open = true;
                }
                return false
            });
        }
    }

    resetColor() {
        this.#element.style.backgroundColor = 'rgb(41, 41, 41)';
        this.#open = false;
    }
}

export default Box;