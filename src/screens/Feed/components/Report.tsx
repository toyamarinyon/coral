import { FragmentType, graphql, useFragment } from '../../../gql/'
import { ReportComment } from './ReportComment'
import {
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import { match } from 'ts-pattern'

const Report_IssueFragment = graphql(`
  fragment Report_IssueFragment on Issue {
    id
    url
    title
    bodyHTML
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
    timelineItems(first: 20) {
      nodes {
        ... on ClosedEvent {
          id
          createdAt
        }
        ... on IssueComment {
          id
          bodyHTML
          author {
            ... on User {
              avatarUrl
              login
            }
          }
        }
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
      }
    }
  }
`)

interface Props {
  issue: FragmentType<typeof Report_IssueFragment>
}
export const Report: React.FC<Props> = (props) => {
  const issue = useFragment(Report_IssueFragment, props.issue)
  const [timelineEventsBeforeIssueClosed, timelineEventsAfterIssueClosed] =
    useMemo(() => {
      const closeIndex =
        issue.timelineItems.nodes?.findIndex(
          (node) => node?.__typename === 'ClosedEvent',
        ) ?? 1

      return [
        issue.timelineItems.nodes?.slice(0, closeIndex) ?? [],
        issue.timelineItems.nodes?.slice(closeIndex + 1) ?? [],
      ]
    }, [issue.timelineItems.nodes])
  const workloadImage = useMemo(() => {
    const bodyHtmlContainer = document.createElement('div')
    bodyHtmlContainer.innerHTML = issue.bodyHTML.trim()
    bodyHtmlContainer.querySelectorAll('tracking-block').forEach((node) => {
      node.remove()
    })
    const imgInBody = bodyHtmlContainer.querySelector('img')
    if (imgInBody != null) {
      return imgInBody.getAttribute('src')
    }

    const comment = issue.comments?.nodes?.find(
      (node) => node?.bodyHTML.includes('img'),
    )
    if (comment == null) {
      return null
    }
    const commentHtmlContainer = document.createElement('div')
    commentHtmlContainer.innerHTML = comment.bodyHTML.trim()
    const img = commentHtmlContainer.querySelector('img')
    if (img == null) {
      return null
    }
    return img.getAttribute('src')
  }, [issue.comments?.nodes, issue.bodyHTML])

  const issueBodyHtmlHasImage = useMemo(() => {
    const bodyHtmlContainer = document.createElement('div')
    bodyHtmlContainer.innerHTML = issue.bodyHTML.trim()
    const imgInBody = bodyHtmlContainer.querySelector('img')
    return imgInBody != null
  }, [issue.bodyHTML])
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
            <div className="space-y-8 pr-4">
              <ReportComment
                bodyHtml={issue.bodyHTML}
                id={issue.id}
                issueUrl={issue.url}
                removeFirstImage={issueBodyHtmlHasImage}
                removeFirstParagraph={true}
              />
              {timelineEventsBeforeIssueClosed.map((event) =>
                match(event)
                  .with({ __typename: 'IssueComment' }, (comment) => (
                    <ReportComment
                      id={comment.id}
                      key={comment.id}
                      bodyHtml={comment.bodyHTML}
                      issueUrl={issue.url}
                      removeFirstImage={!issueBodyHtmlHasImage}
                    />
                  ))
                  .otherwise(() => null),
              )}
              {timelineEventsAfterIssueClosed.length > 0 && (
                <div className="">
                  <header className="flex items-center space-x-1 border-b pb-2 text-xl">
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    <p>Comments</p>
                  </header>
                  <div>
                    {timelineEventsAfterIssueClosed.map((event) =>
                      match(event)
                        .with({ __typename: 'IssueComment' }, (comment) =>
                          match(comment.author)
                            .with({ __typename: 'User' }, (user) => (
                              <div className="space-y-2 py-4" key={comment?.id}>
                                <div className="flex space-x-2">
                                  <img
                                    src={user.avatarUrl}
                                    className="h-6 w-6 rounded-full ring-2 ring-white"
                                  />
                                  <p className="font-bold">{user.login}</p>
                                </div>
                                <div className="pl-8">
                                  <ReportComment
                                    id={comment.id}
                                    bodyHtml={comment.bodyHTML}
                                    issueUrl={issue.url}
                                  />
                                </div>
                              </div>
                            ))
                            .otherwise(() => null),
                        )
                        .otherwise(() => null),
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
