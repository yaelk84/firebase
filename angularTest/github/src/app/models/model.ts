export interface IResult {
 repoName: string;
 repoAvatar: string
}

export interface IServerDataItem {
  name: string;
  owner: {
    avatar_url:string
  }
}

export interface IUser {
  name: string;
  password:string;
}
  export enum IHttpType {
  post = 'post',
  put = 'put',
  get = 'get',

}
