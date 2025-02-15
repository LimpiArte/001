document.addEventListener('DOMContentLoaded', () => {
    startAutoplay();
    updateCarousel();
    cargarProductos();
});

// 1. Sistema de Búsqueda Mejorado
function performSearch() {
    const query = document.querySelector('.search-box').value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    const results = [];
    for (const category in products) {
        for (const product in products[category]) {
            if (product.toLowerCase().includes(query)) {
                results.push({
                    product: product,
                    price: products[category][product],
                    category: category
                });
            }
        }
    }

    if (results.length > 0) {
        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'search-result';
            div.innerHTML = `
                <div class="product-name">${result.product}</div>
                <div class="product-category">${result.category}</div>
                <div class="product-price">$${result.price}</div>
            `;

            div.addEventListener('click', () => {
                mostrarProductoEnLista(result);
                resultsContainer.style.display = 'none';
            });

            resultsContainer.appendChild(div);
        });
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.innerHTML = '<div class="no-results">No se encontraron productos</div>';
        resultsContainer.style.display = 'block';
    }
}

function mostrarProductoEnLista(producto) {
    // Abrir la categoría correspondiente
    const categoria = document.querySelector(`details summary:contains('${producto.category}')`)?.closest('details');
    if (categoria) {
        categoria.open = true;
    }

    // Resaltar y desplazarse al producto
    const productId = slugify(producto.product);
    const productoElemento = document.getElementById(productId);
    if (productoElemento) {
        productoElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        productoElemento.closest('tr').style.background = '#fffaed';
        setTimeout(() => {
            productoElemento.closest('tr').style.background = '';
        }, 2000);
    }
}

document.querySelector('.search-box').addEventListener('input', performSearch);

// 2. Carrusel Interactivo
const carouselContent = document.querySelector('.carousel-content');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
let autoPlayInterval;
let currentIndex = 0;
const totalItems = document.querySelectorAll('.carousel-item').length;

function updateCarousel() {
    const itemWidth = document.querySelector('.carousel-item').offsetWidth;
    carouselContent.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
}

function startAutoplay() {
    autoPlayInterval = setInterval(nextSlide, 3000);
}

function resetAutoplay() {
    clearInterval(autoPlayInterval);
    startAutoplay();
}

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
});

// 3. Sistema de Productos y Carrito
const products = {
    "Aerosoles y Productos para Insectos": {
        "Glade aerosol": 3200,
        "Baygon mata mosca y mosquito": 4500,
        "Raid": 5000
    },
    "Productos para el Hogar": {
        "Glade limpia inodoro adhesivo": 2000,
        "Glade pastilla inodoro ch canasta": 1300,
        "Cepillo mano Glady": 1000,
        "Esponja 2X1 con lana de acero": 1200,
        "Esponja GO": 800,
        "Esponja acanalada": 1000,
        "Esponja acero chica": 700,
        "Esponja acero grande": 900,
        "Trapo piso": 800,
        "Rejilla": 1000,
        "Repasador toalla": 1500,
        "Broches madera": 1200,
        "Cabo madera": 1200,
        "Escobillón": 2800
    },
    "Productos de Limpieza": {
        "Detergente envasado Cif x300": 2200,
        "Detergente envasado Magistral x300": 2800,
        "Detergente envasado gigante x500": 1600,
        "Cloro": 900,
        "Lysofort, BB": 800,
        "Limpia vidrio": 1500,
        "Desengrasante": 1400,
        "Detergente tipo magistral": 1500
    },
    "Cuidado Personal": {
        "Odol crema dental": 2300,
        "Jabón Duc Individual": 800,
        "Jabón de tocador Kenia x3": 1900,
        "Jabón de tocador Sequence x3": 1900,
        "Jabón de tocador Sequence x1": 700,
        "Desodorante en crema": 2800,
        "Talco Rexona Efficient": 3000,
        "Shampoo tipo Pantene": 2000,
        "Shampoo plusbelle": 4300,
        "Acondicionador tipo Pantene": 2000,
        "Gillette Ultra Grip x3": 1900
    },
    "Productos Textiles": {
        "Perfume textil BB": 3800,
        "Perfume textil Arpege": 3000,
        "Suavizante celeste": 2000,
        "Jabón líquido Skip": 1300,
        "Jabón líquido Ariel": 1500,
        "Jabón líquido de mano": 2700
    },
    "Papelería y Productos de Higiene": {
        "Papel higienico Campanita texturado": 1700,
        "Papel higienico Campanita soft": 1900,
        "Papel higienico Campanita Plus": 2300,
        "Servilleta Campanita": 2500,
        "Servilleta You": 2000,
        "Servilleta x70un": 1500
    },
    "Productos de Higiene Femenina": {
        "Toallitas femeninas Doncella": 900,
        "Toallitas femeninas Lady Soft": 1500,
        "Protector Diario Doncella": 1000
    },
    "Otros Productos": {
        "Banda negra": 3000,
        "Creolina": 5000,
        "Sahumerios 10x": 1500
    }
};

let carrito = {};
let total = 0;

