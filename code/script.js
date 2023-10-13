document.addEventListener("DOMContentLoaded", function () {
    const products = [
        { id: 'arroz', nombre: 'Arroz', precio: 1500 },
        { id: 'cereal', nombre: 'Cereal', precio: 1000 },
        { id: 'leche', nombre: 'Leche', precio: 800 },
        { id: 'pastas', nombre: 'Pastas', precio: 900 },
        { id: 'galletas', nombre: 'Galletas', precio: 970 },
        { id: 'refresco', nombre: 'Refresco', precio: 700 },
    ];

    const selectedProducts = new Map();
    const productButtons = document.querySelectorAll('.producto');
    const cart = document.getElementById('cart');
    const totalSinIVA = document.getElementById('totalSinIVA');
    const iva = document.getElementById('iva');
    const totalConIVA = document.getElementById('totalConIVA');
    const clearCartButton = document.getElementById('clear-cart');
    const purchase = document.getElementById('purchase');

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.forEach(item => {
            selectedProducts.set(item.id, item);
        });
        renderCart();
    }

    function calcularPrecioTotal(product) {
        return product.cantidad * product.precio;
    }

    function renderCart() {
        cart.innerHTML = '';

        let totalPrecioSinIVA = 0;
        
        selectedProducts.forEach((product) => {
            product.precioTotal = calcularPrecioTotal(product);
        });

        const cartArray = Array.from(selectedProducts.values());

        localStorage.setItem('cart', JSON.stringify(cartArray));

        cartArray.forEach((product) => {
            const row = document.createElement('div');
            row.classList.add('cart-item');
            row.innerHTML = `
                <div class="producto-card">
                    <h3>${product.nombre}</h3>
                    <p class="precio">Total: $${(product.precioTotal).toFixed(2)}</p>
                    <p>Cantidad: <span>${product.cantidad}</span></p>
                    <button class="btn-clear agregar" onclick="addQuantity('${product.id}')">Agregar otro</button>
                    <button class="btn-clear quitar" onclick="decreaseQuantity('${product.id}')">Quitar uno</button>
                    <button class="btn-clear borrar" onclick="removeItem('${product.id}')">Borrar</button>
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
                // Si el producto ya está en el carrito
                const product = selectedProducts.get(productId);
                product.cantidad++;
            } else {
                // Si es un nuevo producto
                selectedProducts.set(productId, {
                    id: productId,
                    nombre: button.closest('.producto-card').querySelector('h3').textContent.trim(),
                    cantidad: 1,
                    precio: productPrecio,
                });
            }

            renderCart();
            obtenerPost();
        });
    });

    function calcularTotalCompra() {
        let total = 0;
        selectedProducts.forEach((product) => {
            total += calcularPrecioTotal(product);
        });
        return total;
    }

    let datosLlenados = false;

    purchase.addEventListener('click', () => {
        if (selectedProducts.size === 0) {
            Swal.fire({
                text: 'No hay productos en el carrito',
                icon: 'error',
                timer: 2000,
                position: 'center'
            });
        } else if (datosLlenados) {
            Swal.fire('Ya has llenado los datos necesarios, en breve nos pondremos en contacto', '', 'info');
            
        } else {
            const totalPrecioSinIVA = calcularTotalCompraSinIVA();
            const totalCompra = totalPrecioSinIVA * 1.13;

            Swal.fire({
                title: '<strong>Gracias, enviaremos su pedido.</strong>',
                html: `El total de su compra es de: <strong style="font-size: 20px;">$${totalCompra.toFixed(2)}</strong><br><br>
                <input id="nombreCompleto" type="text" placeholder="Nombre Completo" style="margin: 5px 0; padding: 5px;">
                <input id="numeroTelefono" type="text" placeholder="Número de Teléfono" style="margin: 5px 0; padding: 5px;">`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    popup: 'popup-card',
                    confirmButton: 'purchase',
                    cancelButton: 'btn_clear'
                },
                preConfirm: () => {
                    const nombreCompleto = document.getElementById('nombreCompleto').value;
                    const numeroTelefono = document.getElementById('numeroTelefono').value;
                    if (!nombreCompleto || !numeroTelefono) {
                        Swal.showValidationMessage('Por favor, complete ambos campos.');
                    } else {
                        datosLlenados = true; 
                    }
                    return { nombreCompleto, numeroTelefono };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const { nombreCompleto, numeroTelefono } = result.value;
                    if (nombreCompleto && numeroTelefono) {
                        Swal.fire('Gracias en breve te contactaremos', '', 'success');
                        datosLlenados = true; 
                    }
                }
            });
        }
    });

    function calcularTotalCompraSinIVA() {
        let totalPrecioSinIVA = 0;
        selectedProducts.forEach((product) => {
            totalPrecioSinIVA += calcularPrecioTotal(product);
        });
        return totalPrecioSinIVA;
    }

    // Quitar producto
    window.removeItem = function (productId) {
        if (selectedProducts.has(productId)) {
            selectedProducts.delete(productId);
            renderCart();
        }
    };

    // Quitar cantidad
    window.decreaseQuantity = function (productId) {
        if (selectedProducts.has(productId)) {
            const product = selectedProducts.get(productId);
            if (product.cantidad > 1) {
                product.cantidad--;
                renderCart(); 
            } else {
                selectedProducts.delete(productId);
                renderCart();
            }
        }
    };

    // Aumentar cantidad
    window.addQuantity = function (productId) {
        if (selectedProducts.has(productId)) {
            const product = selectedProducts.get(productId);
            product.cantidad++;
            renderCart();
        }
    };

    // Limpiar carrito
    clearCartButton.addEventListener('click', () => {
        selectedProducts.clear();
        localStorage.removeItem('cart');
        renderCart();
        postList.innerHTML = '';  
        datosLlenados = false;
        // document.getElementById('nombreCompleto').value = ''; 
        // document.getElementById('numeroTelefono').value = '';
    });
    
    

    renderCart();

    let postList = document.getElementById("post-list");

    async function obtenerPost() {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!response.ok) {
            throw new Error("No se puede obtener el post");
        }

        const data = await response.json();
        mostrarPosts(data);
    }

    function mostrarPosts(posts) {
        const indiceAleatorio = Math.floor(Math.random() * posts.length);
        const comentarioAleatorio = posts[indiceAleatorio];

        const ul = document.createElement('ul');
        ul.classList.add('post-list');

        const li = document.createElement('li');
        li.classList.add('post-card');

        const title = document.createElement('h3');
        title.textContent = comentarioAleatorio.title.charAt(0).toUpperCase() + comentarioAleatorio.title.slice(1);

        const body = document.createElement('p');
        body.textContent = comentarioAleatorio.body.charAt(0).toUpperCase() + comentarioAleatorio.body.slice(1);

        li.appendChild(title);
        li.appendChild(body);

        ul.appendChild(li);

        postList.innerHTML = '';
        postList.appendChild(ul);
    }
});
