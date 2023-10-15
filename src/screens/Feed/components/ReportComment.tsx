import { FragmentType, graphql, useFragment } from '../../../gql/'
import { useMemo } from 'react'

const ReportComment_CommentFragment = graphql(`
  fragment ReportComment_CommentFragment on IssueComment {
    id
    body
    bodyHTML
  }
`)

interface Props {
  comment: FragmentType<typeof ReportComment_CommentFragment>
}

export const ReportComment = ({ comment }: Props) => {
  const { bodyHTML } = useFragment(ReportComment_CommentFragment, comment)

  const omitImgHtml = useMemo(() => {
    const div = document.createElement('div')
    div.innerHTML = bodyHTML
    const imgs = div.querySelectorAll('img')
    imgs.forEach((img) => img.remove())
    return div.innerHTML
  }, [bodyHTML])

  return (
    <div
      className="markdown text-lg"
      dangerouslySetInnerHTML={{ __html: omitImgHtml }}
    />
  )
}
