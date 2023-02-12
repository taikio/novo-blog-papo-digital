/**
 * Esta função cria um lazy load em funções assíncronas, ideal para campos de pesquisa.
 * @param {callback} function função que será executada após o timer
 * @param {wait} Integer tempo em milissegundos que a função deve aguardar
 */
export const useDebounce = (callback: Function, wait: number) => {
  let timeout: any
  // args = parametros passados para o callback
  return (...args: any) => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    timeout = setTimeout(() => {
      callback(...args)
    }, wait)
  }
}
