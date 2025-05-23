import { Alert, AlertTitle, Collapse } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorAlertProps {
  error: string | null;
  onClose?: () => void;
}

export default function ErrorAlert({ error, onClose }: ErrorAlertProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Collapse in={!!error}>
            <Alert
              severity="error"
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
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </Collapse>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
