// Verifica se o email está num formato aceitável
export function validateEmail(email) {
    return email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,3}$/g);
}

// Verifica se o número de telefone está num formato válido
export function validatePhone(phone) {
    const digitos = phone.replace(/[\s\-+()]/g, '').trim();
    return /^\d{7,15}$/.test(digitos);
}