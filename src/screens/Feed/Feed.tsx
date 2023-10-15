import { ErrorBoundary } from '../../ErrorBoundary'
import { ReportList } from './components'
import { CalendarDaysIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Suspense, useCallback, useRef, useState } from 'react'
import { match } from 'ts-pattern'

const Loader: React.FC = () => (
  <div className="inset-0 flex w-full items-center justify-center">
    Fetching the data from GitHub...
  </div>
)

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
/**
 * Returns the last work day (Mon-Fri).
 * @todo Take into account National holidays
 */
const lastWorkDay = () => {
  const date = new Date()
  const day = date.getDay()
  const weekdayDiffDelta = match(dayNames[day])
    .with('Sun', () => 2)
    .with('Mon', () => 3)
    .otherwise(() => 1)
  return new Date(date.getTime() - weekdayDiffDelta * 24 * 60 * 60 * 1000)
}

interface Props {
  title: string
  repo: string
  goToConfigurationForm: () => void
}
export const Feed: React.FC<Props> = ({
  title,
  repo,
  goToConfigurationForm,
}) => {
  const [reportDate, setReportDate] = useState(
    lastWorkDay().toISOString().slice(0, 10),
  )
  const ref = useRef<HTMLInputElement>(null)
  const handleCalendarClick = useCallback(() => {
    ref.current?.showPicker()
  }, [])
  return (
    <main className="flex w-full">
      <div className="px-1 py-2">
        <header
          className="flex h-full items-center justify-between"
          style={{ writingMode: 'vertical-lr' }}
        >
          <div className="flex -rotate-180 items-center space-y-3">
            <h1>{title}</h1>
            <div
              className="relative flex cursor-pointer items-center space-y-1 rounded-full bg-rosePineDawn-overlay px-1 py-2"
              onClick={handleCalendarClick}
            >
              <CalendarDaysIcon className="h-5 w-5 rotate-90" />
              <span>{reportDate}</span>
              <input
                type="date"
                className="absolute bottom-0 -z-10 -rotate-90 opacity-0"
                ref={ref}
                value={reportDate}
                onChange={(e) =>
                  setReportDate(
                    new Date(e.target.value).toISOString().slice(0, 10),
                  )
                }
              />
            </div>
          </div>
          <button onClick={goToConfigurationForm}>
            <Cog6ToothIcon className="h-6 w-6" />
          </button>
        </header>
      </div>
      <ErrorBoundary fallback="">
        <Suspense fallback={<Loader />}>
          <ReportList
            query={`repo:${repo} "${reportDate.replace(
              /-/g,
              '/',
            )}" in:title sort:interactions`}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}
