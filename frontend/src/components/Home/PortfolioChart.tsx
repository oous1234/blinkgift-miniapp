import React, { useMemo } from "react"



import { Box, Flex, Text, Button, HStack } from "@chakra-ui/react"


import { PortfolioHistory, HistoryPoint } from "../../types/owner"





interface PortfolioChartProps {


    history: PortfolioHistory


    selectedPeriod: keyof PortfolioHistory


    onPeriodChange: (period: keyof PortfolioHistory) => void


}





export const PortfolioChart: React.FC<PortfolioChartProps> = ({


                                                                  history,


                                                                  selectedPeriod,


                                                                  onPeriodChange,


                                                              }) => {


    const data = history[selectedPeriod] || []





    // Вычисляем координаты для SVG


    const chartParams = useMemo(() => {


        if (data.length < 2) return null





        const values = data.map((p) => p.average.ton)


        const min = Math.min(...values)


        const max = Math.max(...values)


        const range = max - min || 1 // Чтобы не делить на 0





        // Добавляем отступы (padding) сверху и снизу


        const padding = range * 0.1


        const displayMin = min - padding


        const displayMax = max + padding


        const displayRange = displayMax - displayMin





        const width = 300


        const height = 120





        const points = data.map((p, i) => {


            const x = (i / (data.length - 1)) * width


            const y = height - ((p.average.ton - displayMin) / displayRange) * height


            return `${x},${y}`


        }).join(" ")





        // Для заливки (Area)


        const areaPoints = `${points} ${width},${height} 0,${height}`





        return { points, areaPoints, width, height, first: values[0], last: values[values.length - 1] }


    }, [data])





    if (!chartParams) return <Box h="150px" />





    const isPositive = chartParams.last >= chartParams.first


    const strokeColor = isPositive ? "#4ADE80" : "#F87171"


    const fillColor = isPositive ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)"





    return (


        <Box>


            {/* Chart Period Selector */}


            <HStack spacing={2} mb={6} justify="center">


                {(["12h", "24h", "7d", "30d"] as const).map((period) => (


                    <Button


                        key={period}


                        size="xs"


                        variant={selectedPeriod === period ? "solid" : "ghost"}


                        colorScheme="blue"


                        borderRadius="8px"


                        onClick={() => onPeriodChange(period)}


                        fontSize="11px"


                        px={3}


                        bg={selectedPeriod === period ? "blue.500" : "whiteAlpha.100"}


                        _hover={{ bg: "whiteAlpha.200" }}


                    >


                        {period.toUpperCase()}


                    </Button>


                ))}


            </HStack>





            {/* SVG Chart */}


            <Box position="relative" w="100%" h="120px" mb={4}>


                <svg


                    viewBox={`0 0 ${chartParams.width} ${chartParams.height}`}


                    width="100%"


                    height="100%"


                    preserveAspectRatio="none"


                >


                    <defs>


                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">


                            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />


                            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />


                        </linearGradient>


                    </defs>





                    {/* Area under line */}


                    <polyline


                        fill="url(#chartGradient)"


                        points={chartParams.areaPoints}


                    />





                    {/* Main Line */}


                    <polyline


                        fill="none"


                        stroke={strokeColor}


                        strokeWidth="2.5"


                        strokeLinejoin="round"


                        strokeLinecap="round"


                        points={chartParams.points}


                    />


                </svg>


            </Box>


        </Box>


    )


}