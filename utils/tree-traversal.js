export const inOrder = (getLeft, getRight, getValue, node) => {
  if (node === null || node === undefined) return [];

  return [
    ...inOrder(getLeft, getRight, getValue, getLeft(node)), 
    getValue(node),
    ...inOrder(getLeft, getRight, getValue, getRight(node)), 
  ];
};
export const preOrder = (getLeft, getRight, getValue, node) => [getValue(node), ...getLeft(node), ...getRight(node)];
export const postOrder = (getLeft, getRight, getValue, node) => [...getLeft(node), ...getRight(node), getValue(node)];