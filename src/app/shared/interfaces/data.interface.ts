export interface APIResponse <T>{
    results: T; // Interface de tipo generico
}
export interface DataResponse{
    characters: APIResponse<Characters[]>;
    episodes: APIResponse<Episodes[]>;
}
export interface Characters{
    id: number;
    name: string;
    status: string;
    species: string;
    gender: string;
    image: string;
    isFavorite?: boolean // Opcional con el ?
}
export interface Episodes{
    name:string;
    episode:string
}