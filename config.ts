interface EnvVariables {
  apiUrl: string
}

export const env: EnvVariables = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || `http://localhost:4000`
}
