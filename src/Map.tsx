import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import './Map.css';
import { FaExpand } from 'react-icons/fa';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
    type: string;
}

const Map = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    
    const openLightbox = (imageUrl) => {
        setCurrentImage(imageUrl);
        setLightboxOpen(true);
    };

    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:1337/api/images?populate=*');
            const fetchedImages = response.data.data;
            setImages(fetchedImages);
            
            // Extract unique types
            const types = [...new Set(fetchedImages.map((image: ImageData) => image.type))];
            setUniqueTypes(types);
            
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
        <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '100vh', width: '100%' }}>
            <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LayersControl position="topright">
                {uniqueTypes.map(type => (
                    <LayersControl.Overlay key={type} name={type} checked>
                        {images.filter(image => image.type === type).map(image => {
                            const customIcon = L.icon({
                                iconUrl: `http://localhost:1337${image.image.formats.small.url}`,
                                iconSize: [46, 46],
                                iconAnchor: [23, 46],
                                popupAnchor: [0, -46],
                            });

                            return (
                                <Marker 
                                    key={image.documentId}
                                    position={[image.location.lat, image.location.lng]}
                                    icon={customIcon}
                                >
                                    <Popup minWidth="300px" className="popup">
                                        <h3>{image.locationName}</h3>
                                        {image.image?.formats && (
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <img 
                                                src={`http://localhost:1337${image.image.formats.large.url}`}
                                                alt={image.locationName}
                                                style={{ maxWidth: '280px' }}
                                                />
                                                <FaExpand 
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '10px',
                                                        right: '10px',
                                                        cursor: 'pointer',
                                                        color: 'white',
                                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                                        padding: '5px',
                                                        borderRadius: '5px'
                                                    }}
                                                    onClick={() => openLightbox(`http://localhost:1337${image.image.formats.large.url}`)}
                                                />
                                            </div>
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
                                        <p className="imageType"><i>{image.type}</i></p>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </LayersControl.Overlay>
                ))}
            </LayersControl>
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={[{ src: currentImage }]}
        
            />  
        </MapContainer>    
    );
};

export default Map;
