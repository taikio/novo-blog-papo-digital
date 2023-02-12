export const formatDate = (date: Date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }

  if (date) {
    return new Date(date).toLocaleDateString('pt', options)
  }
  return new Date().toLocaleDateString('pt', options)
}
