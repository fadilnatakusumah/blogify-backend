export const trimExcerpt = (str: string, length: number, delimeter: string, appendix: string) => {
  if (str.length <= length) return str;

  let trimmedStr = str.substr(0, length + delimeter.length);
  const lastDelimIndex = trimmedStr.lastIndexOf(delimeter);
  if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

  if (trimmedStr) trimmedStr += appendix;
  return trimmedStr;
}