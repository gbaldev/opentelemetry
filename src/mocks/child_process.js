module.exports = {
    exec: (command, callback) => {
      // Simula el comportamiento de exec para que no cause errores.
      // Llamar al callback con null (sin error) y una respuesta simulada.
      setTimeout(() => {
        callback(null, 'Simulated exec output');
      }, 1000);
    },
  };
  