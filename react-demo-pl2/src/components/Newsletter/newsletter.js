// Valida o formato do email
export function validarEmailNewsletter(email) {
    const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return regex.test(email);
}

// Valida o nome  mínimo 2 caracteres
export function validarNome(nome) {
    return nome.trim().length >= 2;
}