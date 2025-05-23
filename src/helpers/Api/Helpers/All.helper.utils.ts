interface DateOptions {
  year: "numeric";
  month: "short";
  day: "numeric";
}

const options: DateOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export default class HelperUtil {
  static formatDateTime(isoString: string): string {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      return "";
    }

    const formattedDate = date.toLocaleDateString("en-US", options);
    const formattedTime = date.toLocaleTimeString("en-US", { hour12: false });

    return `${formattedDate} | ${formattedTime}`;
  }

  static formatCurrencyToFourDecimals(number: number) {
    const formattedNumber = Number(number).toFixed(4);

    return parseFloat(formattedNumber);
  }
}
