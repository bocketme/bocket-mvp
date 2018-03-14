/**
 * Function who make Array.forEach asynchronous.
 * @param {Array<Object>} array - The Array used.
 * @param {Promise<void>} promise - The Promise to wait
 * @returns {void}
 */
async function asyncForEach(array, promise) {
    for (let index = 0; index < array.length; index++) {
        await promise(array[index], index, array)
    }
};

module.exports = asyncForEach;
