import { writeFileSync, readFileSync, appendFileSync, existsSync } from 'fs'

class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 0;
        this.path = './productos.json'
    }

    saveToFile() {
        try {
            writeFileSync(this.path, JSON.stringify(this.products,null,2));
        } catch (error) {
            console.log('Error al guardar en el archivo:', error);
        }
    }

    recoverProducts() {       
        try {
            const data = readFileSync(this.path, 'utf-8');
        
            if (data.length === 0) {
                this.products = [];
            } else {
                this.products = JSON.parse(data);
            }

            // Establecer nextId basado en el id más grande en el archivo
            const maxIdProduct = this.products.reduce((prev, curr) => (prev.id > curr.id) ? prev : curr, {id: 0});
            this.nextId = maxIdProduct.id + 1;
        } catch (error) {
            if (error.code === 'ENOENT') { // ENOENT es el error que se lanza si el archivo no existe
                this.products = [];
                this.nextId = 0;
            } else {
                console.log('Error al leer el archivo:', error);
            }
        }
        }

    getProducts() {
        this.recoverProducts()
        //this.products = JSON.parse(readFileSync(this.path, 'utf-8'))
        if(this.products.length == 0){
            console.log("No hay productos para mostrar")
        } else {
            console.log(this.products)
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log('Todos los campos son obligatorios');
            return;
        }
        this.recoverProducts();
        const duplicateCode = this.products.some(product => product.code === code);
        if(duplicateCode){
            console.log('El código ya existe');
            return;
        }

        const product = new Product(this.nextId++, title, description, price, thumbnail, code, stock);
        this.products.push(product);

        // Guarda el producto en el archivo
        this.saveToFile();
    }

    getProductById(id) {
        this.recoverProducts();
        const product = this.products.find(product => product.id === id);
        if (product) {
            console.log(product);
            return product;
        } else {
            console.log('Producto no encontrado');
        }
    }

    updateProduct(code, updatedProduct) {
        this.recoverProducts();
        const index = this.products.findIndex(product => product.code === code);
        if (index !== -1) {
            this.products[index] = {...this.products[index], ...updatedProduct};
            this.saveToFile();
        } else {
            console.log('Producto no encontrado');
        }
    }

    deleteProduct(id) {
        this.recoverProducts();
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveToFile();
        } else {
            console.log('Producto no encontrado');
        }
    }
}
const manager = new ProductManager();
// manager.getProducts()
//manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc127", 25)
manager.updateProduct("abc127",{title: "nombre fixed"})
//manager.getProductById(3)
//manager.deleteProduct(3)
manager.getProducts()