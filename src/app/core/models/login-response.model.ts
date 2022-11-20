import { AdminModel } from "./admin.model";

export interface LoginResponseModel{
  token: string;
  profile : AdminModel;
}
