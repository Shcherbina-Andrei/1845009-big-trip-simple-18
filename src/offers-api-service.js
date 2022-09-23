import ApiService from './framework/api-service.js';
import {Method} from './const.js';

export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }
}
