import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const term = queryParams.get('term');
        setSearchTerm(term);
        fetchProductsBySearchTerm(term);
    }, [location.search]);

    const fetchProductsBySearchTerm = async (term) => {
        try {
            const response = await fetch(`http://localhost:3000/api/products?search=${term}`);
            if (!response.ok) {
                throw new Error('Error fetching search results');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        
        <div>
            <h2>Search Results for "{searchTerm}"</h2>
            {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map((product) => (
                        <li key={product.id}>
                            <h3>{product.name}</h3>
                            <p>Description: {product.description}</p>
                            <p>Price: ${product.price}</p>
                            {/* Render other product details as needed */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found for "{searchTerm}"</p>
            )}
        </div>
    );
};

export default SearchResults;