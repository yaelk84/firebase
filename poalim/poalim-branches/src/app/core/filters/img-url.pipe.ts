import { Pipe, PipeTransform } from '@angular/core';
import {environment} from '../../../environments/environment';

@Pipe({
  name: 'imgUrl'
})
export class ImgUrlPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const path = environment.imgUrlPath;
    value = path + value;
    return value;
  }

}
