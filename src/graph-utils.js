export const isEdge = element => element.data.source && element.data.target;

export const separateElements = elements => ({
  nodes: elements.filter(node => !isEdge(node)),
  edges: elements.filter(node => isEdge(node))
})

export const getBoundingBox = (nodes) => {
  const bbox = nodes.reduce((res, node) => {
    const x2 = node.position.x + node.data.__width;
    const y2 = node.position.y + node.data.__height;

    if (node.position.x < res.minX) {
      res.minX = node.position.x;
    }

    if (x2 > res.maxX) {
      res.maxX = x2;
    }

    if (node.position.y < res.minY) {
      res.minY = node.position.y;
    }

    if (y2 > res.maxY) {
      res.maxY = y2;
    }

    return res;
  }, {
    minX: Number.MAX_VALUE,
    minY: Number.MAX_VALUE,
    maxX: 0,
    maxY: 0
  });

  return {
    x: bbox.minX,
    y: bbox.minY,
    width: bbox.maxX - bbox.minX,
    height: bbox.maxY - bbox.minY
  };
};

export const projectPosition = (pos, transform) => {
  return {
    x: (pos.x * transform[2]) + transform[0],
    y: (pos.y * transform[2]) + transform[1]
  };
}

export default {
  isEdge,
  separateElements,
  getBoundingBox,
  projectPosition
};
