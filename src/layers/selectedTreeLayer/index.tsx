// @ts-nocheck

import { ScatterplotLayer } from "@deck.gl/layers/typed";
import fragmentShader from "./fragmentShader.glsl";

export default class SelectedTreeLayer extends ScatterplotLayer {
  getShaders() {
    return Object.assign({}, super.getShaders(), {
      'fs': fragmentShader,
    })
  }

  draw({ uniforms }) {
    super.draw({
      uniforms: {
        ...uniforms,
        timestamp: Date.now(),
      },
    })

    this.setNeedsRedraw()
  }
}

SelectedTreeLayer.defaultProps = {
  selected: false,
}
