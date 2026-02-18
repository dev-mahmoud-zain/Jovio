export interface I_Location {
    country: string,
    city: string,
    street: string,

    building?: string,
    apartment?: string,
    postalCode?: string,

    latitude?: number,
    longitude?: number,
}