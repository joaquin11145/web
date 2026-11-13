/**
 * Utilidad nativa para generar e imprimir reportes comerciales en PDF
 * mediante ventana dedicada y estilos @media print sin librerías externas.
 */

const formatCLP = (monto) => `$${Number(monto || 0).toLocaleString('es-CL')}`;

function abrirVentanaImpresion(tituloDocumento, contenidoHtml) {
  const ventana = window.open('', '_blank', 'width=850,height=950');
  if (!ventana) {
    console.warn('[PDF GENERATOR] El navegador bloqueó la ventana emergente de impresión.');
    return;
  }

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${tituloDocumento}</title>
      <style>
        @page { size: letter; margin: 18mm; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #222222;
          margin: 0;
          padding: 0;
          line-height: 1.45;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2.5px solid #c3552b;
          padding-bottom: 14px;
          margin-bottom: 20px;
        }
        .brand {
          font-size: 22px;
          font-weight: 800;
          color: #c3552b;
          letter-spacing: 0.5px;
        }
        .doc-box {
          border: 1.5px solid #222;
          padding: 10px 16px;
          text-align: center;
          background: #fbfbf9;
        }
        .doc-title {
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          color: #222;
        }
        .doc-folio {
          font-size: 13px;
          font-weight: 700;
          color: #c3552b;
          margin-top: 4px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 24px;
          background: #f6f6f4;
          padding: 12px 16px;
          border: 1px solid #d4d4d0;
          margin-bottom: 20px;
          font-size: 13px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 13px;
        }
        th {
          background-color: #c3552b;
          color: #ffffff;
          text-align: left;
          padding: 8px 10px;
          font-weight: 700;
        }
        td {
          border-bottom: 1px solid #dddddd;
          padding: 8px 10px;
        }
        .text-right { text-align: right; }
        .totales {
          width: 290px;
          margin-left: auto;
          border: 1.5px solid #222;
          padding: 12px 16px;
          background: #fbfbf9;
          font-size: 13.5px;
        }
        .totales-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .totales-final {
          display: flex;
          justify-content: space-between;
          border-top: 1.5px solid #222;
          padding-top: 8px;
          margin-top: 8px;
          font-weight: 800;
          font-size: 16px;
          color: #c3552b;
        }
        .footer-note {
          margin-top: 32px;
          padding-top: 12px;
          border-top: 1px dashed #999;
          font-size: 11.5px;
          color: #555;
          text-align: center;
        }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      ${contenidoHtml}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 250);
        };
      </script>
    </body>
    </html>
  `);
  ventana.document.close();
}

/**
 * 1. Comprobante de Venta (Boleta / Factura Electrónica)
 * Calcula el valor neto sin IVA, el 19% de IVA y el total cobrado,
 * detallando los últimos 4 dígitos de tarjeta o código de transferencia.
 */
export function generarComprobanteVentaPDF(pedido, usuario = {}) {
  const totalBruto = Number(pedido.total) || 0;
  const valorNeto = Math.round(totalBruto / 1.19);
  const montoIva = totalBruto - valorNeto;

  const items = pedido.items && pedido.items.length > 0
    ? pedido.items
    : [{ nombre: pedido.producto, cantidad: 1, valor: totalBruto }];

  const filasHtml = items
    .map((item) => {
      const subtotalItem = (Number(item.valor) || totalBruto) * (Number(item.cantidad) || 1);
      const netoItem = Math.round(subtotalItem / 1.19);
      return `
        <tr>
          <td>${item.nombre}</td>
          <td class="text-right">${item.cantidad || 1}</td>
          <td class="text-right">${formatCLP(netoItem)}</td>
          <td class="text-right">${formatCLP(subtotalItem)}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <div class="header">
      <div>
        <div class="brand">MEYER EXPRESS</div>
        <div style="font-size:12px; color:#555;">Plataforma de Comercio Escolar y Emprendedores<br/>RUT: 76.543.210-K • Osorno, Chile</div>
      </div>
      <div class="doc-box">
        <div class="doc-title">Comprobante de Venta<br/>(Boleta / Factura)</div>
        <div class="doc-folio">N° ${String(pedido.id).padStart(6, '0')}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div><strong>Cliente:</strong> ${usuario?.name || 'Cliente Registrado'}</div>
      <div><strong>Fecha Transacción:</strong> ${pedido.fechaEnvio || new Date().toLocaleDateString('es-CL')}</div>
      <div><strong>RUT Cliente:</strong> ${usuario?.rut || '11.111.111-1'}</div>
      <div><strong>Estado Pedido:</strong> ${pedido.estado}</div>
      <div><strong>Medio de Pago:</strong> ${pedido.metodoPago}</div>
      <div><strong>Respaldo Pago:</strong> ${pedido.detallePago}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Descripción del Artículo / Servicio</th>
          <th class="text-right">Cant.</th>
          <th class="text-right">Valor Neto</th>
          <th class="text-right">Total (c/IVA)</th>
        </tr>
      </thead>
      <tbody>
        ${filasHtml}
      </tbody>
    </table>

    <div class="totales">
      <div class="totales-row">
        <span>Monto Neto (sin IVA):</span>
        <span>${formatCLP(valorNeto)}</span>
      </div>
      <div class="totales-row">
        <span>IVA (19%):</span>
        <span>${formatCLP(montoIva)}</span>
      </div>
      <div class="totales-final">
        <span>TOTAL COBRADO:</span>
        <span>${formatCLP(totalBruto)}</span>
      </div>
    </div>

    <div class="footer-note">
      Documento tributario generado electrónicamente por Meyer Express.<br/>
      Medio de pago verificado: ${pedido.metodoPago} — ${pedido.detallePago}.
    </div>
  `;

  console.log('[BACKEND PENDIENTE] GET /api/documentos/boleta-factura/' + pedido.id + '/pdf', {
    folio: pedido.id,
    valorNeto,
    iva19: montoIva,
    totalCobrado: totalBruto,
    medioPago: pedido.metodoPago,
    detallePago: pedido.detallePago,
  });

  abrirVentanaImpresion(`Comprobante_Venta_${pedido.id}`, html);
}

/**
 * 2. Documento de Cotización Formal (Vigencia estipulada de 15 días)
 */
export function generarCotizacionPDF(cotizacion, usuario = {}) {
  const totalCotizado = cotizacion.items.reduce(
    (acc, item) => acc + (Number(item.valor) || 0) * (Number(item.cantidad) || 1),
    0
  );
  const netoCotizado = Math.round(totalCotizado / 1.19);
  const ivaCotizado = totalCotizado - netoCotizado;

  const filasHtml = cotizacion.items
    .map((item) => {
      const subtotal = (Number(item.valor) || 0) * (Number(item.cantidad) || 1);
      const variantes = [
        item.tallaSeleccionada ? `Talla: ${item.tallaSeleccionada}` : '',
        item.colorSeleccionado ? `Color: ${item.colorSeleccionado}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      return `
        <tr>
          <td>
            <strong>${item.nombre}</strong>
            ${variantes ? `<br/><span style="font-size:11.5px; color:#555;">${variantes}</span>` : ''}
          </td>
          <td class="text-right">${item.cantidad}</td>
          <td class="text-right">${formatCLP(item.valor)}</td>
          <td class="text-right">${formatCLP(subtotal)}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <div class="header">
      <div>
        <div class="brand">MEYER EXPRESS</div>
        <div style="font-size:12px; color:#555;">Proveedor / Emprendedor: <strong>${cotizacion.vendedor}</strong><br/>Osorno, Región de Los Lagos</div>
      </div>
      <div class="doc-box">
        <div class="doc-title">Cotización Comercial</div>
        <div class="doc-folio">${cotizacion.codigo}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div><strong>Solicitante:</strong> ${usuario?.name || 'Cliente Meyer Express'}</div>
      <div><strong>Fecha de Emisión:</strong> ${cotizacion.fechaEmision}</div>
      <div><strong>RUT Solicitante:</strong> ${usuario?.rut || '11.111.111-1'}</div>
      <div><strong>Fecha Expiración (15 días):</strong> ${cotizacion.fechaVence}</div>
      <div><strong>Estado Solicitud:</strong> ${cotizacion.estado}</div>
      <div><strong>Plazo de Vigencia:</strong> 15 días corridos desde emisión</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Producto / Servicio Cotizado</th>
          <th class="text-right">Cantidad</th>
          <th class="text-right">Precio Unitario</th>
          <th class="text-right">Subtotal Vigente</th>
        </tr>
      </thead>
      <tbody>
        ${filasHtml}
      </tbody>
    </table>

    <div class="totales">
      <div class="totales-row">
        <span>Total Neto Estimado:</span>
        <span>${formatCLP(netoCotizado)}</span>
      </div>
      <div class="totales-row">
        <span>IVA (19%):</span>
        <span>${formatCLP(ivaCotizado)}</span>
      </div>
      <div class="totales-final">
        <span>TOTAL COTIZACIÓN:</span>
        <span>${formatCLP(totalCotizado)}</span>
      </div>
    </div>

    <div class="footer-note">
      <strong>Condiciones Comerciales:</strong> Esta cotización tiene una vigencia estricta de <strong>15 días corridos</strong> a partir de su fecha de emisión (${cotizacion.fechaEmision}), expirando el ${cotizacion.fechaVence}. Transcurrido dicho plazo, los valores quedan sujetos a reajuste semanal automático conforme a las políticas de la plataforma.
    </div>
  `;

  console.log('[BACKEND PENDIENTE] GET /api/documentos/cotizacion/' + cotizacion.codigo + '/pdf', {
    codigo: cotizacion.codigo,
    fechaEmision: cotizacion.fechaEmision,
    fechaExpiracion15Dias: cotizacion.fechaVence,
    estado: cotizacion.estado,
    totalCotizado,
  });

  abrirVentanaImpresion(`Cotizacion_${cotizacion.codigo}`, html);
}

