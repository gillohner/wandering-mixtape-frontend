import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

interface ImageData {
    id: number;
    documentId: string;
    locationName: string;
    description: { type: string; children: { text: string; bold?: boolean; italic?: boolean; underline?: boolean }[] }[];
    location: { lat: number; lng: number };
    image: {
        data: {
            attributes: {
                url: string;
                formats: {
                    thumbnail: { url: string };
                    small: { url: string };
                    medium: { url: string };
                    large: { url: string };
                };
            };
        };
    };
}

const Map = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:1337/api/images?populate=*');
            setImages(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch images');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
            <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {images.map(image => {
                const customIcon = L.icon({
                    iconUrl: `http://localhost:1337${image.image.formats.small.url}`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                });

                return (
                    <Marker 
                        key={image.documentId}
                        position={[image.location.lat, image.location.lng]}
                        icon={customIcon}
                    >
                        <Popup>
                            <h3>{image.locationName}</h3>
                            {image.image?.formats && (
                                <img 
                                    src={`http://localhost:1337${image.image.formats.large.url}`}
                                    alt={image.locationName}
                                    style={{ maxWidth: '200px' }}
                                />
                            )}
                            {image.description.map((para, index) => (
                                <p key={index}>
                                    {para.children.map((child, childIndex) => (
                                        <span 
                                            key={childIndex} 
                                            style={{
                                                fontWeight: child.bold ? 'bold' : 'normal',
                                                fontStyle: child.italic ? 'italic' : 'normal',
                                                textDecoration: child.underline ? 'underline' : 'none'
                                            }}
                                        >
                                            {child.text}
                                        </span>
                                    ))}
                                </p>
                            ))}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;
