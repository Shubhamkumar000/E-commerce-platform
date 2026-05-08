export const validURLConvert = (name) => {
  return name
    .toString()
    .normalize('NFD')                        
    .replace(/[\u0300-\u036f]/g, '')         // Remove diacritics
    .replace(/[^A-Za-z0-9\s-]/g, '')         // Allow both uppercase and lowercase letters
    .replace(/[\s_]+/g, '-')                 // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '')                 // Remove leading/trailing hyphens
    .trim();                                
};
