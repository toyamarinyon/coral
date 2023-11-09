import { graphql } from '../../../gql'
import { ReactionContent } from '../../../gql/graphql'
import { useSuspenseQuery } from '@apollo/client'
import { FaceSmileIcon } from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import { match } from 'ts-pattern'

const ReactionListQuery = graphql(`
  query ReactionList($nodeId: ID!) {
    viewer {
      login
    }
    node(id: $nodeId) {
      ... on Issue {
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
  return (
    <div className="flex flex-row items-center space-x-2">
      <div className="flex flex-row items-center space-x-2 rounded-full  bg-rosePineDawn-surface px-0.5 py-0.5 text-rosePineDawn-muted">
        <FaceSmileIcon className="h-6 w-6" />
      </div>
      {reactionGlances
        .filter(
          ({ reactionContent, reactedUsers }) =>
            reactionContent !== ReactionContent.ThumbsDown &&
            reactedUsers.length > 0,
        )
        .map((reactionGlance) => (
          <div
            key={reactionGlance.reactionContent}
            className="flex flex-row items-center space-x-2 rounded-xl bg-rosePineDawn-surface px-2 py-0.5"
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
            <div className="text-xs">{reactionGlance.reactedUsers.length}</div>
          </div>
        ))}
    </div>
  )
}
