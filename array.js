function deal_with(array) {
  let new_array = []

  for (const element of array) {
    if (Array.isArray(element) == false && typeof element == 'object') {
      new_array.push(JSON.stringify(element, null, 2))
    } else if (Array.isArray(element)) {
      new_array.push(deal_with(element))
    } else if (typeof element == 'string') {
      new_array.push('"' + element + '"')
    } else {
      new_array.push(element.toString())
    }
  }

  return `[${new_array.join(', ')}]`
}

module.exports.deal_with = deal_with