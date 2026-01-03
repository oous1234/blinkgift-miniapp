import React from "react"
import { Box } from "@chakra-ui/react"

interface GiftRibbonProps {
    num: number
    id: string
    // Можно передавать цвета, если они разные для разных подарков
    colors?: {
        from: string
        to: string
        text: string
    }
}

export const GiftRibbon: React.FC<GiftRibbonProps> = ({
                                                          num,
                                                          id,
                                                          // Цвета по умолчанию (коричневые, как в твоем примере Trapped Heart)
                                                          colors = { from: "#462f24", to: "#4a3226", text: "#ebd4c8" }
                                                      }) => {
    const gradientId = `ribbon-gradient-${id}`

    return (
        <Box
            position="absolute"
            top="-1px"    // Slight overlap as in the example
            right="-1px"
            width="50%"   // Размер ленты относительно карточки
            height="50%"
            zIndex={5}
            pointerEvents="none" // Чтобы клики проходили сквозь ленту
        >
            <svg
                viewBox="0 0 143 143"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMaxYMin meet"
            >
                <defs>
                    <linearGradient
                        id={gradientId}
                        x1="67.6"
                        y1="0.7"
                        x2="66.8"
                        y2="150.5"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor={colors.from} />
                        <stop offset="100%" stopColor={colors.to} />
                    </linearGradient>
                </defs>

                {/* Сама форма ленточки */}
                <path
                    d="M142.955 85.6388L143.219 138.241C143.242 142.924 137.592 145.24 134.264 141.912L1.74315 9.39118C-1.58478 6.06325 0.732005 0.413184 5.41483 0.436751L58.0168 0.701021C60.8049 0.714935 63.4843 1.83591 65.4658 3.81738L139.838 78.1898C141.82 80.1713 142.941 82.8507 142.955 85.6388Z"
                    fill={`url(#${gradientId})`}
                />

                {/* Текст номера, повернутый на 45 градусов */}
                <text
                    x="85"
                    y="58"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={colors.text}
                    fontSize="28"
                    fontWeight="500"
                    transform="rotate(45, 85, 58)"
                >
                    #{num}
                </text>
            </svg>
        </Box>
    )
}