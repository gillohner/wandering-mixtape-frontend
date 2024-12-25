export interface ImageData {
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
