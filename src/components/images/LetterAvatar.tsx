import React from "react";

interface LetterAvatarProps {
  name: string;
  width: string;
  height: string;
  fontSize?: string;
}

const LetterAvatar: React.FC<LetterAvatarProps> = ({
  name,
  width,
  height,
  fontSize = "16px",
}) => {
  // Function to get the first letter of the name
  const getInitial = (name: string): string => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Function to generate a deterministic color based on the name
  const getColor = (name: string): string => {
    if (!name) return "#6c757d"; // Default gray

    // Simple hash function to generate a consistent color for a name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // List of Google-like vibrant colors
    const colors = [
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFC107",
      "#FF9800",
      "#FF5722",
    ];

    // Convert hash to an index
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initial = getInitial(name);
  const bgColor = getColor(name);

  return (
    <div
      style={{
        width: width,
        height: height,
        backgroundColor: bgColor,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        fontWeight: "bold",
        fontSize: fontSize,
      }}
    >
      {initial}
    </div>
  );
};

export default LetterAvatar;
