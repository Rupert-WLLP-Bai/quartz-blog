import { remarkKroki } from "remark-kroki"
import { QuartzTransformerPlugin } from "../types"

interface Options {
  server?: string
  alias?: string[]
  output?: string
  target?: string
}

export const Kroki: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const server = opts?.server ?? "https://kroki.io"
  const alias = opts?.alias ?? ["d2"]
  const output = opts?.output ?? "inline-svg"
  const target = opts?.target ?? "html"

  return {
    name: "Kroki",
    markdownPlugins() {
      return [
        [
          remarkKroki,
          {
            server,
            alias,
            output,
            target,
          },
        ],
      ]
    },
  }
}
