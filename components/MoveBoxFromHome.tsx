import { useAnimate, motion } from 'framer-motion'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import styles from '../pages/index.module.scss'

interface MoveBoxFromHomeProps {
  to: string
  color: string
}

const MoveBoxFromHome = ({ to, color }: MoveBoxFromHomeProps) => {
  const [scope, animate] = useAnimate()
  let stop = false

  const moveToTarget = (id: string) => {
    const targetElement = document.getElementById(id)
    if (!targetElement || !scope.current) return

    const targetRect = targetElement.getBoundingClientRect()
    const initialRect = scope.current.getBoundingClientRect()

    // Calculate center of the target element
    const targetCenterX = targetRect.left + targetRect.width / 2
    const targetCenterY = targetRect.top + targetRect.height / 2

    // Calculate center of the motion element
    const initialCenterX = initialRect.left + initialRect.width / 2
    const initialCenterY = initialRect.top + initialRect.height / 2

    // Calculate movement to center the motion element on the target
    const x = targetCenterX - initialCenterX
    const y = targetCenterY - initialCenterY

    // using document find if there is an instance of motion framer motion, if yes prevent the animation
    console.log(1, stop, document.querySelector('.motion'))
    if (document.querySelector('.motion') || stop) {
      stop = true

      return
    } else {
      scope.current.classList.add('motion')
      requestAnimationFrame(() => {
        animate(scope.current, { x, y }, { duration: 0.4 })
        console.log(2, scope.current)
      })
    }
  }

  useEffect(() => {
    console.log(3, stop)
    moveToTarget(to)
  }, [])

  return (
    <motion.div
      ref={scope}
      style={{
        zIndex: 100
      }}
    >
      <div
        className={styles.token}
        style={{
          backgroundColor: color
        }}
      />
    </motion.div>
  )
}

interface MoveStepsProps {
  steps: string[] // Array of ids for the steps, might be 1 - 4 steps
  color: string
}

export const MoveSteps = ({ steps, color }: MoveStepsProps) => {
  const [scope, animate] = useAnimate()

  const moveToTarget = (ids: string[]) => {
    const targetElements = ids.map((id) => document.getElementById(id))
    if (targetElements.some((e) => !e) || !scope.current) return

    const targetRects = targetElements.map((e: any) => e.getBoundingClientRect())
    const initialRect = scope.current.getBoundingClientRect()

    // Calculate center of the target element
    const targetCenterX = targetRects.map((r) => r.left + r.width / 2)
    const targetCenterY = targetRects.map((r) => r.top + r.height / 2)

    // Calculate center of the motion element
    const initialCenterX = initialRect.left + initialRect.width / 2
    const initialCenterY = initialRect.top + initialRect.height / 2

    // Calculate movement to center the motion element on the target
    const x = targetCenterX.map((c) => c - initialCenterX)
    const y = targetCenterY.map((c) => c - initialCenterY)

    const animateSteps = async () => {
      for (let i = 0; i < x.length; i++) {
        await new Promise<void>((resolve) => {
          animate(scope.current, { x: x[i], y: y[i] }, { duration: 0.5 / x.length }).then(() =>
            resolve()
          )
        })
      }
    }

    animateSteps()
  }

  useEffect(() => {
    moveToTarget(steps)
  }, [])

  return (
    <motion.div
      ref={scope}
      style={{
        zIndex: 100,
        position: 'relative'
      }}
    >
      <div
        className={styles.token}
        style={{
          backgroundColor: color,
          zIndex: 100
        }}
      />
    </motion.div>
  )
}

export default MoveBoxFromHome
