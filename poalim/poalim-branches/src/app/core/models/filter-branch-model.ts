
export class FilterBranch {
  constructor(private id: number,
              private  type: string,
              private  text: string,
              private  withPic: boolean,
              private field: string,
              private values: Array<string>,
              private filterOn: boolean
  ) {

  }
}


