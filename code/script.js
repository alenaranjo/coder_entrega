document.addEventListener("DOMContentLoaded", function () {
    const selectedProducts = new Map();
    const productButtons = document.querySelectorAll('.producto');
    const cart = document.getElementById('cart');
    const totalSinIVA = document.getElementById('totalSinIVA');
    const iva = document.getElementById('iva');
    const totalConIVA = document.getElementById('totalConIVA');
    const clearCartButton = document.getElementById('clear-cart');
    const editCartButton = document.getElementById('edit-cart');

    let edicionHabilitada = false; // Variable para habilitar la edición

    // Cargar datos del carrito desde sessionStorage al cargar la página
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.forEach(item => {
            selectedProducts.set(item.id, item);
        });
        renderCart();
    }

    // Función para renderizar el carrito
    function renderCart() {
        cart.innerHTML = '';

        let totalPrecioSinIVA = 0;

        // Convertir el mapa de productos a una matriz para guardar en sessionStorage
        const cartArray = Array.from(selectedProducts.values());

        // Guardar el carrito actualizado en sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cartArray));

        cartArray.forEach((product) => {
            const row = document.createElement('div');
            row.classList.add('cart-item');
            row.innerHTML = `
                <p>${product.nombre}, Cantidad: <span class="${edicionHabilitada ? 'editable' : ''}" contenteditable="${edicionHabilitada ? 'true' : 'false'}">${product.cantidad}</span>, Precio: $${(product.cantidad * product.precio).toFixed(2)}</p>
            `;

            const cantidadEditable = row.querySelector('span');

            // Escucha el evento 'click' para seleccionar todo el texto en el campo de cantidad
            cantidadEditable.addEventListener('click', () => {
                cantidadEditable.style.fontSize = '15px'; // Aumenta el tamaño de fuente al hacer clic
                const range = document.createRange();
                range.selectNodeContents(cantidadEditable);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            });

            // Escucha el evento 'input' para actualizar la cantidad y el precio cuando se edita
            cantidadEditable.addEventListener('input', () => {
                const nuevaCantidad = parseInt(cantidadEditable.textContent);
                if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
                    product.cantidad = nuevaCantidad;
                    // Actualiza el precio
                    cantidadEditable.parentElement.lastElementChild.textContent = `$${(product.cantidad * product.precio).toFixed(2)}`;
                }
                // Actualiza la lista de productos seleccionados
                renderCart();

                // Restaurar el tamaño de fuente original (12px) después de cambiar la cantidad
                cantidadEditable.style.fontSize = '12px';
            });

            cart.appendChild(row);

            totalPrecioSinIVA += product.cantidad * product.precio;
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
                // Si el producto ya está en el carrito, aumenta la cantidad y actualiza el precio
                const product = selectedProducts.get(productId);
                product.cantidad++;
                product.precio += productPrecio;
            } else {
                // Si es un nuevo producto, crea una entrada en el carrito
                selectedProducts.set(productId, {
                    id: productId,
                    nombre: productId.charAt(0).toUpperCase() + productId.slice(1), // Primera letra en mayúscula
                    cantidad: 1,
                    precio: productPrecio,
                });
            }

            // Actualiza la lista de productos seleccionados
            renderCart();
        });
    });

    // Manejar el botón de limpiar carrito
    clearCartButton.addEventListener('click', () => {
        selectedProducts.clear();
        sessionStorage.removeItem('cart'); // Limpiar también los datos de sessionStorage
        renderCart();
    });

    // Manejar el botón de editar lista
    editCartButton.addEventListener('click', () => {
        edicionHabilitada = !edicionHabilitada; // Cambiar el estado de edición
        const cantidadEditable = document.querySelectorAll('.cart-item span[contenteditable="false"]');
        cantidadEditable.forEach(editable => {
            editable.contentEditable = edicionHabilitada ? 'true' : 'false'; // Habilitar o deshabilitar la edición
            if (!edicionHabilitada) {
                editable.textContent = ''; // Limpia el contenido inicial si se deshabilita la edición
                cantidadEditable.style.fontSize = '12px'; // Restaurar el tamaño de fuente original
            }
        });
    });
});
