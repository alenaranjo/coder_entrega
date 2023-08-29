const input = prompt("Escriba los productos que desea comprar separados por una coma, los productos en el inventario son:\n1. Arroz\n2. Cereal\n3. Leche\n4. Pastas\n5. Galletas\n6. Refresco"); // Solicitar entrada al usuario
const productos = input.split(',').map(producto => producto.trim().toLowerCase()); // Dividir la entrada y limpiar espacios

let precioTotal = 0;
let productosNoValidos = [];

for (let i = 0; i < productos.length; i++) {
    const seleccion = productos[i];
    if (seleccion === 'arroz') {
        precioTotal += 1500;
    } else if (seleccion === 'cereal') {
        precioTotal += 1000;
    } else if (seleccion === 'leche') {
        precioTotal += 800;
    } else if (seleccion === 'pastas') {
        precioTotal += 900;
    } else if (seleccion === 'galletas') {
        precioTotal += 670;
    } else if (seleccion === 'refresco') {
        precioTotal += 700;
    } else {
        productosNoValidos.push(seleccion);
    }
}

if (productosNoValidos.length > 0) {
    alert(`Los siguientes productos no existen en el inventario: ${productosNoValidos.join(', ')}`);
}

if (precioTotal > 0) {
  const iva = precioTotal * 0.13;
  const precioTotalConIva = precioTotal + iva;
  alert(`Precio total sin IVA: ${precioTotal}\nIVA (13%): ${iva}\nPrecio total con IVA: ${precioTotalConIva}`);
} else {
  alert("No se seleccionaron productos válidos.");
}