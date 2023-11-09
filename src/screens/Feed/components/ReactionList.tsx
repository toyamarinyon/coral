import { graphql } from '../../../gql'
import { ReactionContent } from '../../../gql/graphql'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { FaceSmileIcon } from '@heroicons/react/24/outline'
import * as Popover from '@radix-ui/react-popover'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { match } from 'ts-pattern'

const ReactionListQuery = graphql(`
  query ReactionList($nodeId: ID!) {
    viewer {
      login
    }
    node(id: $nodeId) {
      ... on Issue {
        id
        reactions(first: 20) {
          nodes {
            id
            content
            user {
              login
            }
          }
        }
      }
      ... on IssueComment {
        id
        reactions(first: 20) {
          nodes {
            id
            content
            user {
              login
            }
          }
        }
      }
    }
  }
`)

const addReaction = graphql(`
  mutation AddReaction($input: AddReactionInput!) {
    addReaction(input: $input) {
      subject {
        ... on Issue {
          id
          reactions(first: 20) {
            nodes {
              id
              content
              user {
                login
              }
            }
          }
        }
        ... on IssueComment {
          id
          reactions(first: 20) {
            nodes {
              id
              content
              user {
                login
              }
            }
          }
        }
      }
    }
  }
`)
const removeReaction = graphql(`
  mutation RemoveReaction($input: RemoveReactionInput!) {
    removeReaction(input: $input) {
      subject {
        ... on Issue {
          id
          reactions(first: 20) {
            nodes {
              id
              content
              user {
                login
              }
            }
          }
        }
        ... on IssueComment {
          id
          reactions(first: 20) {
            nodes {
              id
              content
              user {
                login
              }
            }
          }
        }
      }
    }
  }
`)

const reactionButtons: [ReactionContent, string][] = [
  [ReactionContent.ThumbsUp, '👍'],
  [ReactionContent.Heart, '❤️'],
  [ReactionContent.Laugh, '😄'],
  [ReactionContent.Hooray, '🎉'],
  [ReactionContent.Eyes, '👀'],
]

