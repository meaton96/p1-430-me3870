//Fetches data at the given endpoint and returns the json response
const fetchJsonEndpoint = async (endpoint) => {
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (err) {
        //console.error('Error:', err);
        return { error: `Failed to load card data: ${err.message}` };
    }
}

const deleteCard = async (cardId) => {
    try {
        const response = await fetch(`/api/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error('Error:', err);
        return { error: `Failed to delete card: ${err.message}` };
    }
}


export { fetchJsonEndpoint, deleteCard };