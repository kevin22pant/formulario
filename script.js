
       document.getElementById('wineForm').addEventListener('submit', function(event) {
    // 1. DETENER EL ENVÍO: Cancela la recarga por defecto
    event.preventDefault();

    // Captura de elementos del formulario de vinos
    const nombreVino = document.getElementById('nombreVino');
    const notaCata = document.getElementById('notaCata');
    const bodega = document.getElementById('bodega');
    const disponibilidad = document.getElementById('disponibilidad');
    
    // Captura de los Radio Buttons
    const tipoSeleccionado = document.querySelector('input[name="tipoVino"]:checked');
    const todosLosRadios = document.querySelectorAll('input[name="tipoVino"]');
    const errorTipo = document.getElementById('error-tipo');

    let formularioValido = true;

    // --- FUNCIÓN DE VALIDACIÓN Y MANEJO DE ERRORES VISUALES ---
    function validarCampoEstructurado(inputElemento, idError, mensaje, condicionFallo) {
        const contenedorError = document.getElementById(idError);

        if (condicionFallo) {
            // Estilo visual de error (borde rojo y fondo alerta)
            inputElemento.classList.add('is-invalid');
            inputElemento.classList.remove('is-valid');
            
            // Mensaje de error breve abajo
            if (contenedorError) {
                contenedorError.textContent = mensaje;
                contenedorError.style.display = 'block';
            }
            formularioValido = false; 
        } else {
            // Estilo visual de éxito (verde)
            inputElemento.classList.remove('is-invalid');
            inputElemento.classList.add('is-valid');
            if (contenedorError) {
                contenedorError.textContent = '';
                contenedorError.style.display = 'none';
            }
        }
    }

    // 2. VALIDAR LA INFORMACIÓN: Reglas de negocio vitivinícolas
    
    // Regla Nombre: Obligatorio, mínimo 4 caracteres
    validarCampoEstructurado(
        nombreVino, 
        'error-nombre', 
        'El nombre del vino o etiqueta es obligatorio (mínimo 4 caracteres).', 
        nombreVino.value.trim().length < 4
    );

    // Regla Nota de Cata: Obligatoria, mínimo 8 caracteres para describir el cuerpo/sabor
    validarCampoEstructurado(
        notaCata, 
        'error-nota', 
        'Por favor, introduce una breve descripción o nota de cata (mínimo 8 caracteres).', 
        notaCata.value.trim().length < 8
    );

    // Regla Bodega (Select): Debe elegir una región
    validarCampoEstructurado(
        bodega, 
        'error-bodega', 
        'Selecciona la bodega o región de procedencia del vino.', 
        bodega.value === ""
    );

    // Regla Disponibilidad (Checkbox): Confirmar stock físicamente es obligatorio
    validarCampoEstructurado(
        disponibilidad, 
        'error-disponibilidad', 
        'Debes verificar que el vino se encuentra físicamente disponible.', 
        !disponibilidad.checked
    );

    // Regla Tipo de Vino (Radio): Validación excluyente (Tinto, Blanco o Rosado)
    if (!tipoSeleccionado) {
        formularioValido = false;
        errorTipo.textContent = 'Debes clasificar el vino como Tinto, Blanco o Rosado.';
        errorTipo.classList.remove('d-none');
        
        todosLosRadios.forEach(radio => {
            radio.classList.add('is-invalid');
            radio.classList.remove('is-valid');
        });
    } else {
        errorTipo.textContent = '';
        errorTipo.classList.add('d-none');
        todosLosRadios.forEach(radio => {
            radio.classList.remove('is-invalid');
            radio.classList.add('is-valid');
        });
    }

    // 3. ALMACENAMIENTO Y MUESTRA VISUAL DINÁMICA
    if (formularioValido) {
        const tablaBody = document.querySelector('#wineTable tbody');
        const filaNoData = document.getElementById('no-data');

        // Remover texto "No se han registrado vinos..."
        if (filaNoData) {
            filaNoData.remove();
        }

        // Determinar qué clase de diseño de medalla (badge) usará la tabla según el tipo
        let claseBadge = '';
        if (tipoSeleccionado.value === 'Tinto') claseBadge = 'badge-tinto';
        else if (tipoSeleccionado.value === 'Blanco') claseBadge = 'badge-blanco';
        else if (tipoSeleccionado.value === 'Rosado') claseBadge = 'badge-rosado';

        // Crear fila dinámicamente en caliente
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td><strong class="text-dark">${nombreVino.value.trim()}</strong></td>
            <td><span class="badge ${claseBadge}">${tipoSeleccionado.value}</span></td>
            <td><span class="text-muted small">${bodega.value}</span></td>
            <td class="text-secondary text-break">${notaCata.value.trim()}</td>
        `;

        // Añadir la fila abajo en la tabla de inventario
        tablaBody.appendChild(nuevaFila);

        // LIMPIAR EL FORMULARIO para un nuevo vino
        document.getElementById('wineForm').reset();
        
        // Quitar todos los estados de validación previos
        document.querySelectorAll('.form-control, .form-select, .form-check-input').forEach(elemento => {
            elemento.classList.remove('is-valid', 'is-invalid');
        });
    }
});