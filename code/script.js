document.addEventListener("DOMContentLoaded", function () {
    const products = [
        {id: 'arroz',nombre: 'Arroz',precio: 1500,},
        {id: 'cereal',nombre: 'Cereal',precio: 1000,},
        {id: 'leche',nombre: 'Leche',precio: 800,},
        {id: 'pastas',nombre: 'Pastas',precio: 900,},
        {id: 'galletas',nombre: 'Galletas',precio: 970,},
        {id: 'refresco',nombre: 'Refresco',precio: 700,},
    ];

    const selectedProducts = new Map();
    const productButtons = document.querySelectorAll('.producto');
    const cart = document.getElementById('cart');
    const totalSinIVA = document.getElementById('totalSinIVA');
    const iva = document.getElementById('iva');
    const totalConIVA = document.getElementById('totalConIVA');
    const clearCartButton = document.getElementById('clear-cart');

    // Cargar datos del carrito desde localStorage al cargar la página
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.forEach(item => {
            selectedProducts.set(item.id, item);
        });
        renderCart();
    }

    // Función para calcular el precio total de un producto
    function calcularPrecioTotal(product) {
        return product.cantidad * product.precio;
    }

    // Función para renderizar el carrito
    function renderCart() {
        cart.innerHTML = '';

        let totalPrecioSinIVA = 0;

        // Actualizar el precio de cada producto en el carrito
        selectedProducts.forEach((product) => {
            product.precioTotal = calcularPrecioTotal(product);
        });

        // Convertir el mapa de productos a una matriz para guardar en localStorage
        const cartArray = Array.from(selectedProducts.values());

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cartArray));

        cartArray.forEach((product) => {
            const row = document.createElement('div');
            row.classList.add('cart-item');
            row.innerHTML = `
                <div class="producto-card">
                    <h3>${product.nombre}</h3>
                    <p class="precio">Total: $${(product.precioTotal).toFixed(2)}</p>
                    <p>Cantidad: <span>${product.cantidad}</span></p>
                    <button class="btn_clear" onclick="removeItem('${product.id}')">Borrar</button>
                    <button class="btn_clear" onclick="decreaseQuantity('${product.id}')">Quitar uno</button>
                    <button class="btn_clear" onclick="addQuantity('${product.id}')">Agregar otro</button>
                </div>
            `;

            cart.appendChild(row);

            totalPrecioSinIVA += product.precioTotal;
        });

        const totalPrecioConIVA = totalPrecioSinIVA * 1.13;

        // Actualiza los totales
        totalSinIVA.textContent = totalPrecioSinIVA.toFixed(2);
        iva.textContent = (totalPrecioSinIVA * 0.13).toFixed(2);
        totalConIVA.textContent = totalPrecioConIVA.toFixed(2);
    }

    productButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.id;
            const productPrecio = parseFloat(button.getAttribute('data-precio'));

            if (selectedProducts.has(productId)) {
                // Si el producto ya está en el carrito, aumenta la cantidad
                const product = selectedProducts.get(productId);
                product.cantidad++;
            } else {
                // Si es un nuevo producto, crea una entrada en el carrito
                selectedProducts.set(productId, {
                    id: productId,
                    nombre: button.previousElementSibling.previousElementSibling.textContent.trim(),
                    cantidad: 1,
                    precio: productPrecio,
                });
            }

            renderCart();
        });
    });

    // Función para remover un producto del carrito
    window.removeItem = function (productId) {
        if (selectedProducts.has(productId)) {
            selectedProducts.delete(productId);
        }
        // Actualiza la lista de productos seleccionados
        renderCart();
    };

    // Función para disminuir la cantidad de un producto en el carrito
    window.decreaseQuantity = function (productId) {
        if (selectedProducts.has(productId)) {
            const product = selectedProducts.get(productId);
            if (product.cantidad > 1) {
                product.cantidad--;
            } else {
                selectedProducts.delete(productId);
            }
        }
        
        renderCart();
    };

    // Función para aumentar la cantidad de un producto en el carrito
    window.addQuantity = function (productId) {
        if (selectedProducts.has(productId)) {
            const product = selectedProducts.get(productId);
            product.cantidad++;
        }
        
        renderCart();
    };

    // Manejar el botón de limpiar carrito
    clearCartButton.addEventListener('click', () => {
        selectedProducts.clear();
        localStorage.removeItem('cart'); 
       
        renderCart();
    });

    renderCart();
});
