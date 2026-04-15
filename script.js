(function () {
  'use strict';

  const RESTAURANTES = [
    { id: 'r1', nombre: 'Green Garden', categoria: 'pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
    { id: 'r2', nombre: 'Ocean Bowl', categoria: 'asiatica', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
    { id: 'r3', nombre: 'Eco Burger', categoria: 'hamburguesas', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' }
  ];

  const MENU = {
    r1: [{ id: 'm1', nombre: 'Pizza Kale', precio: 12.5 }, { id: 'm2', nombre: 'Pizza Veggie', precio: 10.0 }],
    r2: [{ id: 'm3', nombre: 'Poke Salmón', precio: 14.0 }, { id: 'm4', nombre: 'Sushi Veg', precio: 11.5 }],
    r3: [{ id: 'm5', nombre: 'Lentil Burger', precio: 9.0 }, { id: 'm6', nombre: 'Quinoa Deluxe', precio: 11.0 }]
  };

  let pedido = [];
  let restIdActual = null;

  // DOM Elements
  const panels = {
    1: document.getElementById('step-restaurante'),
    2: document.getElementById('step-productos'),
    3: document.getElementById('step-envio'),
    4: document.getElementById('step-resumen'),
    5: document.getElementById('step-confirmacion')
  };

  function showStep(stepNum) {
    Object.values(panels).forEach(p => p.hidden = true);
    panels[stepNum].hidden = false;
    
    // Actualizar Stepper visual
    document.querySelectorAll('.step-item').forEach((item, idx) => {
        item.classList.toggle('active', idx + 1 === stepNum);
    });
  }

  // Renderizar Restaurantes
  function renderRestaurantes() {
    const container = document.getElementById('lista-restaurantes');
    container.innerHTML = RESTAURANTES.map(r => `
      <div class="card-rest" onclick="window.app.abrirMenu('${r.id}')">
        <img src="${r.img}" alt="${r.nombre}">
        <div class="card-info">
          <h3>${r.nombre}</h3>
          <span class="tag">${r.categoria}</span>
        </div>
      </div>
    `).join('');
  }

  window.app = {
    abrirMenu: (id) => {
      restIdActual = id;
      const platos = MENU[id];
      const rest = RESTAURANTES.find(r => r.id === id);
      document.getElementById('titulo-restaurante').textContent = rest.nombre;
      
      document.getElementById('lista-platos').innerHTML = platos.map(p => `
        <div class="plato-row">
          <div>
            <strong>${p.nombre}</strong><br>
            <span>${p.precio.toFixed(2)}€</span>
          </div>
          <button class="btn-mini" onclick="window.app.agregar('${p.id}', '${p.nombre}', ${p.precio})">＋</button>
        </div>
      `).join('');
      showStep(2);
    },
    agregar: (id, nombre, precio) => {
      pedido.push({ id, nombre, precio });
      document.getElementById('cart-count').textContent = pedido.length;
    }
  };

  // Event Listeners para el flujo
  document.getElementById('btn-volver-rest').onclick = () => showStep(1);
  
  document.getElementById('btn-ir-checkout').onclick = () => {
    if (pedido.length === 0) return alert("¡Tu carrito está vacío!");
    showStep(3);
  };

  document.getElementById('btn-ir-resumen').onclick = () => {
    const dir = document.getElementById('input-direccion').value;
    if (!dir) return alert("Por favor, ingresa una dirección");
    
    document.getElementById('display-dir').textContent = dir;
    renderResumen();
    showStep(4);
  };

  function renderResumen() {
    const lista = document.getElementById('lista-resumen');
    let total = 0;
    lista.innerHTML = pedido.map(item => {
        total += item.precio;
        return `<li>${item.nombre} <span>${item.precio.toFixed(2)}€</span></li>`;
    }).join('');
    document.getElementById('total-delivery').textContent = total.toFixed(2) + " €";
  }

  document.getElementById('btn-comprar').onclick = () => {
    document.getElementById('msg-confirm').textContent = `Tu pedido llegará pronto a ${document.getElementById('input-direccion').value}`;
    pedido = [];
    document.getElementById('cart-count').textContent = "0";
    showStep(5);
  };

  document.getElementById('btn-nuevo').onclick = () => showStep(1);

  renderRestaurantes();
})();