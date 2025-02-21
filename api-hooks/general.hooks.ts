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

const useBoard = (id: string) => {
  return useQuery(['board', id], () => axios.get(`/general/board/${id}`).then((res) => res.data))
}

const useJoinMatch = () => {
  return useMutation((data: any) => {
    return axios.get(`/general/join-match/${data.id}`)
  })
}

const useFlip = () => {
  return useMutation((data: any) => {
    return axios.post(`/general/flip/${data.matchId}`, data)
  })
}

const useMove = () => {
  return useMutation((data: any) => {
    return axios.post(`/general/move/${data.matchId}`, data)
  })
}

const useReset = () => {
  return useMutation((data: any) => {
    return axios.post(`/general/reset/${data.matchId}`, data)
  })
}

const useEndTurn = () => {
  return useMutation((data: any) => {
    return axios.post(`/general/end-turn/${data.matchId}`, data)
  })
}

export {
  useConnect,
  useCreateUser,
  useCreateMatch,
  useMatch,
  useJoinMatch,
  useFlip,
  useMove,
  useBoard,
  useReset,
  useEndTurn
}
