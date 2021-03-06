import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, date } = request.query;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const avalability = await listProviderDayAvailability.execute({
      provider_id,
      date: Number(date),
      month: Number(month),
      year: Number(year),
    });
    return response.json(avalability);
  }
}
