const misProductos = [
    { id: 1, nombre: 'arroz', precio: 1500 },
    { id: 2, nombre: 'cereal', precio: 1000 },
    { id: 3, nombre: 'leche', precio: 800 },
    { id: 4, nombre: 'pastas', precio: 900 },
    { id: 5, nombre: 'galletas', precio: 970 },
    { id: 6, nombre: 'refresco', precio: 700 },
];

const carritoDeCompras = [];

function mostrarProductos(productos) {
    let listaProductos = "";
    let precioTotal = 0;

    for (const producto of productos) {
        listaProductos += `NOMBRE: ${producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)}\nPRECIO: ${producto.precio}\nCANTIDAD: ${producto.cantidad}\n\n`;
        precioTotal += producto.precio * producto.cantidad;
    }

    const iva = precioTotal * 0.13;
    const precioTotalConIva = precioTotal + iva;

    return `Productos seleccionados:\n\n${listaProductos}\nPrecio total sin IVA: ${precioTotal}\nIVA (13%): ${iva}\nPrecio total con IVA: ${precioTotalConIva}`;
}

function agregarProductosAlCarrito() {
    const productosDisponibles = misProductos.map(producto => `${producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)}, Precio ${producto.precio}`).join('\n');
    const input = prompt(`**Productos disponibles:**\n\n${productosDisponibles}\n\nEscriba los productos que desea comprar junto con la cantidad, separados por coma (por ejemplo, Leche 2, Pastas 2)`); // Solicitar entrada al usuario
    const seleccionUsuario = input.split(',').map(seleccion => seleccion.trim().toLowerCase()); // Dividir la entrada y limpiar espacios

    for (const seleccion of seleccionUsuario) {
        const [nombreProducto, cantidad] = seleccion.split(' ');
        const producto = misProductos.find(item => item.nombre === nombreProducto);

        if (producto && cantidad && !isNaN(cantidad)) {
            const productoEnCarrito = {
                nombre: nombreProducto.charAt(0).toUpperCase() + nombreProducto.slice(1),
                precio: producto.precio,
                cantidad: parseInt(cantidad)
            };
            carritoDeCompras.push(productoEnCarrito);
        } else {
            alert(`El producto "${nombreProducto}" no existe en el inventario o la cantidad es incorrecta.`);
        }
    }

    const continuar = prompt("¿Desea agregar otro producto? (Si/No)").toLowerCase();

    if (continuar === "si") {
        agregarProductosAlCarrito();
    }
}

agregarProductosAlCarrito(); // Llamada inicial para agregar productos al carrito

if (carritoDeCompras.length > 0) {
    alert(mostrarProductos(carritoDeCompras));
} else {
    alert("No se seleccionaron productos válidos.");
}