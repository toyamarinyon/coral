import { ReactionList } from './ReactionList'
import { useMemo } from 'react'

interface Props {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyHtml: any
  issueUrl: string
  removeFirstParagraph?: boolean
  removeFirstImage?: boolean
}

export const ReportComment = ({
  id,
  bodyHtml,
  issueUrl,
  removeFirstParagraph = false,
  removeFirstImage = false,
}: Props) => {
  const hasTaskList = useMemo(() => {
    const div = document.createElement('div')
    div.innerHTML = bodyHtml
    return div.querySelector('tracking-block') !== null
  }, [bodyHtml])
  const omitHtml = useMemo(() => {
    const div = document.createElement('div')
    div.innerHTML = bodyHtml
    div.querySelectorAll('tracking-block').forEach((el) => el.remove())

    if (removeFirstParagraph) {
      div.querySelector('p')?.remove()
    }
    if (removeFirstImage) {
      div.querySelector('img')?.remove()
    }
    return div.innerHTML
  }, [bodyHtml, removeFirstParagraph, removeFirstImage])

  if (omitHtml.length === 0) {
    return null
  }
  return (
    <div>
      {hasTaskList && (
        <div className="my-2 rounded border border-rosePineDawn-gold bg-rosePineDawn-surface px-4 py-2 text-rosePineDawn-gold">
          This comment contains a task list but we are unable to display it.
          Please see the comment on{' '}
          <a
            href={issueUrl}
            rel="noreferrer noopener"
            target="_blank"
            className="underline"
          >
            GitHub
          </a>{' '}
          if you need to see it.
        </div>
      )}
      <div
        className="markdown text-lg"
        dangerouslySetInnerHTML={{ __html: omitHtml }}
      />
      <ReactionList commentId={id} />
    </div>
  )
}
