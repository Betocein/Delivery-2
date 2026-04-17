(function () {
  'use strict';

  const DATA = {
    restaurantes: [
      { id: 'r1', nombre: 'Green Garden', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
      { id: 'r2', nombre: 'Ocean Bowl', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
      { id: 'r3', nombre: 'Eco Burger', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' }
    ],
    menu: {
      r1: [{ id: 'm1', nombre: 'Pizza Kale', precio: 12.5 }, { id: 'm2', nombre: 'Pizza Veggie', precio: 10.0 }],
      r2: [{ id: 'm3', nombre: 'Poke Salmón', precio: 14.0 }, { id: 'm4', nombre: 'Sushi Veg', precio: 11.5 }],
      r3: [{ id: 'm5', nombre: 'Lentil Burger', precio: 9.0 }, { id: 'm6', nombre: 'Quinoa Deluxe', precio: 11.0 }]
    }
  };

  let state = {
    step: 1,
    cart: [],
    restId: null,
    direccion: '',
    metodoPago: ''
  };

  const views = {
    1: document.getElementById('step-restaurante'),
    2: document.getElementById('step-productos'),
    3: document.getElementById('step-envio'),
    4: document.getElementById('step-pago'),
    5: document.getElementById('step-resumen'),
    6: document.getElementById('step-confirmacion')
  };

  window.app = {
    goStep: (n) => {
      Object.values(views).forEach(v => v.hidden = true);
      views[n].hidden = false;
      document.querySelectorAll('.step-item').forEach((s, i) => {
        s.classList.toggle('active', i + 1 === n);
      });
      if(n === 5) renderResumen();
    },

    abrirMenu: (id) => {
      state.restId = id;
      const r = DATA.restaurantes.find(x => x.id === id);
      document.getElementById('titulo-restaurante').innerText = r.nombre;
      const list = document.getElementById('lista-platos');
      list.innerHTML = DATA.menu[id].map(p => `
        <div class="plato-card">
          <span>${p.nombre} - ${p.precio}€</span>
          <button onclick="window.app.addToCart('${p.nombre}', ${p.precio})">＋</button>
        </div>
      `).join('');
      window.app.goStep(2);
    },

    addToCart: (nombre, precio) => {
      state.cart.push({ nombre, precio });
      document.getElementById('cart-count').innerText = state.cart.length;
      updateCartModal();
    },

    validateEnvio: () => {
      state.direccion = document.getElementById('input-direccion').value;
      if (!state.direccion) return alert("Escribe tu dirección");
      window.app.goStep(4);
    }
  };

  function updateCartModal() {
    const list = document.getElementById('cart-items-list');
    let total = 0;
    list.innerHTML = state.cart.map(item => {
      total += item.precio;
      return `<li>${item.nombre} <span>${item.precio}€</span></li>`;
    }).join('');
    document.getElementById('cart-modal-total').innerText = total.toFixed(2) + '€';
  }

  function renderResumen() {
    state.metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;
    document.getElementById('resumen-dir').innerText = state.direccion;
    document.getElementById('resumen-pago').innerText = state.metodoPago;
    
    const list = document.getElementById('lista-resumen');
    let total = 0;
    list.innerHTML = state.cart.map(i => {
      total += i.precio;
      return `<li>${i.nombre} <span>${i.precio}€</span></li>`;
    }).join('');
    document.getElementById('total-final').innerText = total.toFixed(2) + '€';
  }

  // Interacción Modal
  document.getElementById('open-cart').onclick = () => document.getElementById('cart-modal').hidden = false;
  document.getElementById('close-cart').onclick = () => document.getElementById('cart-modal').hidden = true;
  document.getElementById('btn-ir-envio').onclick = () => {
    if(state.cart.length === 0) return alert("Carrito vacío");
    window.app.goStep(3);
  };
  document.getElementById('btn-finalizar').onclick = () => window.app.goStep(6);

  // Carga inicial
  document.getElementById('lista-restaurantes').innerHTML = DATA.restaurantes.map(r => `
    <div class="card-rest" onclick="window.app.abrirMenu('${r.id}')">
      <img src="${r.img}">
      <h3>${r.nombre}</h3>
    </div>
  `).join('');

})();