import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/blogArchive.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  showDescription: boolean
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  title: undefined,
  showDescription: true,
  showTags: false,
  filter: (f: QuartzPluginData) => {
    const slug = f.slug ?? ""
    return slug.startsWith("posts/") && !slug.endsWith("/index")
  },
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const BlogArchive: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = allFiles.filter(opts.filter).sort(opts.sort)

    return (
      <div class={classNames(displayClass, "blog-archive")}>
        <h3>{opts.title ?? i18n(cfg.locale).components.recentNotes.title}</h3>
        <ul class="blog-archive-ul">
          {pages.map((page) => {
            const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
            const tags = page.frontmatter?.tags ?? []
            const description = page.description

            return (
              <li class="blog-archive-item">
                <div class="section">
                  {page.dates && (
                    <p class="meta">
                      {page.dates.created && (
                        <>
                          Created: <Date date={page.dates.created} locale={cfg.locale} />
                        </>
                      )}
                      {page.dates.modified && page.dates.created && " • "}
                      {page.dates.modified && (
                        <>
                          Updated: <Date date={page.dates.modified} locale={cfg.locale} />
                        </>
                      )}
                      {page.wordCount && (page.dates.created || page.dates.modified) && " • "}
                      {page.wordCount && (
                        <span>{page.wordCount.toLocaleString("en-US")} words</span>
                      )}
                    </p>
                  )}
                  <div class="desc">
                    <h3>
                      <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                        {title}
                      </a>
                    </h3>
                  </div>
                  {opts.showDescription && description && (
                    <p class="description">{description}</p>
                  )}
                  {opts.showTags && (
                    <ul class="tags">
                      {tags.map((tag) => (
                        <li>
                          <a
                            class="internal tag-link"
                            href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                          >
                            {tag}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  BlogArchive.css = style
  return BlogArchive
}) satisfies QuartzComponentConstructor
