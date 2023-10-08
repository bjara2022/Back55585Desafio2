const fs = require('fs')

class ProductManager {

    constructor(path) {
        this.path = path
        fs.writeFileSync(this.path, JSON.stringify([]));
    }
    #id = 0;
    async getProducts(){
        try {
            const list = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(list);
        } catch (e) {
            console.log("no hay acceso al archivo", e)
        }
    }
    #incrementId() {
        this.#id++
        return this.#id;
        }
    async addProduct (newProduct){
        try {
            const { title, description, price, thumbnail, code, stock } = newProduct;
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                return console.log ("faltan datos");
            }else {
                const productList = await this.getProducts();
                if (productList.find((product) => product.code === code))
                {return console.log ("El codigo ya existe")};
                
                    productList.push ({
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    id : this.#incrementId(),})
                    
                    await fs.promises.writeFile(this.path, JSON.stringify(productList)); 
                       
            };
            
            
        } catch (e) {
            console.log("no se pudo cargar producto", e)
            
        }
    }
    async getProductById (id) {
        try {
            const productList = await this.getProducts();
            const busqueda = productList.find((product)=>product.id === id)
            if (busqueda){
                console.log ("Id encontrado con exito")
                return busqueda
            }else {
                console.log(`ID ${id} no definido`);
				return 'Intente con otra ID';
            }
            
        } catch (e) {
            console.log("Id del producto no encontrado", e)            
        }
    }
    async updateProduct(productID, productToChanged) {
		try {
			const { title, description, price, thumbnail, code, stock } =
				productToChanged;
			const productList = await this.getProducts();

			const updatedProductList = productList.map((product) => {
				if (product.id === productID) {
					return {
						...product,
						title,
						description,
						price,
						thumbnail,
						code,
						stock,
					};
				} else {
					return product;
				}
			});

			await fs.promises.writeFile(
				this.path,
				JSON.stringify(updatedProductList)
			);

			console.info(`El producto con ID ${productID} fue actualizado`);
			return updatedProductList;
		} catch (e) {
			console.log("No se actualizo el producto", e);
		}
	}
    async deleteProduct(productID) {
		const productList = await this.getProducts();
		const newProductList = productList.find(
			(product) => product.id != productID
		);
		await fs.promises.writeFile(this.path, JSON.stringify(newProductList));
		console.log(`El producto con la ID ${productID} se elimino`);
		return newProductList;
	}
}

const productManager = new ProductManager('./products.json');
/*-------------------------------------------*/
const prueba  = async () => {
    try { console.log (await productManager.getProducts());

        await productManager.addProduct({
			title: 'prueba',
			description: 'Este es un producto prueba',
			price: 200,
			thumbnail: 'Sin imagen',
			code: 'abc123',
			stock: 25,
		});
        await productManager.addProduct({
			title: 'prueba',
			description: 'Este es un producto prueba',
			price: 200,
			thumbnail: 'Sin imagen',
			code: 'abc123',
			stock: 30,
		});
        await productManager.addProduct({
			title: 'prueba',
			description: 'Este es un producto prueba',
			price: 200,
			thumbnail: 'Sin imagen',
			code: 'abc123',
		});
        await productManager.addProduct({
			title: 'prueba',
			description: 'Este es un producto prueba',
			price: 200,
			thumbnail: 'Sin imagen',
			code: 'abc',
			stock: 60,
		});
        console.log(await productManager.getProducts());
        await productManager.updateProduct(1, {
			title: 'Nuevo',
			description: 'Este es un producto prueba',
			price: 100,
			thumbnail: 'Sin imagen',
			code: 'abc123',
			stock: 50,
		});
		console.log(await productManager.getProducts());
        
        
    } catch (e) {
        console.log("NO se pudo leer el archivo", e)
        return [];
    }
    console.log(await productManager.getProductById(2));
    console.log(await productManager.getProductById(5));
    await productManager.deleteProduct(2);
    console.log(await productManager.getProducts());
}
prueba ();