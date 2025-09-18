/**
 * 计算并返回一个集合的幂集（所有可能的子集）
 * 幂集是指包含原集合所有可能子集的集合，包括空集和原集合本身
 *
 * @param {Array} originalSet - 原始集合（数组形式）
 * @returns {Array} - 包含所有子集的数组，每个元素都是原集合的一个子集
 */
export default function getPowerSet(originalSet) {
  // 用于存储所有生成的子集
  const subSets = []

  // 计算子集的总数量：2^n（n为原集合的元素个数）
  // 原因是每个元素都有两种选择：包含在子集中或不包含，因此总共有2^n种组合
  const numberOfCombinations = 2 ** originalSet.length

  // 遍历所有可能的组合（从0到2^n - 1）
  // 每个数字的二进制表示恰好可以表示一种子集组合
  // 例如，n=3时，数字5的二进制是101，表示包含第0个和第2个元素
  for (let combinationIndex = 0; combinationIndex < numberOfCombinations; combinationIndex += 1) {
    // 存储当前生成的子集
    const subSet = []

    // 检查原集合中的每个元素是否应该包含在当前子集中
    for (let setElementIndex = 0; setElementIndex < originalSet.length; setElementIndex += 1) {
      // 位运算判断：检查combinationIndex的二进制表示中第setElementIndex位是否为1
      // 1 << setElementIndex：将1左移setElementIndex位，得到一个只有第setElementIndex位为1的二进制数
      // combinationIndex & (1 << setElementIndex)：如果结果不为0，说明第setElementIndex位为1
      if (combinationIndex & (1 << setElementIndex)) {
        // 如果对应位为1，则将原集合中该索引的元素加入当前子集
        subSet.push(originalSet[setElementIndex])
      }
    }

    // 将当前生成的子集添加到所有子集的列表中
    subSets.push(subSet)
  }

  // 返回所有子集组成的幂集
  return subSets
}
