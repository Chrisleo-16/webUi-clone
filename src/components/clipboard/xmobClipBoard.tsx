import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { IconButton, Tooltip } from "@mui/material";

interface XmobClipboardProp {
  text: string;
  iconSize?: "small" | "medium" | "large";
  tooltipText?: string;
}

const XmobClipboard: React.FC<XmobClipboardProp> = ({
  text,
  iconSize = "medium",
  tooltipText = "Copy to clipboard",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <Tooltip title={copied ? "Copied!" : tooltipText}>
      <IconButton onClick={handleCopy} color="primary">
        {copied ? <CheckIcon fontSize={iconSize} /> : <ContentCopyIcon fontSize={iconSize} />}
      </IconButton>
    </Tooltip>
  );
};

export default XmobClipboard;
