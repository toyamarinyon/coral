import { FragmentType, graphql, useFragment } from '../../../gql/'
import { ReportComment } from './ReportComment'
import {
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { useMemo } from 'react'

const Report_IssueFragment = graphql(`
  fragment Report_IssueFragment on Issue {
    id
    url
    title
    labels(first: 10) {
      nodes {
        name
        id
        color
      }
    }
    assignees(first: 1) {
      nodes {
        avatarUrl
        name
      }
    }
    comments(first: 5) {
      nodes {
        id
        author {
          avatarUrl
          login
        }
        bodyHTML
        ...ReportComment_CommentFragment
      }
    }
  }
`)

interface Props {
  issue: FragmentType<typeof Report_IssueFragment>
}
export const Report: React.FC<Props> = (props) => {
  const issue = useFragment(Report_IssueFragment, props.issue)
  const workloadImage = useMemo(() => {
    const comment = issue.comments?.nodes?.find(
      (node) => node?.bodyHTML.includes('img'),
    )
    if (comment == null) {
      return null
    }
    const container = document.createElement('div')
    container.innerHTML = comment.bodyHTML.trim()
    const img = container.querySelector('img')
    if (img == null) {
      return null
    }
    return img.getAttribute('src')
  }, [issue.comments?.nodes])
  const [firstComment, secondeAndAfterComments] = useMemo(
    () => [issue.comments?.nodes?.[0], issue.comments?.nodes?.slice(1) ?? []],
    [issue.comments?.nodes],
  )

  return (
    <div>
      <header className="sticky top-0 flex  items-center justify-between bg-rosePineDawn-base px-4 py-2">
        <div className="flex items-center space-x-2">
          <p className="text-xl">{issue.title}</p>
          <img
            className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
            src={issue?.assignees?.nodes?.[0]?.avatarUrl}
            alt=""
          />
          {issue.labels?.nodes?.map((label) => (
            <div
              key={label?.id}
              className="rounded-full bg-rosePineDawn-overlay px-2 text-sm"
            >
              {label?.name}
            </div>
          ))}
        </div>
        <a href={issue.url} rel="noreferrer noopener" target="_blank">
          <ArrowTopRightOnSquareIcon className="h-6 w-6" />
        </a>
      </header>
      <section className="px-4">
        <div className="flex">
          <div className="mb-6 w-1/2 shrink-0 space-y-5">
            <div className="pr-4">
              {firstComment && <ReportComment comment={firstComment} />}
              {secondeAndAfterComments?.length > 0 && (
                <div className="rounded bg-rosePineDawn-surface p-4">
                  <header className="flex items-center space-x-1 text-lg">
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    <p>Comments</p>
                  </header>
                  <div className="divide-y">
                    {secondeAndAfterComments.map(
                      (comment) =>
                        comment && (
                          <div className="space-y-2 py-3" key={comment?.id}>
                            <div className="flex space-x-2">
                              <img
                                src={comment.author?.avatarUrl}
                                className="h-6 w-6 rounded-full ring-2 ring-white"
                              />
                              <p>{comment.author?.login}</p>
                            </div>
                            <div className="pl-8">
                              <ReportComment comment={comment} />
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <a
                className="text-rosePineDawn-iris"
                href={`${issue.url}#new_comment_field`}
                rel="noreferrer noopener"
                target="_blank"
              >
                Comment on GitHub
              </a>
            </div>
          </div>
          <div>{workloadImage && <img src={workloadImage} />}</div>
        </div>
      </section>
    </div>
  )
}
