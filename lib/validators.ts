export const isValidIP = (input: string): boolean => {
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv4Pattern.test(input) || ipv6Pattern.test(input);
};

export const isValidDomain = (input: string): boolean => {
  const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
  return domainPattern.test(input) && !isValidIP(input);
};

export const isValidURL = (input: string): boolean => {
  try {
    new URL(input);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidMD5 = (input: string): boolean => /^[a-fA-F0-9]{32}$/.test(input);
export const isValidSHA1 = (input: string): boolean => /^[a-fA-F0-9]{40}$/.test(input);
export const isValidSHA256 = (input: string): boolean => /^[a-fA-F0-9]{64}$/.test(input);
export const isValidCVEId = (input: string): boolean => /^CVE-\d{4}-\d{4,}$/i.test(input);

export const detectInputType = (input: string): 'ip' | 'domain' | 'url' | 'hash' | 'cve' | 'unknown' => {
  const trimmed = input.trim();
  if (isValidIP(trimmed)) return 'ip';
  if (isValidURL(trimmed)) return 'url';
  if (isValidDomain(trimmed)) return 'domain';
  if (isValidMD5(trimmed) || isValidSHA1(trimmed) || isValidSHA256(trimmed)) return 'hash';
  if (isValidCVEId(trimmed)) return 'cve';
  return 'unknown';
};
