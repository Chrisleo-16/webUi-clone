import FeeManagementService from "@/helpers/Api/fees/fee.service";
import { ExchangeFees } from "@/helpers/interfaces/ExchangeFees";
import { FeeModel } from "@/helpers/interfaces/FeeModel";

class BackedAdminManageFee {
 
  private feeService: FeeManagementService;

  constructor(feeService: FeeManagementService) {
    this.feeService = feeService;
  }

  async getAllFee(): Promise<{ success: boolean; data: FeeModel[]; error?: string }> {
    try {
      const response = await this.feeService.getAllFees();
      if (response.statusCode === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: `Unexpected status code: ${response.statusCode}`,data:[] };
      }
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred while fetching fees",data:[] };
    }
  }

  async disableFee(fee:FeeModel): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.feeService.disableFee(fee.fee_type, fee.currency);
      if (response.statusCode === 200) {
        return { success: true };
      } else {  
        return { success: false, error: `Unexpected status code: ${response.statusCode}` };
      }
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred while disabling fee" };
    }
  }


  async updateFee(fee:FeeModel): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.feeService.updateFee(fee);
      if (response.statusCode === 200) {
        return { success: true };
      } else {  
        return { success: false, error: `Unexpected status code: ${response.statusCode}` };
      }
  }
  catch (error: any) {
    return { success: false, error: error.message || "An error occurred while updating fee" };
  }

  

  }
  async getSimpleSwapFees(): Promise<{ success: boolean; data: ExchangeFees; error?: string }> {
    try {
      const response = await this.feeService.getSimpleSwapFees();
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as ExchangeFees,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
  


}

export default new BackedAdminManageFee(new FeeManagementService());