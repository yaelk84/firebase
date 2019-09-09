import { Pipe, PipeTransform } from '@angular/core';
import {environment} from '../../../environments/environment';

@Pipe({
  name: 'imgUrl'
})
export class ImgUrlPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const originalImgPath = value.split('').slice(22, value.lenght).join('');
    const path = environment.imgUrlPath;
    const imgPath = path.concat(originalImgPath);
    return imgPath;
  }

}
