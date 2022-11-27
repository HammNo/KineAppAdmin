import { AdminModel } from "./admin.model";

export interface LoginRequestModel{
  username: string;
  password: string;
}

export interface LoginResponseModel{
  token: string;
  profile : AdminModel;
}
