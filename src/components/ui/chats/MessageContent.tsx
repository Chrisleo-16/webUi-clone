import { FaFileImage } from "react-icons/fa";

const renderMessageContent = (
  message: string,
  mediaLink: string,
  openModal: (imageLink: string) => void
) => {
  if (mediaLink) {
    if (mediaLink.match(/\.(jpeg|jpg|gif|png|webp)$/) != null) {
      return (
        <div onClick={() => openModal(mediaLink)}>
          <img
            src={mediaLink}
            alt="uploaded"
            className="max-w-xs max-h-64 cursor-pointer"
          />
          {message && <p>{message}</p>}
        </div>
      );
    } else if (mediaLink.match(/\.(pdf)$/) != null) {
      return (
        <div>
          <a
            href={mediaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            <FaFileImage size={27} />
          </a>
          {message && <p>{message}</p>}
        </div>
      );
    } else if (
      mediaLink.startsWith("http://") ||
      mediaLink.startsWith("https://")
    ) {
      return (
        <div>
          <a
            href={mediaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Document
          </a>
          {message && <p>{message}</p>}
        </div>
      );
    }
  }

  return <p>{message}</p>;
};

export default renderMessageContent;
