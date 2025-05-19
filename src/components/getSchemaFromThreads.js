// utils/getSchemaFromThreads.js

/**
 * @param {Array} threads - масив потоків, кожен з яких містить масив блоків {id, text}
 * @param {string} language - обрана мова програмування
 * @returns {Object} schema - готова до надсилання структура
 */
export default function getSchemaFromThreads(threads, language) {
  return {
    language,
    threads: threads.map((thread, index) => ({
      id: index + 1,
      blocks: thread.map((block, blockIndex) => ({
        id: block.id || `${index + 1}-${blockIndex + 1}`,
        text: block.text,
      }))
    }))
  };
}
