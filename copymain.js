import {promises as fs} from 'fs'

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

    
    async saveToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products,null,2));
        } catch (error) {
            console.log('Error al guardar en el archivo:', error);
        }
    }

    async recoverProducts() {       
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);

            // Establecer nextId basado en el id más grande en el archivo
            const maxIdProduct = this.products.reduce((prev, curr) => (prev.id > curr.id) ? prev : curr, {id: 0});
            this.nextId = maxIdProduct.id + 1;
        } catch (error) {
            if (error.code !== 'ENOENT') { // ENOENT es el error que se lanza si el archivo no existe
                console.log('Error al leer el archivo:', error);
            }
        }
        }

    async addProduct(title, description, price, thumbnail, code, stock) {   
        // Verifica que todos los campos estén presentes
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log('Todos los campos son obligatorios');
            return;
        }
        
        // Verifica si el código ya existe
        const duplicateCode = this.products.some(product => product.code === code);
        if(duplicateCode){
            console.log('El código ya existe');
            return;
        }

        const product = new Product(this.nextId++, title, description, price, thumbnail, code, stock);
        this.products.push(product);

        // Guarda el producto en el archivo
        await fs.writeFile(this.path, JSON.stringify(this.products));
    }

    async getProducts() {
        const data = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(data)

        console.log(prods)
    }
    

    

    removeProduct(code) {
        const index = this.products.findIndex(product => product.code === code);
        if (index !== -1) {
            this.products.splice(index, 1);
        } else {
            console.log('Producto no encontrado');
        }
    }

    updateProduct(code, updatedProduct) {
        const index = this.products.findIndex(product => product.code === code);
        if (index !== -1) {
            this.products[index] = {...this.products[index], ...updatedProduct};
        } else {
            console.log('Producto no encontrado');
        }
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.log('Producto no encontrado');
        }
    }
}

// 1era etapa de Testing

// const products = manager.getProducts();
// console.log("primera muestra de productos",products);
// const manager = new ProductManager()
// manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc124", 25);
// manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
// manager.getProducts()


// // Segunda etapa de testing 

// manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);


// // Tercera etapa de testing - codigo duplicado
// manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc124", 25);
// manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
// manager.addProduct("productazo", "Nuevo producto prueba", 500, "Sin imagen", "abc150", 50);

// // Cuarta etapa de testing - codigo duplicado
// manager.getProductById(3)
// console.log("segunda muestra de productos",products);

const runAsyncOperations = async () => {
    const manager = new ProductManager();
    await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc124", 25);
    await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
    const products = await manager.getProducts();
    console.log(products);
}

runAsyncOperations();
