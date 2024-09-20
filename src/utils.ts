export const decodeJWT = (token: string) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export const formatDateMMDDYYYY = (date?: Date | string) => {
  if (typeof date === 'string') date = new Date(date)
  if (!date) date = new Date()
  return date?.toLocaleDateString('en-US', { timeZone: 'UTC' })
}