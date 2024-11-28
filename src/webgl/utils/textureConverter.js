export const textureScaleConverter = (texture, geometryAspect) => {
  const textureAspect = texture.image.width / texture.image.height;

  let scale = [1, 1];
  if (textureAspect < geometryAspect) {
    scale[1] = textureAspect / geometryAspect;
  } else {
    scale[0] = geometryAspect / textureAspect;
  }

  return scale;
};
