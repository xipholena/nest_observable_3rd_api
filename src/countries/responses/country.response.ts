import { Country } from "../entities/country.entity";

export class CountryResponse {
    commonName: string;
    officialName: string;
    countryCode: string;
    region: string;
    borders: Country[];
}
