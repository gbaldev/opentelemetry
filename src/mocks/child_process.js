module.exports = {
    exec: (command, callback) => {
      setTimeout(() => {
        callback(null, 'Simulated exec output');
      }, 1000);
    },
  };
  