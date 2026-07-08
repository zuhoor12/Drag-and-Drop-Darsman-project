
class Pizza {
    constructor() {
        this.itemBox = document.getElementById("item-box");
        this.totalCalorie = document.getElementById("total-calorie");
        this.totalPrice = document.getElementById("total-price");
        this.dropZone = document.getElementById("pizza-dough"); 
        this.data = null;
        this.toppings = []; 
        this.setupDropZone();
        this.initData();
    }
    setupDropZone() {
        this.dropZone.style.position = "relative";
        this.dropZone.addEventListener("dragover", this.DragOver.bind(this));
        this.dropZone.addEventListener("drop", this.Drop.bind(this));
    }

    async initData() {
        fetch("../json/food-items.json")
            .then((response) => response.json())
            .then((dt) => {
                this.data = dt.items;
                this.render();
            });
    }

    render() {
        this.data.forEach((eachData) => {
            let div = document.createElement("div");
            for (let i = 0; i < eachData.qty; i++) {
                const img = document.createElement("img");
                img.setAttribute("id", `${eachData.id}${i}`);
                img.src = eachData.image;
                img.className = "img-item";
                img.dataset.name = eachData.name;
                img.dataset.price = eachData.price;
                img.dataset.calorie = eachData.calorie;
                img.setAttribute("draggable", "true");
                img.addEventListener("dragstart", this.DragStart.bind(this));
                div.appendChild(img);
            }
            this.itemBox.append(div);
        });
    }

    DragStart(event) {
        event.dataTransfer.setData("id", event.target.id);
        console.log(event.target)
        const rect = event.target.getBoundingClientRect();
        event.dataTransfer.setData("offsetX", event.clientX - rect.left);
        event.dataTransfer.setData("offsetY", event.clientY - rect.top);
    }

    DragOver(event) {
        event.preventDefault();
    }

    Drop(event) {
        event.preventDefault();

        let id = event.dataTransfer.getData("id");
        let element = document.getElementById(id);

        let offsetX = event.dataTransfer.getData("offsetX");
        let offsetY = event.dataTransfer.getData("offsetY");

        let rect = this.dropZone.getBoundingClientRect();
        let x = event.clientX - rect.left - offsetX;
        let y = event.clientY - rect.top - offsetY;

        this.dropZone.appendChild(element);
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        this.toppings.push({
            id: id,
            name: element.dataset.name,
            price: Number(element.dataset.price),
            calorie: Number(element.dataset.calorie),
        });

        this.calculateTotalPrice();
        this.calculateTotalCalorie();
    }

    calculateTotalPrice() {
        let sum = this.toppings.reduce((acc, item) => acc + item.price, 0);
        this.totalPrice.textContent = sum;
    }

    calculateTotalCalorie() {
        let sum = this.toppings.reduce((acc, item) => acc + item.calorie, 0);
        this.totalCalorie.textContent = sum;
    }
}

const PizzaInstance = new Pizza();