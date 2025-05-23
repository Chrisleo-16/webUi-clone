"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, FormHelperText } from "@mui/material";
import { FeeModel } from "@/helpers/interfaces/FeeModel";

// UI representation of backend enum values
// UI representation of backend enum values
const FEE_TYPES = [
  { value: "spot_to_funding", label: "Spot to Funding" },
  { value: "funding_to_spot", label: "Funding to Spot" },

  { value: "sending_external", label: "External Wallet (Non-Xmobit)" },
  { value: "sending_internal", label: "Internal Wallet (Xmobit User)" },

  { value: "trade_buy", label: "Buy Trade" },
  { value: "trade_sell", label: "Sell Trade" },

  { value: "swap_xmr_to_btc", label: "Swap Monero to Bitcoin" },
  { value: "swap_btc_to_xmr", label: "Swap Bitcoin to Monero" },
];


const CURRENCIES = ["BTC", "XMR"];

interface PopFeeManagementUiProps {
  fee: FeeModel | null;
  showPopUp: boolean;
  isEdit: boolean;
  onClose: () => void;
  onSave: (updatedFee: FeeModel) => void;
}

const PopFeeManagementUi: React.FC<PopFeeManagementUiProps> = ({ fee, showPopUp, isEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState<FeeModel>({
    fee_type: "",
    percentage: 0,
    min_amount: 0,
    max_amount: 0,
    currency: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<{
    fee_type?: string;
    percentage?: string;
    min_amount?: string;
    max_amount?: string;
    currency?: string;
  }>({});

  useEffect(() => {
    if (fee) {
      setFormData({ ...fee });
      setErrors({});
    } else {
      setFormData({
        fee_type: "",
        percentage: 0,
        min_amount: 0,
        max_amount: 0,
        currency: "",
        is_active: true,
      });
      setErrors({});
    }
  }, [fee]);

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };

    // Clear existing error for this field
    delete newErrors[name as keyof typeof newErrors];

    // Validate percentage (must be positive)
    if (name === "percentage" && (value < 0 || value > 100)) {
      newErrors.percentage = "Percentage must be between 0 and 100";
    }

    // Validate min_amount (must be positive)
    if (name === "min_amount" && value < 0) {
      newErrors.min_amount = "Minimum amount cannot be negative";
    }

    // Validate max_amount (must be positive and >= min_amount)
    if (name === "max_amount") {
      if (value < 0) {
        newErrors.max_amount = "Maximum amount cannot be negative";
      } else if (value > 0 && value < Number(formData.min_amount)) {
        newErrors.max_amount = "Maximum amount cannot be less than minimum amount";
      }
    }

    // Validate min_amount again if max_amount already has a value
    if (name === "min_amount" && Number(formData.max_amount) > 0 && value > Number(formData.max_amount)) {
      newErrors.min_amount = "Minimum amount cannot be greater than maximum amount";
    }

    setErrors(newErrors);
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "percentage" || name.includes("amount") ? parseFloat(value) || 0 : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    validateField(name, parsedValue);
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));

    validateField(name as string, value);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Required fields
    if (!formData.fee_type) newErrors.fee_type = "Fee type is required";
    if (!formData.currency && formData.fee_type !== "swap_xmr_to_btc" && formData.fee_type !== "swap_btc_to_xmr" ) newErrors.currency = "Currency is required";

    // Percentage validation
    if (formData.percentage < 0 || formData.percentage > 100) {
      newErrors.percentage = "Percentage must be between 0 and 100";
    }

    // Min/Max amount validations
    if (formData.min_amount < 0) {
      newErrors.min_amount = "Minimum amount cannot be negative";
    }

    if (formData.max_amount < 0) {
      newErrors.max_amount = "Maximum amount cannot be negative";
    } else if (formData.max_amount > 0 && formData.min_amount > formData.max_amount) {
      newErrors.max_amount = "Maximum amount cannot be less than minimum amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ ...formData });
      onClose();
    }
  };

  return (
    <Dialog open={showPopUp} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Fee" : "Add Fee"}</DialogTitle>
      <DialogContent>
        <FormControl
          fullWidth
          margin="dense"
          error={!!errors.fee_type}
        >
          <InputLabel id="fee-type-label">Fee Type</InputLabel>
          <Select
            labelId="fee-type-label"
            name="fee_type"
            value={formData.fee_type}
            onChange={handleSelectChange}
            label="Fee Type"
          >
            {FEE_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
          {errors.fee_type && <FormHelperText>{errors.fee_type}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          margin="dense"
          label="Percentage"
          name="percentage"
          type="number"
          value={formData.percentage}
          onChange={handleTextFieldChange}
          inputProps={{ step: "0.01", min: "0", max: "100" }}
          error={!!errors.percentage}
          helperText={errors.percentage}
        />

        <TextField
          fullWidth
          margin="dense"
          label="Min Amount"
          name="min_amount"
          type="number"
          value={Number(formData.min_amount)}
          onChange={handleTextFieldChange}
          inputProps={{ step: "0.00000001", min: "0" }}
          error={!!errors.min_amount}
          helperText={errors.min_amount}
        />

        <TextField
          fullWidth
          margin="dense"
          label="Max Amount"
          name="max_amount"
          type="number"
          value={Number(formData.max_amount)}
          onChange={handleTextFieldChange}
          inputProps={{ step: "0.00000001", min: "0" }}
          error={!!errors.max_amount}
          helperText={errors.max_amount}
        />
        {
          (formData.fee_type !== "swap_xmr_to_btc" && formData.fee_type !== "swap_btc_to_xmr") &&
          <FormControl
            fullWidth
            margin="dense"
            error={!!errors.currency}
          >
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
              labelId="currency-label"
              name="currency"
              value={formData.currency}
              onChange={handleSelectChange}
              label="Currency"
            >
              {CURRENCIES.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
            {errors.currency && <FormHelperText>{errors.currency}</FormHelperText>}
          </FormControl>
        }

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopFeeManagementUi;