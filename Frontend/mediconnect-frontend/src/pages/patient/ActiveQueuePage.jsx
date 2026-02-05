import { useParams } from 'react-router-dom'

export default function ActiveQueuePage() {
  const { id } = useParams()

  return (
    <main>
      <h1>Active Queue</h1>
      <p>Queue ID: {id}</p>
      <p>Active Queue Page (placeholder)</p>
    </main>
  )
}
