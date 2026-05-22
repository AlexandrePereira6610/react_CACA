const DB_NAME = 'CACA_Database';
const DB_VERSION = 1;

const STORES = {
    EVENTOS: 'eventos',
    NEWSLETTER: 'newsletter'
};

let db = null;

// Abre a base de dados IndexedDB
function openDatabase() {
    return new Promise((resolve, reject) => {
        if (db && db.name === DB_NAME) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = function(event) {
            console.error('Erro ao abrir IndexedDB:', event.target.error);
            reject('Erro ao abrir base de dados');
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            console.log('IndexedDB aberto com sucesso');
            resolve(db);
        };

        request.onupgradeneeded = function(event) {
            const database = event.target.result;

            // Cria store de Eventos
            if (!database.objectStoreNames.contains(STORES.EVENTOS)) {
                const eventosStore = database.createObjectStore(STORES.EVENTOS, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                eventosStore.createIndex('data', 'data', { unique: false });
                eventosStore.createIndex('titulo', 'titulo', { unique: false });
                console.log('Store de Eventos criada');
            }

            // Cria store de Newsletter
            if (!database.objectStoreNames.contains(STORES.NEWSLETTER)) {
                const newsletterStore = database.createObjectStore(STORES.NEWSLETTER, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                newsletterStore.createIndex('email', 'email', { unique: true });
                newsletterStore.createIndex('nome', 'nome', { unique: false });
                console.log('Store de Newsletter criada');
            }
        };
    });
}

// Funções CRUD  EVENTOS

// Adiciona um novo evento
export function adicionarEvento(evento) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.EVENTOS], 'readwrite');
            const store = transaction.objectStore(STORES.EVENTOS);

            if (!evento.titulo || !evento.descricao || !evento.data || !evento.hora || !evento.local) {
                reject('Todos os campos do evento são obrigatórios');
                return;
            }

            const request = store.add({
                titulo: evento.titulo,
                descricao: evento.descricao,
                data: evento.data,
                hora: evento.hora,
                local: evento.local,
                dataCriacao: new Date().toISOString()
            });

            request.onsuccess = function() { resolve(request.result); };
            request.onerror = function() { reject('Erro ao adicionar evento'); };
        } catch (error) {
            reject(error);
        }
    });
}

// Obtém todos os eventos
export function obterTodosEventos() {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.EVENTOS], 'readonly');
            const store = transaction.objectStore(STORES.EVENTOS);
            const request = store.getAll();

            request.onsuccess = function() {
                const eventos = request.result || [];
                eventos.sort((a, b) => new Date(b.data) - new Date(a.data));
                resolve(eventos);
            };

            request.onerror = function() { reject('Erro ao obter eventos'); };
        } catch (error) {
            reject(error);
        }
    });
}

// Obtém um evento pelo ID
export function obterEventoPorId(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.EVENTOS], 'readonly');
            const store = transaction.objectStore(STORES.EVENTOS);
            const request = store.get(id);

            request.onsuccess = function() {
                if (request.result) { resolve(request.result); }
                else { reject('Evento não encontrado'); }
            };

            request.onerror = function() { reject('Erro ao obter evento'); };
        } catch (error) {
            reject(error);
        }
    });
}

// Atualiza um evento existente
export function atualizarEvento(id, novosDados) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.EVENTOS], 'readwrite');
            const store = transaction.objectStore(STORES.EVENTOS);
            const request = store.get(id);

            request.onsuccess = function() {
                const evento = request.result;
                if (!evento) { reject('Evento não encontrado'); return; }

                evento.titulo = novosDados.titulo || evento.titulo;
                evento.descricao = novosDados.descricao || evento.descricao;
                evento.data = novosDados.data || evento.data;
                evento.hora = novosDados.hora || evento.hora;
                evento.local = novosDados.local || evento.local;
                evento.dataAtualizacao = new Date().toISOString();

                const updateRequest = store.put(evento);
                updateRequest.onsuccess = function() { resolve(true); };
                updateRequest.onerror = function() { reject('Erro ao atualizar evento'); };
            };

            request.onerror = function() { reject('Erro ao buscar evento para atualizar'); };
        } catch (error) {
            reject(error);
        }
    });
}

// Remove um evento pelo ID
export function removerEvento(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.EVENTOS], 'readwrite');
            const store = transaction.objectStore(STORES.EVENTOS);
            const request = store.delete(id);

            request.onsuccess = function() { resolve(true); };
            request.onerror = function() { reject('Erro ao remover evento'); };
        } catch (error) {
            reject(error);
        }
    });
}


// Funções a NEWSLETTER


// Verifica se um email já está subscrito
export function verificarEmailExiste(email) {
    return new Promise(async (resolve) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.NEWSLETTER], 'readonly');
            const store = transaction.objectStore(STORES.NEWSLETTER);
            const index = store.index('email');
            const request = index.get(email);

            request.onsuccess = function() { resolve(!!request.result); };
            request.onerror = function() { resolve(false); };
        } catch (error) {
            resolve(false);
        }
    });
}

// Adiciona um novo subscritor da newsletter
export function adicionarSubscritor(subscritor) {
    return new Promise(async (resolve, reject) => {
        try {
            const existe = await verificarEmailExiste(subscritor.email);
            if (existe) {
                reject('Este email já está subscrito na nossa newsletter!');
                return;
            }

            const database = await openDatabase();
            const transaction = database.transaction([STORES.NEWSLETTER], 'readwrite');
            const store = transaction.objectStore(STORES.NEWSLETTER);

            const request = store.add({
                nome: subscritor.nome,
                email: subscritor.email,
                dataSubscricao: new Date().toISOString()
            });

            request.onsuccess = function() { resolve(true); };
            request.onerror = function() { reject('Erro ao adicionar subscritor'); };
        } catch (error) {
            reject(error);
        }
    });
}

// Obtém todos os subscritores
export function obterTodosSubscritores() {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.NEWSLETTER], 'readonly');
            const store = transaction.objectStore(STORES.NEWSLETTER);
            const request = store.getAll();

            request.onsuccess = function() { resolve(request.result || []); };
            request.onerror = function() { reject('Erro ao obter subscritores'); };
        } catch (error) {
            reject(error);
        }
    });
}

// Remove um subscritor pelo email
export function removerSubscritor(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.NEWSLETTER], 'readwrite');
            const store = transaction.objectStore(STORES.NEWSLETTER);
            const index = store.index('email');
            const request = index.get(email);

            request.onsuccess = function() {
                const subscritor = request.result;
                if (subscritor) {
                    const deleteRequest = store.delete(subscritor.id);
                    deleteRequest.onsuccess = function() { resolve(true); };
                    deleteRequest.onerror = function() { reject('Erro ao remover subscritor'); };
                } else {
                    reject('Subscritor não encontrado');
                }
            };

            request.onerror = function() { reject('Erro ao buscar subscritor'); };
        } catch (error) {
            reject(error);
        }
    });
}