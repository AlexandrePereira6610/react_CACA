// Filtra os países pelo texto inserido no input de pesquisa
export function searchCountry(searchText, countries) {
    return countries.filter(country =>
        country.name.toLowerCase().includes(searchText.toLowerCase())
    );
}