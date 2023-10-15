import { graphql } from '../../../gql'
import { SearchType } from '../../../gql/graphql'
import { Report } from './Report'
import { useSuspenseQuery } from '@apollo/client'
import { startTransition, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { match } from 'ts-pattern'

const ReportListQuery = graphql(`
  query SearchIssue(
    $query: String!
    $type: SearchType!
    $first: Int
    $after: String
  ) {
    search(query: $query, type: $type, first: $first, after: $after) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ... on Issue {
            id
            ...Report_IssueFragment
          }
        }
      }
    }
  }
`)

interface Props {
  query: string
  scrollContainerRef: React.RefObject<HTMLDivElement>
}
export const ReportList: React.FC<Props> = ({ query, scrollContainerRef }) => {
  const { data, fetchMore } = useSuspenseQuery(ReportListQuery, {
    variables: {
      query,
      type: SearchType.Issue,
      first: 5,
    },
  })
  const fetchMoreRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (fetchMoreRef?.current == null || scrollContainerRef?.current == null) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            toast('Loading next data from GitHub...')
            startTransition(() => {
              fetchMore({
                variables: {
                  after: data.search.pageInfo.endCursor,
                },
              })
            })
          }
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '0px 0px 30% 0px',
      },
    )
    observer.observe(fetchMoreRef.current)
    return () => {
      observer.disconnect()
    }
  }, [
    data.search.pageInfo.endCursor,
    fetchMore,
    scrollContainerRef,
    fetchMoreRef,
  ])

  return (
    <div className="divide-y-2 overflow-y-scroll" ref={scrollContainerRef}>
      {data.search.edges?.map((edge) =>
        match(edge?.node)
          .with({ __typename: 'Issue' }, (issue) => (
            <Report key={issue.id} issue={issue} />
          ))
          .otherwise(() => null),
      )}
      {data.search.pageInfo.hasNextPage && (
        <div ref={fetchMoreRef}>Loading next data from GitHub...</div>
      )}
    </div>
  )
}
