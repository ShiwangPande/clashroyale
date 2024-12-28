import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Sparkles } from 'lucide-react';

interface CardProps {
  name: string;
  maxLevel: number;
  maxEvolutionLevel?: number;
  elixirCost?: number;
  iconUrls: {
    medium: string;
    evolutionMedium?: string;
  };
  rarity: string;
  isDragging: boolean;
}

const rarityConfig: {
  [key: string]: {
    bgColor: string;
    borderColor: string;
    textColor: string;
    gradient: string;
  };
} = {
  common: {
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-600',
    gradient: 'from-gray-200 to-gray-100'
  },
  rare: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    gradient: 'from-blue-200 to-blue-100'
  },
  epic: {
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    gradient: 'from-purple-200 to-purple-100'
  },
  legendary: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-600',
    gradient: 'from-yellow-200 to-yellow-100'
  }
};

const Card: React.FC<CardProps> = ({
  name,
  maxLevel,
  maxEvolutionLevel,
  elixirCost,
  iconUrls,
  rarity,
  isDragging
}) => {
  const config = rarityConfig[rarity.toLowerCase()];
  
  return (
    <motion.div
      className={`
        relative rounded-lg overflow-hidden transition-all duration-200
        ${config.bgColor} border-2 ${config.borderColor}
        ${isDragging ? 'shadow-2xl scale-105' : 'shadow-md hover:shadow-lg'}
      `}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Elixir Cost Badge */}
      {elixirCost !== undefined && (
        <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
          {elixirCost}
        </div>
      )}
      
      {/* Rarity Badge */}
      <div className="absolute top-2 right-2">
        <Badge variant="secondary" className={`${config.textColor} ${config.bgColor}`}>
          {rarity === 'legendary' && <Sparkles className="w-3 h-3 mr-1" />}
          {rarity}
        </Badge>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-3">
            <motion.img
              src={iconUrls.medium}
              alt={name}
              className="w-full h-full object-contain rounded-lg"
              whileHover={{ scale: 1.1 }}
            />
            {iconUrls.evolutionMedium && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-center mb-2 line-clamp-1">
            {name}
          </h3>
          
          <div className="w-full grid grid-cols-2 gap-2 text-sm">
            <div className={`text-center p-1 rounded ${config.bgColor}`}>
              <div className="text-xs text-gray-500">Level</div>
              <div className="font-semibold">{maxLevel}</div>
            </div>
            {maxEvolutionLevel && (
              <div className={`text-center p-1 rounded ${config.bgColor}`}>
                <div className="text-xs text-gray-500">Evolution</div>
                <div className="font-semibold">{maxEvolutionLevel}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;