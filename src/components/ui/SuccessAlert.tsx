import { Alert, AlertTitle, Collapse } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessAlertProps {
  message: string | null;
  onClose?: () => void;
}

export default function SuccessAlert({ message, onClose }: SuccessAlertProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Collapse in={!!message}>
            <Alert
              severity="success"
              onClose={onClose}
              sx={{
                mb: 2,
                "& .MuiAlert-message": {
                  width: "100%",
                },
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <AlertTitle>Success</AlertTitle>
              {message}
            </Alert>
          </Collapse>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
