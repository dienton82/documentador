export const downloadBlobFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const getFilenameFromContentDisposition = (
  contentDisposition: string | null,
) => {
  if (!contentDisposition) {
    return null;
  }

  const match =
    contentDisposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);

  if (!match) {
    return null;
  }

  return decodeURIComponent(match[1] || match[2]);
};
