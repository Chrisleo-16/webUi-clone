class HelpFormatter {
    static formatDate(isoString: string) {
      const date = new Date(isoString);
  
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
  
      const hours = date.getHours();
      const minutes = date.getMinutes();
  
      const formattedTime = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}hrs`;
  
      return `${day}-${month}-${year} ${formattedTime}`;
    }
  }


  export default HelpFormatter;
  