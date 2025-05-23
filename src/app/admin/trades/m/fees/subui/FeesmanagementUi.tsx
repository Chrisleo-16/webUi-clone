"use client";

import xmobcolors from "@/app/styles/xmobcolors";
import XmobButton from "@/components/button/xmobitButton";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobTable from "@/components/tables/xmobTable";
import { FeeModel } from "@/helpers/interfaces/FeeModel";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import BackedAdminManageFee from "../backed/backed_fee_managemt";
import toast from "react-hot-toast";
import PopFeeManagementUi from "./PopUpManagementUi";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";

interface FeeManagementViewProps {
  fees: FeeModel[];
}

const FeeManagementView = ({ fees, fetchData }: { fees: FeeModel[], fetchData: any }) => {
  const [selectedFee, setSelectedFee] = useState<FeeModel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    feeType: "",
    percentage: "",
    minAmount: "",
    maxAmount: "",
    currency: "BTC",
  });

  const handleEdit = (fee: FeeModel) => {
    setSelectedFee(fee);
    setIsEdit(true);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedFee(null);
    setIsEdit(false);
    setIsDialogOpen(true);
  };

  const handleDelete = async (fee: FeeModel) => {
    if (confirm("Are you sure you want to disable this fee?")) {
      try {
        const { success } = await BackedAdminManageFee.disableFee(fee);
        if (success) {
          toast.success("Fee disabled successfully");
          fetchData()
        }
      } catch (error) {
        toast.error("Failed to disable fee");
      }
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleSave = async (updatedFee: FeeModel) => {
    try {
      // Set currency automatically for swap types
      if (updatedFee.fee_type === "swap_xmr_to_btc") {
        updatedFee.currency = "XMR";
      } else if (updatedFee.fee_type === "swap_btc_to_xmr") {
        updatedFee.currency = "BTC";
      }

      let response;
      if (selectedFee) {
        response = await BackedAdminManageFee.updateFee({ id: selectedFee.id, ...updatedFee });
      } else {
        response = await BackedAdminManageFee.updateFee(updatedFee);
      }

      if (response.success) {
        toast.success(`Fee ${selectedFee ? "updated" : "created"} successfully`);
        fetchData();
      }

      handleClose();
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message || "Failed to save fee configuration");
    }
  };


  const columns = [
    { label: "Fee Type", key: "fee_type" },
    { label: "Percentage", key: "percentage" },
    { label: "Min Amount", key: "min_amount" },
    { label: "Currency", key: "currency" },
    { label: "Actions", key: "action" },
  ];

  const rows = fees.map((fee) => ({
    fee_type: fee.fee_type,
    percentage: fee.percentage,
    min_amount: fee.min_amount,
    currency: fee.currency,
    action: (
      <Xmoblayout layoutType="flex-row">
        <XmobButton
          onClick={() => handleEdit(fee)}
          backgroundColor={xmobcolors.secondary}
          isButtonSmall={true}
        >
          <Edit />
        </XmobButton>

        <XmobButton
          onClick={() => handleDelete(fee)}
          isButtonSmall={true}
          backgroundColor={xmobcolors.danger}
        >
          <Delete />
        </XmobButton>
      </Xmoblayout>
    ),
  }));

  return (
    <>
      <Xmoblayout isFlexEndToEnd={true} layoutType="flex-row">
        <div>
          <XmobitSpacer height={5} />
        </div>
        <XmobButton onClick={handleAdd} backgroundColor={xmobcolors.primary}>
          Add Fee
        </XmobButton>
      </Xmoblayout>

      {fees.length === 0 ? (
        <p>No fees available.</p>
      ) : (
        <XmobTable columns={columns} data={rows} />
      )}

      <PopFeeManagementUi
        fee={selectedFee}
        showPopUp={isDialogOpen}
        isEdit={isEdit}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
};

export default FeeManagementView;
