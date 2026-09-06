export interface ActionReturn<Parameters = unknown> {
  update?: (parameters: Parameters) => void
  destroy?: () => void
}

export interface Action<Parameters = unknown, Element = HTMLElement> {
  <Node extends Element>(
    node: Node,
    parameters?: Parameters
  ): void | ActionReturn<Parameters>
}
