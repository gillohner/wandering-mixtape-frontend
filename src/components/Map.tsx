import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "./Map.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ImageWithLightbox from "./ImageWithLightbox.tsx";
import { ImageData } from "../types";
import MarkerClusterGroup from "react-leaflet-cluster";

const Map: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1337/api/images?populate=*"
      );
      const fetchedImages = response.data.data;
      setImages(fetchedImages);

      const types = [
        ...new Set(fetchedImages.map((image: ImageData) => image.type)),
      ];
      setUniqueTypes(types);
      setSelectedTypes(new Set(types)); // Initially select all types

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch images");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openLightbox = (imageUrl: string) => {
    const selectedImages = images.filter((img) => selectedTypes.has(img.type));
    const index = selectedImages.findIndex(
      (img) =>
        `http://localhost:1337${img.image.formats.large.url}` === imageUrl
    );
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleOverlayChange = (e: L.LayersControlEvent) => {
    const { name, type } = e;
    setSelectedTypes((prev) => {
      const newSet = new Set(prev);
      if (type === "overlayadd") {
        newSet.add(name);
      } else if (type === "overlayremove") {
        newSet.delete(name);
      }
      return newSet;
    });
  };

  const LayersControlEventHandler = () => {
    const map = useMap();
    useEffect(() => {
      map.on("overlayadd overlayremove", handleOverlayChange);
      return () => {
        map.off("overlayadd overlayremove", handleOverlayChange);
      };
    }, [map]);
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const selectedImages = images.filter((img) => selectedTypes.has(img.type));
  const slides = selectedImages.map((img) => ({
    src: `http://localhost:1337${img.image.formats.large.url}`,
  }));

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LayersControl position="topright">
        {uniqueTypes.map((type) => (
          <LayersControl.Overlay key={type} name={type} checked>
            <MarkerClusterGroup chunkedLoading>
              {images
                .filter(
                  (image) => image.type === type && selectedTypes.has(type)
                )
                .map((image) => {
                  const customIcon = L.divIcon({
                    className: "rounded-icon",
                    html: `<img src="http://localhost:1337${image.image.formats.small.url}" style="width: 26px; height: 26px; border-radius: 25%;">`,
                    iconSize: [26, 26],
                    iconAnchor: [13, 26],
                    popupAnchor: [0, -26],
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
                          <ImageWithLightbox
                            src={`http://localhost:1337${image.image.formats.large.url}`}
                            alt={image.locationName}
                            openLightbox={openLightbox}
                          />
                        )}
                        {image.description.map((para, index) => (
                          <p key={index}>
                            {para.children.map((child, childIndex) => (
                              <span
                                key={childIndex}
                                style={{
                                  fontWeight: child.bold ? "bold" : "normal",
                                  fontStyle: child.italic ? "italic" : "normal",
                                  textDecoration: child.underline
                                    ? "underline"
                                    : "none",
                                }}
                              >
                                {child.text}
                              </span>
                            ))}
                          </p>
                        ))}
                        <p className="imageType">
                          <i>{image.type}</i>
                        </p>
                      </Popup>
                    </Marker>
                  );
                })}
            </MarkerClusterGroup>
          </LayersControl.Overlay>
        ))}
      </LayersControl>
      <LayersControlEventHandler />
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={currentImageIndex}
      />
    </MapContainer>
  );
};

export default Map;
