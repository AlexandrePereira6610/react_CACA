const express = require('express');
const axios = require('axios');
const router = express.Router();

const PROXY_URL = 'https://api.rss2json.com/v1/api.json?rss_url=';

// Lista de feeds de saúde
const RSS_FEEDS = [
    'https://www.sns.gov.pt/feed/',
    'https://www.who.int/rss-feeds/news-pt.xml',
    'https://www.news-medical.net/newsrss.ashx'
];

// Função para carregar notícias de um feed
async function carregarFeed(feedUrl) {
    try {
        const url = PROXY_URL + encodeURIComponent(feedUrl);
        const response = await axios.get(url, { timeout: 10000 });

        if (response.data && response.data.items) {
            return response.data.items.map(item => ({
                titulo: item.title || 'Sem título',
                descricao: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                link: item.link || '#',
                data: item.pubDate ? new Date(item.pubDate).toLocaleDateString('pt-PT') : 'Data desconhecida',
                fonte: response.data.feed?.title || 'Fonte de saúde'
            }));
        }
        return [];
    } catch (error) {
        console.error(`Erro no feed ${feedUrl}:`, error.message);
        return [];
    }
}

// GET /api/news - retorna notícias
router.get('/', async (req, res) => {
    try {
        let todasNoticias = [];

        for (const feed of RSS_FEEDS) {
            const noticias = await carregarFeed(feed);
            todasNoticias = [...todasNoticias, ...noticias];
            if (todasNoticias.length >= 12) break;
        }

        // Se não conseguiu carregar nenhuma, retorna mock
        if (todasNoticias.length === 0) {
            todasNoticias = [
                { titulo: 'CACA lança novo programa de investigação', descricao: 'O Centro Académico Clínico dos Açores anuncia...', link: '#', data: new Date().toLocaleDateString('pt-PT'), fonte: 'CACA' },
                { titulo: 'Parceria com hospitais dos Açores', descricao: 'Nova parceria para integração académica...', link: '#', data: new Date().toLocaleDateString('pt-PT'), fonte: 'CACA' },
                { titulo: 'Workshop de IA em Saúde', descricao: 'Inscrições abertas para workshop...', link: '#', data: new Date().toLocaleDateString('pt-PT'), fonte: 'CACA' }
            ];
        }

        // Ordenar por data (mais recentes primeiro)
        todasNoticias.sort((a, b) => {
            if (a.data === 'Data desconhecida') return 1;
            if (b.data === 'Data desconhecida') return -1;
            return new Date(b.data) - new Date(a.data);
        });

        res.json(todasNoticias.slice(0, 12));
    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        res.status(500).json({ error: 'Erro ao carregar notícias' });
    }
});

module.exports = router;