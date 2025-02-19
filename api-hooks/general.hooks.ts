import axios from '@/lib/axios'
import { useQuery, useMutation } from 'react-query'

const useConnect = () => {
  console.log('useConnect')
  return useQuery(['connect'], () => axios.get(`/general/connect`).then((res) => res.data), {
    refetchOnWindowFocus: false
  })
}

const useCreateMatch = () => {
  return useMutation((data: any) => {
    return axios.post('/general/matches', data)
  })
}

const useCreateUser = () => {
  return useMutation((data: any) => {
    return axios.post('/general/teachers', data)
  })
}

const useMatch = (id: string) => {
  return useQuery(['matches', id], () =>
    axios.get(`/general/matches/${id}`).then((res) => res.data)
  )
}

const useJoinMatch = () => {
  return useMutation((data: any) => {
    return axios.get(`/general/join-match/${data.id}`)
  })
}

export { useConnect, useCreateUser, useCreateMatch, useMatch, useJoinMatch }
