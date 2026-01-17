import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, getAllSegmentPrefixes, resolveRelative } from "../util/path"

const AllTags: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
  const tags = new Set<string>()
  allFiles.forEach((file) => {
    if (file.frontmatter?.tags) {
      file.frontmatter.tags.forEach((tag) => tags.add(tag))
    }
  })

  const tagArray = Array.from(tags).sort()

  if (tagArray.length > 0) {
    return (
      <div class={classNames(displayClass, "all-tags-container")}>
        <h3>Explore by Tag</h3>
        <ul class="tags">
          {tagArray.map((tag) => {
            const linkDest = resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)
            return (
              <li>
                <a href={linkDest} class="internal tag-link">
                  #{tag}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )
  } else {
    return null
  }
}

AllTags.css = `
.all-tags-container {
  margin-top: 2rem;
}
.all-tags-container h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--darkgray);
}
`

export default (() => AllTags) satisfies QuartzComponentConstructor
