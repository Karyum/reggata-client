import { colors } from '@/lib/constants'
import { Modal, Button } from 'antd'

interface WinnerModalProps {
  winner: string
  open: boolean
  setOpen: (open: boolean) => void
  reset: () => void
}

const WinnerModal = ({ winner, open, setOpen, reset }: WinnerModalProps) => {
  const color = colors.find((color) => color.hex === winner)?.name

  return (
    <Modal
      title="Game Over"
      open={open}
      footer={[
        // replay button
        <Button key="replay" onClick={() => reset()} type="primary">
          Replay
        </Button>
      ]}
    >
      <div>
        <h1>The winner is {color}!</h1>
      </div>
    </Modal>
  )
}

export default WinnerModal
