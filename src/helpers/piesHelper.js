/**
 * Pies Helper Module
 * Contains pure helper functions for pie-related operations
 */

/**
 * Pure helper function to get pies of the month
 * Returns a curated subset of pies in a specific order
 * @param {Array} allPies - Array of all available pies
 * @returns {Array} Array of pies of the month in the specified order
 */
function getPiesOfTheMonth(allPies) {
  if (!Array.isArray(allPies)) {
    return [];
  }

  // Define the specific pie IDs for monthly selection in order
  const monthlyPieIds = ['f2', 'f3', 'c3'];

  // Find pies by ID and maintain the same ordering
  const monthlyPies = monthlyPieIds
    .map(id => allPies.find(pie => pie.id === id))
    .filter(Boolean); // Remove any undefined entries

  return monthlyPies;
}

module.exports = {
  getPiesOfTheMonth
};
