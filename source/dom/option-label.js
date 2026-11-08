/**
 * Read the human readable name of an <option>, ignoring any icon or detail
 * markup it holds. Older browsers strip that markup, leaving only text.
 * @param {HTMLOptionElement} [option]
 * @returns {string}
 */
export const optionLabel = option => (option?.querySelector('.option-label') ?? option)?.textContent.trim() ?? ''
