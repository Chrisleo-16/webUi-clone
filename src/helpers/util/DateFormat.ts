/**
 * Formats a date string to a more user-friendly format
 *
 * @param dateString - The date string to format
 * @param options - Date formatting options
 * @returns A formatted date string
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      ...options,
    };

    return new Intl.DateTimeFormat("en-US", defaultOptions).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error formatting date";
  }
};

/**
 * Formats a date to show how long ago it was (e.g., "2 hours ago", "3 days ago")
 *
 * @param dateString - The date string to format
 * @returns A relative time string
 */
export const timeAgo = (dateString: string): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const secondsAgo = Math.round((now.getTime() - date.getTime()) / 1000);

    // Less than a minute
    if (secondsAgo < 60) {
      return "just now";
    }

    // Less than an hour
    if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    // Less than a day
    if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    // Less than a month
    if (secondsAgo < 2592000) {
      const days = Math.floor(secondsAgo / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    // If it's older than a month, format as a date
    return formatDate(dateString, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error calculating time ago:", error);
    return "Error calculating time";
  }
};