type ReactionGlance = {
  reactionContent: ReactionContent
  reactedUsers: string[]
  viewerHasReacted: boolean
}
interface Props {
  commentId: string
}
export const ReactionList: React.FC<Props> = ({ commentId }) => {
  const { data } = useSuspenseQuery(ReactionListQuery, {
    variables: {
      nodeId: commentId,
    },
  })
  const [open, setOpen] = useState(false)
  const [mudateAddReaction] = useMutation(addReaction)
  const [mudateRemoveReaction] = useMutation(removeReaction)

  const reactionGlances: ReactionGlance[] = useMemo(() => {
    const reactions = match(data.node)
      .with(
        { __typename: 'IssueComment' },
        (issueComment) => issueComment.reactions,
      )
      .with({ __typename: 'Issue' }, (issue) => issue.reactions)
      .otherwise(() => null)

    const reactedUsersByReactionContent: Record<ReactionContent, string[]> = {
      THUMBS_UP: [],
      THUMBS_DOWN: [],
      LAUGH: [],
      HOORAY: [],
      CONFUSED: [],
      HEART: [],
      EYES: [],
      ROCKET: [],
    }
    reactions?.nodes?.forEach((reaction) => {
      if (reaction == null) {
        return
      }
      if (reaction.user?.__typename !== 'User') {
        return
      }
      reactedUsersByReactionContent[reaction.content] = [
        ...reactedUsersByReactionContent[reaction.content],
        reaction.user.login,
      ]
    })
    return Object.keys(reactedUsersByReactionContent).map(
      (reactionContent) => ({
        reactionContent: reactionContent as ReactionContent,
        reactedUsers:
          reactedUsersByReactionContent[reactionContent as ReactionContent],
        viewerHasReacted: reactedUsersByReactionContent[
          reactionContent as ReactionContent
        ].includes(data.viewer.login),
      }),
    )
  }, [data])
  const handleClickReactionButton =
    (reactionContent: ReactionContent) => async () => {
      const reactionGlance = reactionGlances.find(
        (reactionGlance) => reactionGlance.reactionContent === reactionContent,
      )
      const node = match(data.node)
        .with({ __typename: 'IssueComment' }, (issueComment) => issueComment)
        .with({ __typename: 'Issue' }, (issue) => issue)
        .otherwise(() => {
          throw new Error()
        })
      setOpen(false)
      if (reactionGlance?.viewerHasReacted) {
        await mudateRemoveReaction({
          variables: {
            input: {
              subjectId: commentId,
              content: reactionContent,
            },
          },
          optimisticResponse: {
            removeReaction: {
              subject: {
                __typename: node.__typename,
                id: commentId,
                reactions: {
                  __typename: 'ReactionConnection',
                  nodes: node?.reactions?.nodes?.filter(
                    (reaction) =>
                      reaction?.content !== reactionContent ||
                      reaction?.user?.login !== data.viewer.login,
                  ),
                },
              },
              __typename: 'RemoveReactionPayload',
            },
          },
        })
      } else {
        await mudateAddReaction({
          variables: {
            input: {
              subjectId: commentId,
              content: reactionContent,
            },
          },
          optimisticResponse: {
            addReaction: {
              subject: {
                __typename: node.__typename,
                id: commentId,
                reactions: {
                  __typename: 'ReactionConnection',
                  nodes: [
                    ...(node?.reactions?.nodes ?? []),
                    {
                      __typename: 'Reaction',
                      id: 'optimistic',
                      content: reactionContent,
                      user: {
                        __typename: 'User',
                        login: data.viewer.login,
                      },
                    },
                  ],
                },
              },
              __typename: 'AddReactionPayload',
            },
          },
        })
      }
      toast('reaction updated')
    }
  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen)
  }, [])
  return (
    <div className="flex flex-row items-center space-x-2">
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button className="flex flex-row items-center space-x-2 rounded-full  border bg-rosePineDawn-surface px-0.5 py-0.5 text-rosePineDawn-muted hover:border-rosePineDawn-highlightHigh">
            <FaceSmileIcon className="h-6 w-6" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={4}
            align="start"
            className="rounded-lg border shadow"
          >
            <div className="flex space-x-2 rounded-lg bg-rosePineDawn-surface px-2 py-2 text-xl">
              {reactionButtons.map(([reactionContent, icon]) =>
                reactionGlances.find(
                  (reactionGlance) =>
                    reactionGlance.reactionContent === reactionContent &&
                    reactionGlance.viewerHasReacted,
                ) ? (
                  <button
                    className="h-8 w-8 rounded border border-rose-200 hover:bg-rosePineDawn-overlay"
                    onClick={handleClickReactionButton(
                      reactionContent as ReactionContent,
                    )}
                  >
                    {icon}
                  </button>
                ) : (
                  <button
                    className="h-8 w-8 rounded hover:bg-rosePineDawn-overlay"
                    onClick={handleClickReactionButton(
                      reactionContent as ReactionContent,
                    )}
                  >
                    {icon}
                  </button>
                ),
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {reactionGlances
        .filter(
          ({ reactionContent, reactedUsers }) =>
            reactionContent !== ReactionContent.ThumbsDown &&
            reactedUsers.length > 0,
        )
        .map((reactionGlance) =>
          reactionGlance.viewerHasReacted ? (
            <button
              key={reactionGlance.reactionContent}
              className="flex flex-row items-center space-x-2 rounded-xl border border-rose-200 bg-rosePineDawn-surface px-2 py-0.5"
              onClick={handleClickReactionButton(
                reactionGlance.reactionContent,
              )}
            >
              <span>
                {match(reactionGlance.reactionContent)
                  .with(ReactionContent.ThumbsUp, () => '👍')
                  .with(ReactionContent.ThumbsDown, () => '👎')
                  .with(ReactionContent.Laugh, () => '😄')
                  .with(ReactionContent.Hooray, () => '🎉')
                  .with(ReactionContent.Confused, () => '😕')
                  .with(ReactionContent.Heart, () => '❤️')
                  .with(ReactionContent.Eyes, () => '👀')
                  .with(ReactionContent.Rocket, () => '🚀')
                  .exhaustive()}
              </span>
              <div className="text-xs">
                {reactionGlance.reactedUsers.length}
              </div>
            </button>
          ) : (
            <button
              key={reactionGlance.reactionContent}
              className="flex flex-row items-center space-x-2 rounded-xl border border-rosePineDawn-surface bg-rosePineDawn-surface px-2 py-0.5"
              onClick={handleClickReactionButton(
                reactionGlance.reactionContent,
              )}
            >
              <span>
                {match(reactionGlance.reactionContent)
                  .with(ReactionContent.ThumbsUp, () => '👍')
                  .with(ReactionContent.ThumbsDown, () => '👎')
                  .with(ReactionContent.Laugh, () => '😄')
                  .with(ReactionContent.Hooray, () => '🎉')
                  .with(ReactionContent.Confused, () => '😕')
                  .with(ReactionContent.Heart, () => '❤️')
                  .with(ReactionContent.Eyes, () => '👀')
                  .with(ReactionContent.Rocket, () => '🚀')
                  .exhaustive()}
              </span>
              <div className="text-xs">
                {reactionGlance.reactedUsers.length}
              </div>
            </button>
          ),
        )}
    </div>
  )
}
