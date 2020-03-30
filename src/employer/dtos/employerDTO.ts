export interface EmployerDTO {
  companyName: string;
  companyDescription: string;
  user: {
    userId: string;
    username: string;
    email: string;
  };
}
