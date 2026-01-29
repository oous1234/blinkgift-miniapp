import React, { useEffect, useState } from "react"
import Lottie from "lottie-react"
import { Center, Spinner, Box } from "@chakra-ui/react"

interface LottieLoaderProps {
  url: string
  boxSize?: string | number
}

export const LottieLoader: React.FC<LottieLoaderProps> = ({ url, boxSize = "100%" }) => {
  const [animationData, setAnimationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load animation")
        return res.json()
      })
      .then((data) => {
        if (isMounted) {
          setAnimationData(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error("Lottie fetch error:", err)
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [url])

  if (loading) {
    return (
      <Center w={boxSize} h={boxSize}>
        <Spinner size="sm" color="brand.500" thickness="2px" />
      </Center>
    )
  }

  if (!animationData) {
    return <Box w={boxSize} h={boxSize} bg="whiteAlpha.100" borderRadius="full" />
  }

  return (
    <Box w={boxSize} h={boxSize}>
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  )
}