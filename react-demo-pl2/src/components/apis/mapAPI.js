let mapaAtual = null;

// Inicializa o mapa
export function inicializarMapa() {
    const L = window.L;
    const mapaDiv = document.getElementById('mapa-container');
    if (!mapaDiv || mapaAtual) return;

    const coordenadasPadrao = [37.739, -25.668];
    const zoomPadrao = 10;

    mapaAtual = L.map('mapa-container').setView(coordenadasPadrao, zoomPadrao);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 8
    }).addTo(mapaAtual);

    console.log('Mapa inicializado com sucesso');
}

// mapa numa localização específica
export function centralizarMapa(lat, lng, zoom = 13) {
    if (mapaAtual) {
        mapaAtual.setView([lat, lng], zoom);
    }
}

// Adiciona um marcador ao mapa
export function adicionarMarcador(lat, lng, titulo, descricao = '') {
    const L = window.L;
    if (!mapaAtual) return;

    const marcador = L.marker([lat, lng]).addTo(mapaAtual);

    if (titulo || descricao) {
        const popupConteudo = `<b>${titulo}</b><br>${descricao}`;
        marcador.bindPopup(popupConteudo);
    }

    return marcador;
}

// Remove todos os marcadores do mapa
export function removerTodosMarcadores() {
    const L = window.L;
    if (!mapaAtual) return;

    mapaAtual.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            mapaAtual.removeLayer(layer);
        }
    });
}

// obter endereço a partir de coordenadas
export async function obterEnderecoPorCoordenadas(lat, lng) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`;
        const response = await fetch(url);
        const dados = await response.json();

        if (dados && dados.display_name) {
            return dados.display_name;
        }
        return 'Endereço não encontrado';
    } catch (error) {
        console.error('Erro ao obter endereço:', error);
        return 'Erro ao obter endereço';
    }
}

// obtee coordenadas a partir de um endereço
export async function obterCoordenadasPorEndereco(endereco) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&accept-language=pt&limit=1`;
        const response = await fetch(url);
        const dados = await response.json();

        if (dados && dados.length > 0) {
            return {
                lat: parseFloat(dados[0].lat),
                lng: parseFloat(dados[0].lon),
                display_name: dados[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error('Erro ao obter coordenadas:', error);
        return null;
    }
}

// Mostra a localização de um evento no mapa
export async function mostrarLocalEventoNoMapa(local, tituloEvento, setMensagem) {
    setMensagem({ texto: `A procurar localização: ${local}...`, tipo: '' });

    try {
        const coordenadas = await obterCoordenadasPorEndereco(local + ', Açores, Portugal');

        if (coordenadas) {
            removerTodosMarcadores();
            centralizarMapa(coordenadas.lat, coordenadas.lng, 14);
            adicionarMarcador(coordenadas.lat, coordenadas.lng, tituloEvento, local);

            setMensagem({ texto: `📍 Localização encontrada: ${coordenadas.display_name.substring(0, 100)}`, tipo: 'sucesso' });
            setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
        } else {
            setMensagem({ texto: `Não foi possível encontrar a localização: ${local}`, tipo: 'erro' });
            setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
        }
    } catch (error) {
        console.error('Erro ao buscar localização:', error);
        setMensagem({ texto: 'Erro ao buscar localização. Tente novamente.', tipo: 'erro' });
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    }
}

// Mostra todos os eventos no mapa
export async function mostrarTodosEventosNoMapa(eventos, setMensagem) {
    if (!eventos || eventos.length === 0) {
        alert('Não há eventos para mostrar no mapa');
        return; }

    try {
        removerTodosMarcadores();
        centralizarMapa(37.739, -25.668, 9);

        let eventosEncontrados = 0;

        for (const evento of eventos) {
            const coordenadas = await obterCoordenadasPorEndereco(evento.local + ', Açores, Portugal');

            if (coordenadas) {
                adicionarMarcador(coordenadas.lat,coordenadas.lng, evento.titulo, `${evento.local}<br>${evento.data} às ${evento.hora}` );
                eventosEncontrados++;}
        }

        alert(`Foram mostrados ${eventosEncontrados} de ${eventos.length} eventos no mapa`);

    } catch (error) {
        console.error('Erro ao mostrar eventos no mapa:', error);
        alert('Erro ao carregar eventos para o mapa');
    }
}