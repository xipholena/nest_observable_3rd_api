import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAllISO2Codes() {
    return this.countriesService.findAllISO2Codes();
  }

  @Get(':country')
  findOne(@Param('country') countryName: string) {
    return this.countriesService.findOne(countryName);
  }
}
