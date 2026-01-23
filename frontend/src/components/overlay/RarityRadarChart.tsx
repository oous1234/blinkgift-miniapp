import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from 'recharts';
import { Box } from '@chakra-ui/react';

interface RarityRadarChartProps {
    attributes: {
        trait_type: string;
        rarity_percent: number;
    }[];
}

const RarityRadarChart: React.FC<RarityRadarChartProps> = ({ attributes }) => {
    // Трансформируем данные: инвертируем редкость, чтобы редкие черты были на краях
    const data = attributes.map((attr) => ({
        subject: attr.trait_type,
        // Если редкость 0.2%, значение будет 99.8 (почти край)
        // Если редкость 20%, значение будет 80
        value: 100 - attr.rarity_percent,
        fullMark: 100,
    }));

    return (
        <Box w="100%" h="220px" my={2}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    {/* Сетка паутинки */}
                    <PolarGrid stroke="#33373E" />

                    {/* Подписи осей */}
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#718096', fontSize: 10, fontWeight: 700 }}
                    />

                    {/* Сама фигура */}
                    <Radar
                        name="Rarity"
                        dataKey="value"
                        stroke="#00D1FF" // Твой brand.500
                        fill="#00D1FF"
                        fillOpacity={0.3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default RarityRadarChart;