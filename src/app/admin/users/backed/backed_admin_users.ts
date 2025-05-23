import UserService from "@/helpers/Api/users/User.service";
import UserDtoModel from "@/helpers/interfaces/UserDtoModel";

export interface UserAdminModel{
    users:UserDtoModel[];
}

export interface UserUpdateModel{
    username:string;
    email:string;
    user_id:string;
}
class BackedAdminUsers {
  
    private userService: UserService;
    constructor(userService: UserService){
        this.userService = userService;
    }
    async getAllUsers(): Promise<UserAdminModel> {
    {
     const allusers:UserDtoModel[] =await  this.userService.getAllUsers();
     return {
        users:allusers
     }
    }
}

async updateuserDetails(userUpdateDetails: UserUpdateModel): Promise<{ success: boolean; message: string }> {
    try {
        const response = await this.userService.updateUserDetails(
            userUpdateDetails.user_id,
            userUpdateDetails.username,
            userUpdateDetails.email
        );
        return { success: true, message: response.message };
    } catch (error:any) {
        return { success: false, message: error.message || "Failed to update user details" };
    }
}


async deleteUser(user_id: any): Promise<{ success: boolean; message: string }> {
    try {
        const response = await this.userService.deleteUser(user_id);
        return { success: response.success || true, message: response.message || "User deleted successfully" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete user" };
    }
}

async updateUserStatus(activeUser: UserDtoModel): Promise<{ success: boolean; message: string }> {
    try {
        const newStatus = !activeUser.isaccountactive;
        const response = await this.userService.updateUserStatus(activeUser.user_id, newStatus ? "active" : "inactive");
        return { success: response.success || true, message: response.message || "User status updated successfully" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update user status" };
    }
}








}

export default new BackedAdminUsers(new UserService());