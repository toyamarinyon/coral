import { useMemo } from 'react'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyHtml: any
  removeFirstParagraph?: boolean
  removeFirstImage?: boolean
}

export const ReportComment = ({
  bodyHtml,
  removeFirstParagraph = false,
  removeFirstImage = false,
}: Props) => {
  const omitHtml = useMemo(() => {
    const div = document.createElement('div')
    div.innerHTML = bodyHtml

    if (removeFirstParagraph) {
      div.querySelector('p')?.remove()
    }
    if (removeFirstImage) {
      div.querySelector('img')?.remove()
    }
    return div.innerHTML
  }, [bodyHtml, removeFirstParagraph, removeFirstImage])

  return (
    <div
      className="markdown text-lg"
      dangerouslySetInnerHTML={{ __html: omitHtml }}
    />
  )
}
