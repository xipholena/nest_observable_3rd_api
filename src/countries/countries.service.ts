import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; 
import { AxiosResponse } from 'axios';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { CountryCode } from './entities/country-code.entity';
import { ConfigService } from '@nestjs/config';
import { CountryCodes } from './responses/codes.response';
import { Country } from './entities/country.entity';
import { PopulationByYear } from './responses/population.response';
import { CountryInfoResponse } from './responses/countryInfo.response';


@Injectable()
export class CountriesService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}
  async findAllISO2Codes(): Promise<Observable<AxiosResponse<CountryCode[]>>> {
    const dateNagerBaseURL = this.configService.get<string>('DATE_NAGER_BASE_URL');
    const response = await this.httpService.get(`${dateNagerBaseURL}/AvailableCountries`).pipe(map(response => response?.data));
    
    return response
  }

   async findISOCodes(countryName):Promise<CountryCodes>{
    const COUNTRIESNOW_SPACE_BASE_URL = this.configService.get<string>('COUNTRIESNOW_SPACE_BASE_URL');
    const response = await this.httpService.post(`${COUNTRIESNOW_SPACE_BASE_URL}/iso`, {country: countryName})
        .pipe(map(response => response?.data?.data));
    return firstValueFrom(response);
  }
  
  async getBorderingCountries(Iso2): Promise<Country[]> {
    const DATE_NAGER_BASE_URL = this.configService.get<string>('DATE_NAGER_BASE_URL');
    const response = await this.httpService.get(`${DATE_NAGER_BASE_URL}/CountryInfo/${Iso2}`)
    .pipe(map(response => response?.data?.borders));

    return firstValueFrom(response);
  }

  async getPopulation(iso3): Promise<PopulationByYear[]> {
    const COUNTRIESNOW_SPACE_BASE_URL = this.configService.get<string>('COUNTRIESNOW_SPACE_BASE_URL');
    const response = await this.httpService.post(`${COUNTRIESNOW_SPACE_BASE_URL}/population`, {iso3})
        .pipe(map(response => response?.data?.data?.populationCounts));
    return firstValueFrom(response);
  }
  async getFlag(iso2): Promise<string> {
    const COUNTRIESNOW_SPACE_BASE_URL = this.configService.get<string>('COUNTRIESNOW_SPACE_BASE_URL');
    const response = await this.httpService.post(`${COUNTRIESNOW_SPACE_BASE_URL}/flag/images`, {iso2})
    .pipe(map(response => response?.data?.data?.flag));
    return firstValueFrom(response);
  }
  
  async findOne(countryName: string): Promise<CountryInfoResponse>/*: Promise<CountryCodes>*/  {
    const countryCodes = await this.findISOCodes(countryName)

    const borderingCountries = await this.getBorderingCountries(countryCodes?.Iso2)
 
    const population = await this.getPopulation(countryCodes?.Iso3)

    const flag = await this.getFlag(countryCodes?.Iso2)

    return {country: countryName, borderingCountries, population, flag};
  }

}
