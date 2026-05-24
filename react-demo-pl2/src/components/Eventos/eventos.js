// Valida se todos os campos do evento estão preenchidos
export function validarEvento(titulo, descricao, data, hora, local) {
    if (!titulo || !descricao || !data || !hora || !local) {
        return 'Por favor, preencha todos os campos!';
    }
    return null;
}

// Formata a data para o formato PT
export function formatarData(data) {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-PT');
}

// descrição 
export function truncarDescricao(descricao, max = 50) {
    return descricao.length > max ? descricao.substring(0, max) + '...' : descricao;
}