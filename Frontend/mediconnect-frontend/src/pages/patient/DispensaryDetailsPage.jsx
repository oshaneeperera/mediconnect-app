import { useParams } from 'react-router-dom'

export default function DispensaryDetailsPage() {
  const { id } = useParams()

  return (
    <main>
      <h1>Dispensary Details</h1>
      <p>Dispensary ID: {id}</p>
      <p>Dispensary Details Page (placeholder)</p>
    </main>
  )
}
