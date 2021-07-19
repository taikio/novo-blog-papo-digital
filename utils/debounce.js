/**
 * Esta função cria um lazy load em funções assíncronas, ideal para campos de pesquisa.
 * * use a função assim: const debouncedCallback = debounceFactory(callback, 400);
 * @param {callback} function função que será executada após o timer
 * @param {wait} Integer tempo em milissegundos que a função deve aguardar
 */
function DebounceFactory(callback, wait) {
  let timeout;
  // args = parametros passados para o callback
  return (...args) => {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      callback.apply(context, args);
    }, wait);
  };
}

export default DebounceFactory
