import { Country } from "../entities/country.entity";
import { PopulationByYear } from "./population.response";

export interface CountryInfoResponse {
    country: string, 
    borderingCountries: Country[], 
    population: PopulationByYear[], 
    flag: string
}