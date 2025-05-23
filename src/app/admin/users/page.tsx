"use client";
import { useEffect, useState } from "react";
import BackedAdminUsers, { UserAdminModel, UserUpdateModel } from "./backed/backed_admin_users";
import XmobButton from "@/components/button/xmobitButton";
import HelpFormatter from "@/helpers/utils/xmobFomartUtil";
import XmobTable from "@/components/tables/xmobTable";
import { Delete, Edit, Lock, LockOpen } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import XmobInput from "@/components/inputs/xmobitInput";
import Xmoblayout from "@/components/layouts/xmoblayout";
import UserDtoModel from "@/helpers/interfaces/UserDtoModel";
import { useToast } from "@/app/ToastProvider";
import XmobDropdown from "@/components/dropdown/xmobDropdown";
import MobitCard from "@/components/cards/xmobcard";
import XmobText from "@/components/text/xmobText";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";

export default function AdminManageUsers() {
    const [formattedUsers, setFormattedUsers] = useState<any[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDtoModel>({} as UserDtoModel);
    const [adminList, setAdminList] = useState<UserDtoModel[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const { showToast } = useToast();
    
    useEffect(() => {
        async function fetchData() {
            try {
                const userAdminModelResponse = await BackedAdminUsers.getAllUsers();
                const allUsers = userAdminModelResponse?.users ?? [];
    
                const adminUsers = allUsers.filter(user => 
                    user.roles?.toLowerCase() === "admin" || user.roles?.toLowerCase() === "super_admin"
                );
                setAdminList(adminUsers);
    
                const normalUsers = allUsers.filter(user => 
                    user.roles?.toLowerCase() !== "admin" && user.roles?.toLowerCase() !== "super_admin"
                ).map(user => ({
                    username: user.username,
                    email: user.email,
                    status: user.isaccountactive ? "Active" : "Inactive",
                    auth2fa: user.is2faenabled ? "Enabled" : "Disabled",
                    date_registered: HelpFormatter.formatDate(user.dateregistered),
                    role: user.roles || "Unassigned",
                    actions: (
                        <div className="flex gap-1">
                            <XmobButton isIconButton={true} onClick={() => handleEdit(user)}>
                                <Edit color="success" />
                            </XmobButton>
                            <XmobButton isIconButton={true} onClick={() => handleUpdateUserStatus(user)}>
                                {user.isaccountactive ? <Lock color="secondary" /> : <LockOpen color="secondary" />}
                            </XmobButton>
                            <XmobButton isIconButton={true} onClick={() => handleDelete(user)}>
                                <Delete color="error" />
                            </XmobButton>
                        </div>
                    ),
                }));
    
                setFormattedUsers(normalUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchData();
    }, []);
    

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleDelete = (user: any) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    const handleEditSave = async () => {
        const userupdate: UserUpdateModel = {
            username: selectedUser.username,
            email: selectedUser.email,
            user_id: selectedUser.roles,
        };
        const response = await BackedAdminUsers.updateuserDetails(userupdate);
        showToast(response.success ? response.message : "Failed to update user", response.success ? "success" : "error");
        setOpenEditDialog(false);
    };

    const handleDeleteConfirm = async () => {
        const response = await BackedAdminUsers.deleteUser(selectedUser.user_id);
        showToast(response.success ? response.message : "Failed to delete user", response.success ? "success" : "error");
        if (response.success) {
            setFormattedUsers(prevUsers => prevUsers.filter(user => user.username !== selectedUser.username));
        }
        setOpenDeleteDialog(false);
    };

    const handleUpdateUserStatus = async (user: UserDtoModel) => {
        const response = await BackedAdminUsers.updateUserStatus(user);
        showToast(response.success ? response.message : "Failed to update status", response.success ? "success" : "error");
        setOpenDeleteDialog(false);
    };
    const handleSelectedRole = (value: string) => {
        setSelectedRole(value);
        selectedUser.roles=value;
    };

    const columns = [
        { label: "Username", key: "username" },
        { label: "Email", key: "email" },
        { label: "Status", key: "status" },
        { label: "2FA", key: "auth2fa" },
        { label: "Date Registered", key: "date_registered" },
        { label: "Role", key: "role" },
        { label: "Actions", key: "actions" },
    ];
    const rolesList = [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Unassigned", value: "unassigned" },
    ];

    return (
        <div>
            <Xmoblayout layoutType="grid-2" >
            <MobitCard bordered={true} rounded={true}>
            <Xmoblayout layoutType="flex-col">
                <XmobText fontWeight="bold" variant="h5"  textAlign="center">No.Of Admin</XmobText>
                <XmobText variant="h5"  textAlign="center">{adminList.length}</XmobText>
                </Xmoblayout>
            </MobitCard>
            <MobitCard bordered={true} rounded={true}>
           <Xmoblayout layoutType="flex-col" className="justify-center align-middle">
           <XmobText fontWeight="bold" variant="h5" textAlign="center">Total Users</XmobText>
           <XmobText variant="h5"  textAlign="center">{formattedUsers.length}</XmobText>
           </Xmoblayout>
            </MobitCard>
            </Xmoblayout>
            <XmobitSpacer height={2}/>
            <XmobTable columns={columns} data={formattedUsers} />
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Xmoblayout layoutType="flex-col">
                        <XmobInput label="Username" fullWidth value={selectedUser?.username || ''} onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} />
                        <XmobInput label="Email" fullWidth value={selectedUser?.email || ''} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
                        <XmobDropdown options={rolesList} selectedValue={selectedUser?.roles || ''} label="roles" onChange={handleSelectedRole} />
                    </Xmoblayout>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete {selectedUser?.username}?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
