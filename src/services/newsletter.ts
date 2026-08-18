export interface Subscriber {
  id: number | string
  name: string
  email: string
  createdAt?: string
}

const apiUrl = 'https://treehousechallenge.contractornation.com/newsletter'

function requestOptions(method = 'GET', body?: { name: string; email: string }): RequestInit {
  return {
    method,
    headers: {
      Authorization: import.meta.env.VITE_API_KEY,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }
}

export async function getSubscribers() {
  const response = await fetch(apiUrl, requestOptions())

  if (!response.ok) {
    throw new Error('The subscriber list could not be loaded.')
  }

  const subscribers = (await response.json()) as Subscriber[]

  return [...subscribers].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }

    return Number(b.id) - Number(a.id)
  })
}

export async function createSubscriber(name: string, email: string) {
  const response = await fetch(apiUrl, requestOptions('POST', { name, email }))

  if (!response.ok) {
    throw new Error('The subscriber could not be added.')
  }
}

export async function removeSubscriber(id: Subscriber['id']) {
  const response = await fetch(`${apiUrl}/${id}`, requestOptions('DELETE'))

  if (!response.ok) {
    throw new Error('The subscriber could not be removed.')
  }
}
