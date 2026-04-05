import usersJson from './synthetic-users.json'
export const users = usersJson.users

const DEMO_PASSWORD = 'Abc1234$$'

export function authenticateUser(email, password) {
  if (password !== DEMO_PASSWORD) return null
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  return user || null
}
