import { extension } from '../constants/index'

export function avaibleType(ext) {
  return {
    spec: true,
    modele: extension.modeles.include(ext),
    texture: extension.textures.include(ext),
  }
}