/**
 * 3. Reporte Operativo de Historial Transaccional y Devoluciones
 */
export function generarHistorialTransaccionalPDF(transacciones = [], devoluciones = [], usuario = {}) {
  const totalCompras = transacciones
    .filter((t) => t.estado === 'Completada')
    .reduce((acc, t) => acc + (Number(t.total) || 0), 0);

  const totalReintegrado = devoluciones
    .filter((d) => d.estado === 'Aprobada')
    .reduce((acc, d) => acc + (Number(d.montoReintegrado) || 0), 0);

  const filasCompras = transacciones
    .map(
      (t) => `
      <tr>
        <td>TRX-${String(t.id).padStart(4, '0')}</td>
        <td>${t.fecha || '2026-10-25'}</td>
        <td>${t.tipo}</td>
        <td>${t.metodoPago} (${t.detallePago})</td>
        <td>${t.estado}</td>
        <td class="text-right">${formatCLP(t.total)}</td>
      </tr>
    `
    )
    .join('');

  const filasDevoluciones = devoluciones
    .map(
      (d) => `
      <tr>
        <td>DEV-${String(d.id).padStart(4, '0')}</td>
        <td>${d.cliente}</td>
        <td>${d.producto}</td>
        <td>${d.motivo}</td>
        <td>${d.estado}</td>
        <td class="text-right">${formatCLP(d.montoReintegrado)}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div class="header">
      <div>
        <div class="brand">MEYER EXPRESS</div>
        <div style="font-size:12px; color:#555;">Auditoría y Control Financiero<br/>Reporte Operativo Consolidado</div>
      </div>
      <div class="doc-box">
        <div class="doc-title">Historial Transaccional</div>
        <div class="doc-folio">Emisión: ${new Date().toLocaleDateString('es-CL')}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div><strong>Titular Cuenta:</strong> ${usuario?.name || 'Usuario Registrado'}</div>
      <div><strong>RUT:</strong> ${usuario?.rut || '11.111.111-1'}</div>
      <div><strong>Operaciones Registradas:</strong> ${transacciones.length} transacciones</div>
      <div><strong>Devoluciones Auditadas:</strong> ${devoluciones.length} solicitudes</div>
    </div>

    <h3 style="color:#c3552b; font-size:14px; margin-bottom:8px;">1. Flujo Histórico de Compras y Pagos</h3>
    <table>
      <thead>
        <tr>
          <th>Folio</th>
          <th>Fecha</th>
          <th>Operación</th>
          <th>Medio de Pago y Respaldo</th>
          <th>Estado</th>
          <th class="text-right">Monto</th>
        </tr>
      </thead>
      <tbody>
        ${filasCompras}
      </tbody>
    </table>

    <h3 style="color:#c3552b; font-size:14px; margin-bottom:8px;">2. Devoluciones Aprobadas por Cliente y Capital Reintegrado</h3>
    <table>
      <thead>
        <tr>
          <th>Folio Dev.</th>
          <th>Cliente</th>
          <th>Producto</th>
          <th>Motivo de Devolución</th>
          <th>Estado</th>
          <th class="text-right">Capital Reintegrado</th>
        </tr>
      </thead>
      <tbody>
        ${filasDevoluciones}
      </tbody>
    </table>

    <div class="totales" style="width: 340px;">
      <div class="totales-row">
        <span>Total Compras Completadas:</span>
        <span>${formatCLP(totalCompras)}</span>
      </div>
      <div class="totales-row">
        <span>Total Capital Reintegrado (Aprobado):</span>
        <span>- ${formatCLP(totalReintegrado)}</span>
      </div>
      <div class="totales-final">
        <span>BALANCE NETO OPERATIVO:</span>
        <span>${formatCLP(totalCompras - totalReintegrado)}</span>
      </div>
    </div>

    <div class="footer-note">
      Certificado operativo emitido por el módulo de reportes de Meyer Express.
    </div>
  `;

  console.log('[BACKEND PENDIENTE] GET /api/documentos/historial-transaccional/pdf', {
    usuarioRut: usuario?.rut,
    totalComprasCompletadas: totalCompras,
    totalCapitalReintegrado: totalReintegrado,
    balanceNeto: totalCompras - totalReintegrado,
  });

  abrirVentanaImpresion('Historial_Transaccional_MeyerExpress', html);
}