function slugify(text) {
    return text.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

function cargarProductos() {
    const container = document.getElementById('categorias-container');
    container.innerHTML = '';

    Object.entries(products).forEach(([categoria, productos]) => {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = categoria;

        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        Object.entries(productos).forEach(([producto, precio]) => {
            const tr = document.createElement('tr');
            const productId = slugify(producto);

            tr.innerHTML = `
                <td id="${productId}">${producto}</td>
                <td>$${precio}</td>
                <td>
                    <div class="contador">
                        <button onclick="ajustarCantidad('${productId}', -1)">-</button>
                        <span id="contador-${productId}">0</span>
                        <button onclick="ajustarCantidad('${productId}', 1)">+</button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        details.appendChild(summary);
        details.appendChild(table);
        container.appendChild(details);
    });
}

function ajustarCantidad(productId, cambio) {
    const contador = document.getElementById(`contador-${productId}`);
    let cantidad = parseInt(contador.textContent) || 0;
    cantidad = Math.max(0, cantidad + cambio);
    contador.textContent = cantidad;

    actualizarCarrito(productId, cantidad);
    actualizarTotal();
}

function actualizarCarrito(productId, cantidad) {
    const productoNombre = Object.entries(products)
        .flatMap(([_, productos]) => Object.keys(productos))
        .find(nombre => slugify(nombre) === productId);

    if (cantidad > 0) {
        carrito[productId] = {
            nombre: productoNombre,
            precio: obtenerPrecioProducto(productoNombre),
            cantidad: cantidad
        };
    } else {
        delete carrito[productId];
    }
    actualizarLista();
}

function obtenerPrecioProducto(nombre) {
    for (const categoria in products) {
        if (products[categoria][nombre]) {
            return products[categoria][nombre];
        }
    }
    return 0;
}

function actualizarTotal() {
    total = Object.values(carrito).reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    document.getElementById('total').textContent = total;
}

function actualizarLista() {
    const lista = document.getElementById('product-list');
    lista.innerHTML = '';

    Object.values(carrito).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.nombre}</span>
            <span>
                x${item.cantidad}
                <span class="precio-total">$${item.precio * item.cantidad}</span>
            </span>
        `;
        lista.appendChild(li);
    });
}

// 4. Integración con WhatsApp
document.getElementById('send-whatsapp').addEventListener('click', () => {
    if (total === 0) {
        alert("¡Tu carrito está vacío!");
        return;
    }

    const mensaje = `🚀 Pedido LimpiArte 🚀\n\n${
        Object.values(carrito).map(item =>
            `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`
        ).join('\n')
    }\n\nTotal: $${total}`;

    window.open(`https://wa.me/5493541399892?text=${encodeURIComponent(mensaje)}`, '_blank');
});

// 5. Sistema de Comentarios
let lastCommentEmail = '';

function toggleComments() {
    const form = document.querySelector('.comment-form');
    const comments = document.getElementById('comments');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    comments.style.display = comments.style.display === 'none' ? 'block' : 'none';
}

function addComment() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const commentText = document.getElementById('comment').value;
    const emailError = document.getElementById('email-error');
    const successMessage = document.getElementById('success-message');

    if (!validateEmail(email)) {
        emailError.textContent = 'Email inválido';
        return;
    }

    if (name && email && commentText) {
        const date = new Date();
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.dataset.email = email;
        newComment.innerHTML = `
            <div class="comment-header">${name} - ${formattedDate}</div>
            <div class="comment-body">${commentText}</div>
            <div class="comment-actions">
                <button onclick="editComment(this)">Editar</button>
                <button onclick="confirmDelete(this)">Eliminar</button>
            </div>
        `;

        document.getElementById('comments').appendChild(newComment);
        document.getElementById('comment-form').reset();
        emailError.textContent = '';
        successMessage.textContent = 'Comentario enviado!';
        lastCommentEmail = email;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function editComment(button) {
    const comment = button.closest('.comment');
    if (comment.dataset.email === lastCommentEmail) {
        const newText = prompt('Editar comentario:', comment.querySelector('.comment-body').textContent);
        if (newText) comment.querySelector('.comment-body').textContent = newText;
    }
}

function confirmDelete(button) {
    const comment = button.closest('.comment');
    if (comment.dataset.email === lastCommentEmail && confirm('¿Eliminar comentario?')) {
        comment.remove();
    }
}

// Función para cerrar resultados de búsqueda
document.addEventListener('click', (e) => {
    const resultsContainer = document.getElementById('search-results');
    if (!e.target.closest('.search-box') && !e.target.closest('.search-result')) {
        resultsContainer.style.display = 'none';
    }
});


function mostrarProductoEnLista(producto) {
    // Abrir la categoría correspondiente
    const detallesCategorias = document.querySelectorAll('details');
    detallesCategorias.forEach(detalle => {
        const tituloCategoria = detalle.querySelector('summary').textContent.trim();
        if (tituloCategoria === producto.category) {
            detalle.open = true;
        }
    });

    // Resaltar y desplazarse al producto
    const productId = slugify(producto.product);
    const productoElemento = document.getElementById(productId);
    if (productoElemento) {
        // Pequeño retraso para asegurar que la categoría se haya abierto
        setTimeout(() => {
            productoElemento.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
            
            productoElemento.closest('tr').style.background = '#fffaed';
            setTimeout(() => {
                productoElemento.closest('tr').style.background = '';
            }, 2000);
        }, 100);
    }
}