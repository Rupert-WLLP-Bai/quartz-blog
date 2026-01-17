import { Root as HTMLRoot } from "hast"
import { toString } from "hast-util-to-string"
import readingTime from "reading-time"
import { QuartzTransformerPlugin } from "../types"

export const WordCount: QuartzTransformerPlugin = () => {
  return {
    name: "WordCount",
    htmlPlugins() {
      return [
        () => {
          return async (tree: HTMLRoot, file) => {
            const text = toString(tree)
            const { words } = readingTime(text)
            file.data.wordCount = words
          }
        },
      ]
    },
  }
}

// Extend VFile DataMap type
declare module "vfile" {
  interface DataMap {
    wordCount?: number
  }
}
